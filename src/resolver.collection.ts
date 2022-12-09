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
import { Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CollectionModel } from './Models/collection';
import { NFTModel } from './Models/nft';

@InputType()
export class CreateCollectionInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  logo: string;

  @Field(() => Date, { nullable: true })
  timeAutoArchiving: Date;

  @Field(() => [NFTModel], { nullable: true })
  NFTs: NFTModel[];
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

  @Query(() => [CollectionModel], { nullable: 'items' })
  collection(@Args('id') id: number) {
    return this.appService.collection.findMany({
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
        creatorTeamId: 1,
        NFTs: {
          createMany: {
            data: collection.NFTs.map((nft) => ({ ...nft, teamId: 1 })),
          },
        },
      },
    });
  }
}
