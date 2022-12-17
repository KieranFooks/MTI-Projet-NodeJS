import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PaginationInput } from 'src/users/dto/pagination.input';
import { CollectionsService } from '../collections/collections.service';
import { GraphService } from '../common/graph/graph.service';
import { TeamsService } from '../teams/teams.service';
import { JWTUser } from '../users/users.decorator';
import { UsersService } from '../users/users.service';
import { CreateNftInput } from './dto/createNft.input';
import { UpdateNftInput } from './dto/updateNft.input';

@Injectable()
export class NftsService {
  constructor(
    @Inject(GraphService) private graphService: GraphService,
    @Inject(TeamsService) private teamsService: TeamsService,
    @Inject(CollectionsService) private collectionsService: CollectionsService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  async findAll(user: JWTUser, pagination: PaginationInput | null) {
    if (user == null) {
      return this.graphService.nft.findMany({
        where: {
          status: Status.PUBLISHED,
        },
        include: {
          team: false,
          collection: false,
          transactions: false,
          userRating: false,
        },
        take: pagination?.limit,
        skip: pagination?.offset,
      });
    }

    const userDb = (await this.usersService.findOne(user.userId))!;
    if (userDb.role === Role.ADMIN) {
      return this.graphService.nft.findMany({
        include: {
          team: true,
          collection: true,
          transactions: true,
          userRating: true,
        },
      });
    }

    if (userDb.teamId == null) {
      return this.graphService.nft.findMany({
        where: {
          status: Status.PUBLISHED,
        },
        include: {
          team: true,
          collection: true,
          transactions: true,
          userRating: true,
        },
      });
    }

    return this.graphService.nft.findMany({
      where: {
        OR: [
          {
            status: Status.PUBLISHED,
          },
          {
            teamId: userDb.teamId,
          },
        ],
      },
      include: {
        team: true,
        collection: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  async findOne(id: number, user: JWTUser) {
    if (user == null) {
      return this.graphService.nft.findFirst({
        where: {
          id,
          status: Status.PUBLISHED,
        },
        include: {
          team: false,
          collection: false,
        },
      });
    }

    const userDb = (await this.usersService.findOne(user.userId))!;
    if (userDb.role === Role.ADMIN) {
      return this.graphService.nft.findUnique({
        where: {
          id,
        },
        include: {
          team: true,
          collection: true,
        },
      });
    }

    if (userDb.teamId == null) {
      return this.graphService.nft.findFirst({
        where: {
          id,
          status: Status.PUBLISHED,
        },
        include: {
          team: true,
          collection: true,
        },
      });
    }

    return this.graphService.nft.findFirst({
      where: {
        id,
        OR: [
          {
            status: Status.PUBLISHED,
          },
          {
            teamId: user.payload.teamId,
          },
        ],
      },
      include: {
        team: true,
        collection: true,
      },
    });
  }

  async create(nftCreateInput: CreateNftInput, user: JWTUser) {
    if (user.payload.teamId == null) {
      throw new ConflictException(`User must be in a team`);
    }
    if (nftCreateInput.price < 0) {
      throw new BadRequestException(`Price must be greater than 0`);
    }

    const collection = await this.collectionsService.findOne(
      nftCreateInput.collectionId,
      user,
    );
    if (collection == null) {
      throw new NotFoundException(
        `Collection with id ${nftCreateInput.collectionId} does not exist`,
      );
    }

    if (user.payload.role != Role.ADMIN) {
      if (collection.creatorTeamId !== user.payload.teamId) {
        throw new ConflictException(
          `Collection with id ${nftCreateInput.collectionId} does not belong to your team`,
        );
      }
      if (collection.status === Status.ARCHIVED) {
        throw new ConflictException(
          `Collection with id ${nftCreateInput.collectionId} is archived`,
        );
      }
    }

    return this.graphService.nft.create({
      data: {
        name: nftCreateInput.name,
        image: nftCreateInput.image,
        price: nftCreateInput.price,
        status: nftCreateInput.status ?? undefined,
        teamId: user.payload.teamId,
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

  async update(nftUpdateInput: UpdateNftInput, user: JWTUser) {
    if (user.payload.teamId == null) {
      throw new ConflictException(`User must be in a team`);
    }
    if (nftUpdateInput.price !== null && nftUpdateInput.price < 0) {
      throw new BadRequestException(`Price must be greater than 0`);
    }

    const dbNft = await this.findOne(nftUpdateInput.id, user);

    if (!dbNft) {
      throw new NotFoundException(`NFT with id ${nftUpdateInput.id} not found`);
    }

    if (user.payload.role != Role.ADMIN) {
      if (dbNft.status === Status.ARCHIVED) {
        throw new ConflictException(
          `NFT with id ${nftUpdateInput.id} is archived`,
        );
      }

      if (
        nftUpdateInput.status == Status.DRAFT &&
        dbNft.status == Status.PUBLISHED
      ) {
        throw new ConflictException(`Status can only be increased`);
      }
    }

    return this.graphService.nft.update({
      where: {
        id: nftUpdateInput.id,
      },
      data: {
        price: nftUpdateInput.price ?? undefined,
        status: nftUpdateInput.status ?? undefined,
      },
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  async buyNft(id: number, user: JWTUser) {
    const nftDb = await this.findOne(id, user);
    if (!nftDb) {
      throw new NotFoundException(`NFT with id ${id} not found`);
    }
    if (nftDb.status !== Status.PUBLISHED) {
      throw new ConflictException(`NFT with id ${id} is not published`);
    }

    const buyerTeamDb = await this.teamsService.findOne(user.payload.teamId);
    if (!buyerTeamDb) {
      throw new NotFoundException(
        `Team with id ${user.payload.teamId} not found`,
      );
    }
    if (buyerTeamDb.balance < nftDb.price) {
      throw new ConflictException(`Not enough balance`);
    }

    const updateNftPromise = this.graphService.nft.update({
      where: {
        id,
      },
      data: {
        teamId: user.payload.teamId,
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
        id: user.userId,
      },
      data: {
        balance: {
          decrement: nftDb.price,
        },
      },
    });

    const updateSellerTeamPromise = this.graphService.team.update({
      where: {
        id: nftDb.teamId,
      },
      data: {
        balance: {
          increment: nftDb.price,
        },
      },
    });

    const createTransactionPromise = this.graphService.transactions.create({
      data: {
        nftId: id,
        buyerId: user.userId,
        sellerTeamId: nftDb.teamId,
        amount: nftDb.price,
      },
    });

    const [updatedNft] = await this.graphService.$transaction([
      updateNftPromise,
      updateBuyerTeamPromise,
      updateSellerTeamPromise,
      createTransactionPromise,
    ]);

    return updatedNft;
  }

  async mostRatedNfts(top: number) {
    const nfts = await this.graphService.nft.findMany({
      include: {
        userRating: {
          select: {
            rate: true,
          },
        },
        collection: true,
        team: true,
        transactions: true,
      },
    });

    const nftsWithRating = nfts.map((nft) => {
      const averageRate =
        nft.userRating.length === 0
          ? 0
          : nft.userRating.reduce((acc, curr) => {
              return acc + curr.rate;
            }, 0) / nft.userRating.length;

      return {
        ...nft,
        averageRate,
      };
    });

    return nftsWithRating
      .sort((a, b) => b.averageRate - a.averageRate)
      .slice(0, top);
  }
}
