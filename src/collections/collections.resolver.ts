import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import console from 'console';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/common/auth/optional-jwt-auth.guard';
import { CurrentUser, JWTUser } from 'src/users/users.decorator';
import { CollectionModel } from '../Models/collection';
import { CollectionsService } from './collections.service';
import { CreateCollectionInput } from './dto/createCollection.input';
import { UpdateCollectionInput } from './dto/updateCollection.input';

@Resolver(CollectionModel)
export class CollectionsResolver {
  constructor(
    @Inject(CollectionsService) private collectionsService: CollectionsService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [CollectionModel], { nullable: 'items' })
  collections(@CurrentUser() user: JWTUser) {
    return this.collectionsService.findAll(user);
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
