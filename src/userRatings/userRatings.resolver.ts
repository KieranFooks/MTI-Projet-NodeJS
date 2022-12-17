import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, JWTUser } from '../users/users.decorator';
import { UserRatingModel } from '../Models/userRating';
import { RateNftInput } from './dto/rateNFT.input';
import { UserRatingsService } from './userRatings.service';
import { PaginationInput } from '../users/dto/pagination.input';

@Resolver(UserRatingModel)
export class UserRatingsResolver {
  constructor(
    @Inject(UserRatingsService) private userRatingsService: UserRatingsService,
  ) {}

  @Query(() => [UserRatingModel], { nullable: 'items' })
  myRatings(
    @CurrentUser() user: JWTUser,
    @Args('pagination', { nullable: true, type: () => PaginationInput })
    pagination: PaginationInput | null,
  ) {
    return this.userRatingsService.findByUserId(user.userId, pagination);
  }

  @Mutation(() => UserRatingModel)
  rateNft(@Args('rating') rating: RateNftInput, @CurrentUser() user: JWTUser) {
    return this.userRatingsService.create(rating, user.userId);
  }
}
