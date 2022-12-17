import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/auth/optional-jwt-auth.guard';
import { CurrentUser, JWTUser } from '../users/users.decorator';
import { CollectionModel } from '../Models/collection';
import { CollectionsService } from './collections.service';
import { CreateCollectionInput } from './dto/createCollection.input';
import { UpdateCollectionInput } from './dto/updateCollection.input';
import { PaginationInput } from '../users/dto/pagination.input';

@Resolver(CollectionModel)
export class CollectionsResolver {
  constructor(
    @Inject(CollectionsService) private collectionsService: CollectionsService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [CollectionModel], { nullable: 'items' })
  collections(
    @CurrentUser() user: JWTUser,
    @Args('pagination', { nullable: true, type: () => PaginationInput })
    pagination: PaginationInput | null,
  ) {
    return this.collectionsService.findAll(user, pagination);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => CollectionModel, { nullable: true })
  collection(@Args('id') id: number, @CurrentUser() user: JWTUser) {
    return this.collectionsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CollectionModel)
  createCollection(
    @Args('collection') collection: CreateCollectionInput,
    @CurrentUser() user: JWTUser,
  ) {
    return this.collectionsService.create(collection, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CollectionModel)
  updateCollection(
    @Args('collection') collection: UpdateCollectionInput,
    @CurrentUser() user: JWTUser,
  ) {
    return this.collectionsService.update(collection, user);
  }
}
