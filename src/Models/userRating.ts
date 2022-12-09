import 'reflect-metadata';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { NFTModel } from './nft';
import { UserModel } from './user';

@ObjectType('userRating')
export class UserRatingModel {
  @Field(() => Int)
  id: number;

  @Field(() => NFTModel)
  nft: NFTModel;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => Int)
  rate: number;

  @Field(() => Date)
  timestamp: Date;

  @Field(() => Int)
  nftId: number;

  @Field(() => Int)
  userId: number;
}
