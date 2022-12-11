import 'reflect-metadata';
import {
  Resolver,
  InputType,
  Field,
  Query,
  Int,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { Inject, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { CollectionModel } from './Models/collection';
import { NFTInput, NFTModel } from './Models/nft';
import { Status } from '@prisma/client';

@InputType()
export class CreateCollectionInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  logo: string | null;

  @Field(() => Date, { nullable: true })
  timeAutoArchiving: Date | null;

  @Field(() => [NFTInput], { nullable: 'items' })
  NFTs: NFTInput[];
}

@InputType()
export class UpdateCollectionInput {
  @Field(() => Int)
  collectionId: number;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  logo: string | null;

  @Field(() => Date, { nullable: true })
  timeAutoArchiving: Date | null;

  @Field(() => Status, { nullable: true })
  status: Status | null;
}

@Resolver(CollectionModel)
export class CollectionResolver {
  constructor(@Inject(AppService) private appService: AppService) {}

  @Query(() => [CollectionModel], { nullable: 'items' })
  collections() {
    return this.appService.collection.findMany({
      include: {
        creatorTeam: true,
        NFTs: true,
      },
    });
  }

  @Query(() => CollectionModel, { nullable: true })
  async collection(@Args('id') id: number) {
    return this.appService.collection.findUnique({
      where: {
        id,
      },
      include: {
        creatorTeam: true,
        NFTs: true,
      },
    });
  }

  @Mutation(() => CollectionModel)
  createCollection(@Args('collection') collection: CreateCollectionInput) {
    return this.appService.collection.create({
      data: {
        name: collection.name,
        logo: collection.logo,
        timeAutoArchiving: collection.timeAutoArchiving,
        creatorTeamId: 1, // FIXME: Hardcoded
        NFTs: {
          createMany: {
            data: collection.NFTs.map((nft) => ({ ...nft, teamId: 1 })), // FIXME: Hardcoded
          },
        },
      },
    });
  }

  @Mutation(() => CollectionModel)
  async updateCollection(
    @Args('collection') collection: UpdateCollectionInput,
  ) {
    const collectionDb = await this.appService.collection.findUnique({
      where: {
        id: collection.collectionId,
      },
    });
    if (!collectionDb) {
      throw new NotFoundException('Collection not found');
    }

    return this.appService.collection.update({
      where: {
        id: collection.collectionId,
      },
      data: {
        name: collection.name,
        logo: collection.logo,
        timeAutoArchiving: collection.timeAutoArchiving,
        status: collection.status,
      },
    });
  }
}
