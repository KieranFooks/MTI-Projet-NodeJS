import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRatingModel } from '../Models/userRating';
import { RateNFTInput } from './dto/rateNFT.input';
import { UserRatingsService } from './userRatings.service';

@Resolver(UserRatingModel)
export class UserRatingsResolver {
  constructor(
    @Inject(UserRatingsService) private userRatingsService: UserRatingsService,
  ) {}

  @Query(() => [UserRatingModel], { nullable: 'items' })
  myRatings() {
    return this.userRatingsService.findByUserId(1); // FIXME: Hardcoded
  }

  @Mutation(() => UserRatingModel)
  rateNFT(@Args('rating') rating: RateNFTInput) {
    return this.userRatingsService.create(rating);
  }
}
