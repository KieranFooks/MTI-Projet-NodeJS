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
import { UserRatingModel } from './Models/userRating';

@InputType()
export class RateNFTInput {
  @Field(() => Int)
  nftId: number;

  @Field(() => Int)
  rate: number;
}

@Resolver(UserRatingModel)
export class UserRatingResolver {
  constructor(@Inject(AppService) private appService: AppService) {}

  @Query(() => [UserRatingModel], { nullable: 'items' })
  myRatings() {
    return this.appService.userRating.findMany({
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
    return this.appService.userRating.upsert({
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
