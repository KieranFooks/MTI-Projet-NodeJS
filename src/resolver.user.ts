import 'reflect-metadata';
import { Resolver, Query, Args, InputType, Field, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { UserModel } from './Models/user';
import { AppService } from './app.service';

@InputType()
class UserUniqueInput {
  @Field(() => Int, { nullable: true })
  id: number;
}

@Resolver(UserModel)
export class UserResolver {
  constructor(@Inject(AppService) private prismaService: AppService) {}

  @Query(() => [UserModel], { nullable: true })
  async allUsers() {
    return this.prismaService.user.findMany({
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
    return this.prismaService.user.findUnique({
      where: userUniqueInput,
      include: {
        buyTransactions: true,
        sellTransactions: true,
        team: true,
        userRating: true,
      },
    });
  }
}
