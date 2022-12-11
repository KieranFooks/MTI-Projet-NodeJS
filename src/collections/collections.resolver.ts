import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CollectionModel } from '../Models/collection';
import { CollectionsService } from './collections.service';
import { CreateCollectionInput } from './dto/createCollection.input';
import { UpdateCollectionInput } from './dto/updateCollection.input';

@Resolver(CollectionModel)
export class CollectionsResolver {
  constructor(
    @Inject(CollectionsService) private collectionsService: CollectionsService,
  ) {}

  @Query(() => [CollectionModel], { nullable: 'items' })
  collections() {
    return this.collectionsService.findAll();
  }

  @Query(() => CollectionModel, { nullable: true })
  collection(@Args('id') id: number) {
    return this.collectionsService.findOne(id);
  }

  @Mutation(() => CollectionModel)
  createCollection(@Args('collection') collection: CreateCollectionInput) {
    return this.collectionsService.create(collection);
  }

  @Mutation(() => CollectionModel)
  updateCollection(@Args('collection') collection: UpdateCollectionInput) {
    return this.collectionsService.update(collection);
  }
}
