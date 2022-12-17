import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { CollectionModel } from 'src/Models/collection';
import { TeamModel } from 'src/Models/team';
import { TransactionsModel } from 'src/Models/transactions';
import { UserRatingModel } from 'src/Models/userRating';

@ObjectType()
export class MostRatedNftOutput {
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

  @Field(() => Float)
  averageRate: number;
}
