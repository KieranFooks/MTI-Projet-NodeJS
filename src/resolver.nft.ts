import 'reflect-metadata';
import {
  Resolver,
  InputType,
  Field,
  Query,
  Int,
  Args,
  Mutation,
  Float,
} from '@nestjs/graphql';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { NFTModel } from './Models/nft';
import { NFT, Status } from '@prisma/client';
import { PersistedQueryNotFoundError } from 'apollo-server-errors';

@InputType()
export class CreateNFTInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int, { nullable: true })
  collectionId: number | null;

  @Field(() => Status, { nullable: true })
  status: Status | null;
}

@InputType()
export class UpdateNFTInput {
  @Field(() => Int)
  id: number;

  @Field(() => Status, { nullable: true })
  status: Status | null;

  @Field(() => Float, { nullable: true })
  price: number | null;
}

@InputType()
export class RateNFTInput {
  @Field(() => Int)
  nftId: number;

  @Field(() => Int)
  rate: number;
}

@Resolver(NFTModel)
export class NFTResolver {
  constructor(@Inject(AppService) private appService: AppService) {}

  @Query(() => [NFTModel], { nullable: 'items' })
  nfts() {
    return this.appService.nFT.findMany({
      include: {
        collection: true,
        team: true,
        transactions: true,
        userRating: true,
      },
    });
  }

  @Query(() => [NFTModel], { nullable: 'items' })
  nft(@Args('id') id: number) {
    return this.appService.nFT.findMany({
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

    return this.appService.nFT.create({
      data: {
        name: nft.name,
        image: nft.image,
        price: nft.price,
        status: nft.status,
        team: {
          connect: {
            id: 1,
          },
        },
        collection: {
          connect: {
            id: nft.collectionId,
          },
        },
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
    const dbNFT = await this.appService.nFT.findUnique({
      where: {
        id: nft.id,
      },
    });

    if (!dbNFT) {
      throw new NotFoundException(`NFT with id ${nft.id} not found`);
    }
    if (dbNFT.status === Status.ARCHIVED) {
      throw new BadRequestException(`NFT with id ${nft.id} is archived`);
    }
    if (nft.price !== null && nft.price < 0) {
      throw new BadRequestException(`Price must be greater than 0`);
    }
    if (nft.status !== null && nft.status < dbNFT.status) {
      throw new BadRequestException(`Status can only be increased`);
    }

    return this.appService.nFT.update({
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
  rateNFT(@Args('rating') rating: RateNFTInput) {
    return this.appService.userRating.create({
      data: {
        rate: rating.rate,
        nft: {
          connect: {
            id: rating.nftId,
          },
        },
        user: {
          connect: {
            id: 1,
          },
        },
      },
      include: {
        nft: true,
        user: true,
      },
    });
  }
}
