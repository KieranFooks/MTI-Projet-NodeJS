import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { GraphService } from 'src/common/graph/graph.service';
import { TeamsService } from 'src/teams/teams.service';
import { CreateNFTInput } from './dto/createNFT.input';
import { UpdateNFTInput } from './dto/updateNFT.input';

@Injectable()
export class NFTsService {
  constructor(
    @Inject(GraphService) private graphService: GraphService,
    @Inject(TeamsService) private teamsService: TeamsService,
  ) {}

  fintAll() {
    return this.graphService.nFT.findMany({
      include: {
        team: true,
        collection: true,
      },
    });
  }

  findOne(id: number) {
    return this.graphService.nFT.findUnique({
      where: { id },
      include: {
        team: true,
        collection: true,
      },
    });
  }

  create(nftCreateInput: CreateNFTInput) {
    if (nftCreateInput.price < 0) {
      throw new BadRequestException(`Price must be greater than 0`);
    }

    return this.graphService.nFT.create({
      data: {
        name: nftCreateInput.name,
        image: nftCreateInput.image,
        price: nftCreateInput.price,
        status: nftCreateInput.status,
        teamId: 1, // FIXME: hardcoded
        collectionId: nftCreateInput.collectionId,
      },
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  async update(nftUpdateInput: UpdateNFTInput) {
    const dbNFT = await this.graphService.nFT.findUnique({
      where: {
        id: nftUpdateInput.id,
      },
    });

    if (!dbNFT) {
      throw new NotFoundException(`NFT with id ${nftUpdateInput.id} not found`);
    }
    // TODO: remove if admin
    if (dbNFT.status === Status.ARCHIVED) {
      throw new BadRequestException(
        `NFT with id ${nftUpdateInput.id} is archived`,
      );
    }
    if (nftUpdateInput.price !== null && nftUpdateInput.price < 0) {
      throw new BadRequestException(`Price must be greater than 0`);
    }
    // TODO: remove if admin
    if (
      nftUpdateInput.status !== null &&
      nftUpdateInput.status < dbNFT.status
    ) {
      throw new BadRequestException(`Status can only be increased`);
    }

    return this.graphService.nFT.update({
      where: {
        id: nftUpdateInput.id,
      },
      data: {
        price: nftUpdateInput.price,
      },
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  async buyNFT(id: number) {
    const nftDb = await this.findOne(id);
    if (!nftDb) {
      throw new NotFoundException(`NFT with id ${id} not found`);
    }
    if (nftDb.status !== Status.PUBLISHED) {
      throw new ConflictException(`NFT with id ${id} is not published`);
    }

    const buyerTeamDb = await this.teamsService.findOne(1); // FIXME: hardcoded
    if (buyerTeamDb.balance < nftDb.price) {
      throw new ConflictException(`Not enough balance`);
    }

    const updateNFTPromise = this.graphService.nFT.update({
      where: {
        id,
      },
      data: {
        teamId: 1, // FIXME: hardcoded
      },
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });

    const updateBuyerTeamPromise = this.graphService.team.update({
      where: {
        id: 1, // FIXME: hardcoded
      },
      data: {
        balance: {
          decrement: nftDb.price,
        },
      },
    });

    const [updatedNFT, _] = await this.graphService.$transaction([
      updateNFTPromise,
      updateBuyerTeamPromise,
    ]);

    return updatedNFT;
  }
}
