import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { GraphService } from '../common/graph/graph.service';
import { NFTModel } from '../Models/nft';
import { CreateNFTInput } from './dto/createNFT.input';
import { UpdateNFTInput } from './dto/updateNFT.input';

@Resolver(NFTModel)
export class NFTsResolver {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  @Query(() => [NFTModel], { nullable: 'items' })
  nfts() {
    return this.graphService.nFT.findMany({
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  @Query(() => NFTModel, { nullable: true })
  nft(@Args('id') id: number) {
    return this.graphService.nFT.findMany({
      where: {
        id,
      },
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  @Mutation(() => NFTModel)
  createNFT(@Args('nft') nft: CreateNFTInput) {
    if (nft.price < 0) {
      throw new BadRequestException(`Price must be greater than 0`);
    }

    return this.graphService.nFT.create({
      data: {
        name: nft.name,
        image: nft.image,
        price: nft.price,
        status: nft.status,
        teamId: 1, // FIXME: hardcoded
        collectionId: nft.collectionId,
      },
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  @Mutation(() => NFTModel)
  async updateNFT(@Args('nft') nft: UpdateNFTInput) {
    const dbNFT = await this.graphService.nFT.findUnique({
      where: {
        id: nft.id,
      },
    });

    if (!dbNFT) {
      throw new NotFoundException(`NFT with id ${nft.id} not found`);
    }
    // TODO: remove if admin
    if (dbNFT.status === Status.ARCHIVED) {
      throw new BadRequestException(`NFT with id ${nft.id} is archived`);
    }
    if (nft.price !== null && nft.price < 0) {
      throw new BadRequestException(`Price must be greater than 0`);
    }
    // TODO: remove if admin
    if (nft.status !== null && nft.status < dbNFT.status) {
      throw new BadRequestException(`Status can only be increased`);
    }

    return this.graphService.nFT.update({
      where: {
        id: nft.id,
      },
      data: {
        price: nft.price,
      },
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  @Mutation(() => NFTModel)
  async buyNFT(@Args('id') id: number) {
    const nftDb = await this.graphService.nFT.findUnique({
      where: {
        id,
      },
    });
    if (!nftDb) {
      throw new NotFoundException(`NFT with id ${id} not found`);
    }
    if (nftDb.status !== Status.PUBLISHED) {
      throw new ConflictException(`NFT with id ${id} is not published`);
    }

    const buyerTeamDb = await this.graphService.team.findUnique({
      where: {
        id: 1, // FIXME: hardcoded
      },
    });
    if (buyerTeamDb.balance < nftDb.price) {
      throw new ConflictException(`Not enough balance`);
    }

    return this.graphService.nFT.update({
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
  }
}
