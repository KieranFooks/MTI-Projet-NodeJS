import 'reflect-metadata';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { NFTModel } from './nft';
import { UserModel } from './user';

@ObjectType('transactions')
export class TransactionsModel {
  @Field(() => Int)
  id: number;

  @Field(() => NFTModel)
  nft: NFTModel;

  @Field(() => UserModel)
  seller: UserModel;

  @Field(() => UserModel)
  buyer: UserModel;

  @Field(() => Number)
  amount: number;

  @Field(() => Date)
  timestamp: Date;
}
