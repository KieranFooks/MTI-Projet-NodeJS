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

  @Query(() => [UserRatingModel], {
    nullable: 'items',
    name: 'myRatings',
    description: 'Get all ratings of the logged user.',
  })
  myRatings(
    @CurrentUser() user: JWTUser,
    @Args('pagination', {
      nullable: true,
      type: () => PaginationInput,
      description: 'Optional argument used to paginate the query.',
    })
    pagination: PaginationInput | null,
  ) {
    return this.userRatingsService.findByUserId(user.userId, pagination);
  }

  @Mutation(() => UserRatingModel, {
    name: 'rateNft',
    description: 'Rate an NFT of another team.',
  })
  rateNft(
    @Args('rating', { description: 'The nft to rate and the rate.' })
    rating: RateNftInput,
    @CurrentUser() user: JWTUser,
  ) {
    return this.userRatingsService.create(rating, user.userId);
  }
}
