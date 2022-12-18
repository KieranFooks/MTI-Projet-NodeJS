import 'reflect-metadata';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { TeamModel } from './team';
import { TransactionsModel } from './transactions';
import { UserRatingModel } from './userRating';

@ObjectType('user', { description: 'A user of the platform' })
export class UserModel {
  @Field(() => Int, { description: 'Unique identifier for the user' })
  id: number;

  @Field(() => String, { description: 'Email of the user' })
  email: string;

  @Field(() => String, { description: 'Name of the user' })
  name: string;

  @Field(() => String, { description: 'Blockchain address of the user' })
  blockchainAddress: string;

  @Field(() => Role, { description: 'Role of the user' })
  role: Role;

  @Field(() => TeamModel, {
    nullable: true,
    description: 'Optional team of the user',
  })
  team?: TeamModel | null;

  @Field(() => [TransactionsModel], {
    nullable: 'items',
    description: 'Transactions where the user was the buyer',
  })
  buyTransactions: TransactionsModel[];

  @Field(() => [UserRatingModel], {
    nullable: 'items',
    description: 'Ratings of the user',
  })
  userRating: UserRatingModel[];
}

registerEnumType(Role, {
  name: 'Role',
});
