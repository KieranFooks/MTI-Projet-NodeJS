import { Inject, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphService } from '../common/graph/graph.service';
import { CollectionModel } from '../Models/collection';
import { CreateCollectionInput } from './dto/createCollection.input';
import { UpdateCollectionInput } from './dto/updateCollection.input';

@Resolver(CollectionModel)
export class CollectionsResolver {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  @Query(() => [CollectionModel], { nullable: 'items' })
  collections() {
    return this.graphService.collection.findMany({
      include: {
        creatorTeam: true,
        NFTs: true,
      },
    });
  }

  @Query(() => CollectionModel, { nullable: true })
  async collection(@Args('id') id: number) {
    return this.graphService.collection.findUnique({
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
    return this.graphService.collection.create({
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
    const collectionDb = await this.graphService.collection.findUnique({
      where: {
        id: collection.collectionId,
      },
    });
    if (!collectionDb) {
      throw new NotFoundException('Collection not found');
    }

    return this.graphService.collection.update({
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
