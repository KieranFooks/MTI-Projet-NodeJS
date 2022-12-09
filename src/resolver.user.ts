import 'reflect-metadata';
import {
  Resolver,
  Query,
  Args,
  InputType,
  Field,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { UserModel } from './Models/user';
import { AppService } from './app.service';
import { User } from '@prisma/client';

@InputType()
class UserUniqueInput {
  @Field(() => Int, { nullable: true })
  id: number;
}

@InputType()
class UserCreateInput {
  @Field()
  email: string;
  @Field()
  name: string;
  @Field()
  password: string;
  @Field()
  blockchainAddress: string;
}

@Resolver(UserModel)
export class UserResolver {
  constructor(@Inject(AppService) private appService: AppService) {}

  @Query(() => [UserModel], { nullable: 'items' })
  async allUsers() {
    return this.appService.user.findMany({
      include: {
        buyTransactions: true,
        sellTransactions: true,
        team: true,
        userRating: true,
      },
    });
  }

  @Query(() => UserModel, { nullable: true })
  async user(@Args('userUniqueInput') userUniqueInput: UserUniqueInput) {
    return this.appService.user.findUnique({
      where: userUniqueInput,
      include: {
        buyTransactions: true,
        sellTransactions: true,
        team: true,
        userRating: true,
      },
    });
  }

  @Mutation(() => UserModel)
  async signupUser(@Args('user') user: UserCreateInput): Promise<User> {
    return this.appService.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        blockchainAddress: user.blockchainAddress,
      },
    });
  }
}
