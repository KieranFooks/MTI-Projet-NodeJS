import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import 'reflect-metadata';
import { CollectionModel } from './collection';
import { NftModel } from './nft';
import { UserModel } from './user';

@ObjectType('team', {
  description: 'A team with members, that owns NFTs and can create collections',
})
export class TeamModel {
  @Field(() => Int, { description: 'Unique identifier for the team' })
  id: number;

  @Field(() => String, { description: 'Name of the team' })
  name: string;

  @Field(() => Float, { description: 'Current balance of the team' })
  balance: number;

  @Field(() => [UserModel], { description: 'Members of the team' })
  users: UserModel[];

  @Field(() => [CollectionModel], {
    nullable: 'items',
    description: 'Collections created by the team',
  })
  createdCollection: CollectionModel[];

  @Field(() => [NftModel], {
    nullable: 'items',
    description: 'NFTs owned by the team',
  })
  ownedNft: NftModel[];
}
