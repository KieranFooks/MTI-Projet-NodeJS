import 'reflect-metadata';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { TeamModel } from './team';
import { TransactionsModel } from './transactions';
import { UserRatingModel } from './userRating';

@ObjectType('user')
export class UserModel {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  blockchainAddress: string;

  @Field(() => Role)
  role: Role;

  @Field(() => TeamModel, { nullable: true })
  team?: TeamModel | null;

  @Field(() => [TransactionsModel], { nullable: 'items' })
  buyTransactions: TransactionsModel[];

  @Field(() => [TransactionsModel], { nullable: 'items' })
  sellTransactions: TransactionsModel[];

  @Field(() => [UserRatingModel], { nullable: 'items' })
  userRating: UserRatingModel[];
}

registerEnumType(Role, {
  name: 'Role',
});
