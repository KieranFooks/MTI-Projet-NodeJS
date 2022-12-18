import { Field, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { NftModel } from './nft';
import { UserModel } from './user';

@ObjectType('userRating', { description: 'A rating of an NFT by another user' })
export class UserRatingModel {
  @Field(() => Int, { description: 'Unique identifier for the rating' })
  id: number;

  @Field(() => NftModel, { description: 'NFT that was rated' })
  nft: NftModel;

  @Field(() => UserModel, { description: 'User that rated the NFT' })
  user: UserModel;

  @Field(() => Int, { description: 'Rating of the NFT' })
  rate: number;

  @Field(() => Date, { description: 'Timestamp of the rating' })
  timestamp: Date;
}
