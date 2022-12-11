import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Status } from '@prisma/client';
import 'reflect-metadata';
import { CollectionModel } from './collection';
import { TeamModel } from './team';
import { TransactionsModel } from './transactions';
import { UserRatingModel } from './userRating';

@ObjectType('nft')
export class NftModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  price: number;

  @Field(() => Status)
  status: Status;

  @Field(() => TeamModel)
  team: TeamModel;

  @Field(() => [TransactionsModel], { nullable: 'items' })
  transactions: TransactionsModel[];

  @Field(() => CollectionModel)
  collection: CollectionModel;

  @Field(() => [UserRatingModel], { nullable: 'items' })
  userRating: UserRatingModel[];
}

@InputType('nftInput')
export class NftInput {
  @Field()
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  price: number;

  @Field(() => Int)
  collectionId: number;
}

registerEnumType(Status, {
  name: 'Status',
});
