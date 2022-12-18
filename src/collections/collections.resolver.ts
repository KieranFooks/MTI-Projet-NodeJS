import { Inject, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/auth/optional-jwt-auth.guard';
import { CurrentUser, JWTUser } from '../users/users.decorator';
import { CollectionModel } from '../Models/collection';
import { CollectionsService } from './collections.service';
import { CreateCollectionInput } from './dto/createCollection.input';
import { UpdateCollectionInput } from './dto/updateCollection.input';
import { PaginationInput } from '../users/dto/pagination.input';
import { BestSellersCollectionOutput } from './dto/best-sellers-collection.output';

@Resolver(CollectionModel)
export class CollectionsResolver {
  constructor(
    @Inject(CollectionsService) private collectionsService: CollectionsService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [CollectionModel], {
    nullable: 'items',
    name: 'collections',
    description:
      "Get all collections. If a user is not connected or if the user has no team, the published collections are returned. If the user has a team, the published collections and the collections of the user's team are returned. If the user is an admin, all collections are returned.",
  })
  collections(
    @CurrentUser() user: JWTUser,
    @Args('pagination', {
      nullable: true,
      type: () => PaginationInput,
      description: 'Optional argument used to paginate the query.',
    })
    pagination: PaginationInput | null,
  ) {
    return this.collectionsService.findAll(user, pagination);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => CollectionModel, {
    nullable: true,
    name: 'collection',
    description:
      'Get collection by id. If the collection is not published, the user must be connected and be part of the team that owns the collection or be an admin.',
  })
  collection(
    @Args('id', { description: 'The id of the colletion' }) id: number,
    @CurrentUser() user: JWTUser,
  ) {
    return this.collectionsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CollectionModel, {
    name: 'createCollection',
    description:
      'Create a new collection. You need to be logged in to use this mutation.',
  })
  createCollection(
    @Args('collection', { description: 'The collection information' })
    collection: CreateCollectionInput,
    @CurrentUser() user: JWTUser,
  ) {
    return this.collectionsService.create(collection, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CollectionModel, {
    name: 'updateCollection',
    description:
      'Update a collection. You need to be logged in to use this mutation.',
  })
  updateCollection(
    @Args('collection', { description: 'The informations to update' })
    collection: UpdateCollectionInput,
    @CurrentUser() user: JWTUser,
  ) {
    return this.collectionsService.update(collection, user);
  }

  @Query(() => [BestSellersCollectionOutput], {
    nullable: 'items',
    name: 'bestSellerCollections',
    description: 'Get the best seller collections.',
  })
  bestSellerCollections(
    @Args('top', {
      type: () => Int,
      description: 'The number of collections to return',
    })
    top: number,
  ) {
    return this.collectionsService.bestSellerCollections(top);
  }
}
