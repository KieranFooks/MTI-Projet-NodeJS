import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { NftModel } from './nft';
import { UserModel } from './user';

@ObjectType('transactions', { description: 'A transaction of NFT' })
export class TransactionsModel {
  @Field(() => Int, { description: 'Unique identifier for the transaction' })
  id: number;

  @Field(() => NftModel, { description: 'NFT that was bought' })
  nft: NftModel;

  @Field(() => UserModel, { description: 'Team that sold the NFT' })
  sellerTeam: UserModel;

  @Field(() => UserModel, { description: 'User that bought the NFT' })
  buyer: UserModel;

  @Field(() => Float, { description: 'Amount the NFT was sold for' })
  amount: number;

  @Field(() => Date, { description: 'Timestamp of the transaction' })
  timestamp: Date;
}
