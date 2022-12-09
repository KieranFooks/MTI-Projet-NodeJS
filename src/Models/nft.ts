import 'reflect-metadata';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
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
  role: TeamModel;

  @Field(() => [TransactionsModel], { nullable: 'items' })
  transactions: TransactionsModel[];

  @Field(() => CollectionModel, { nullable: true })
  collection: CollectionModel | null;

  @Field(() => [UserRatingModel], { nullable: 'items' })
  userRating: UserRatingModel[];
}

registerEnumType(Status, {
  name: 'Status',
});
