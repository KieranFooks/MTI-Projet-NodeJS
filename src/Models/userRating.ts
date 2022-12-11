import { Field, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { NftModel } from './nft';
import { UserModel } from './user';

@ObjectType('userRating')
export class UserRatingModel {
  @Field(() => Int)
  id: number;

  @Field(() => NftModel)
  nft: NftModel;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => Int)
  rate: number;

  @Field(() => Date)
  timestamp: Date;
}
