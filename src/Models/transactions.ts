import { Field, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { NftModel } from './nft';
import { UserModel } from './user';

@ObjectType('transactions')
export class TransactionsModel {
  @Field(() => Int)
  id: number;

  @Field(() => NftModel)
  nft: NftModel;

  @Field(() => UserModel)
  sellerTeam: UserModel;

  @Field(() => UserModel)
  buyer: UserModel;

  @Field(() => Number)
  amount: number;

  @Field(() => Date)
  timestamp: Date;
}
