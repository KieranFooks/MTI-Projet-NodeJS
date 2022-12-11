import 'reflect-metadata';
import {
  ObjectType,
  Field,
  Int,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { TeamModel } from './team';
import { CollectionModel } from './collection';
import { UserRatingModel } from './userRating';
import { TransactionsModel } from './transactions';

@ObjectType('nft')
export class NFTModel {
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

  @Field(() => CollectionModel, { nullable: true })
  collection: CollectionModel | null;

  @Field(() => [UserRatingModel], { nullable: 'items' })
  userRating: UserRatingModel[];
}

@InputType('nftInput')
export class NFTInput {
  @Field()
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  price: number;
}

registerEnumType(Status, {
  name: 'Status',
});
