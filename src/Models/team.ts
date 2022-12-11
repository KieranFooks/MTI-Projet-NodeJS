import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { CollectionModel } from './collection';
import { NftModel } from './nft';
import { UserModel } from './user';

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
  createdCollection: CollectionModel[];

  @Field(() => [NftModel], { nullable: 'items' })
  ownedNft: NftModel[];
}
