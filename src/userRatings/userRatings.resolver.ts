import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphService } from '../common/graph/graph.service';
import { UserRatingModel } from '../Models/userRating';
import { RateNFTInput } from './dto/rateNFT.input';

@Resolver(UserRatingModel)
export class UserRatingsResolver {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  @Query(() => [UserRatingModel], { nullable: 'items' })
  myRatings() {
    return this.graphService.userRating.findMany({
      where: {
        userId: 1, // FIXME: Hardcoded
      },
      include: {
        nft: true,
        user: true,
      },
    });
  }

  @Mutation(() => UserRatingModel)
  rateNFT(@Args('rating') rating: RateNFTInput) {
    return this.graphService.userRating.upsert({
      where: {
        NFTId_userId: {
          NFTId: rating.nftId,
          userId: 1, // FIXME: Hardcoded
        },
      },
      update: {
        rate: rating.rate,
      },
      create: {
        NFTId: rating.nftId,
        userId: 1, // FIXME: Hardcoded
        rate: rating.rate,
      },
      include: {
        nft: true,
        user: true,
      },
    });
  }
}
