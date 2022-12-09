import 'reflect-metadata';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { UserModel } from './user';
import { CollectionModel } from './collection';
import { NFTModel } from './nft';

@ObjectType('team')
export class TeamModel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  balance: number;

  @Field(() => [UserModel])
  users: UserModel[];

  @Field(() => [CollectionModel], { nullable: 'items' })
  createdCollections: CollectionModel[];

  @Field(() => [NFTModel], { nullable: 'items' })
  ownedNFTs: NFTModel[];
}
