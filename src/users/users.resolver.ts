import 'reflect-metadata';
import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { UserModel } from '../Models/user';
import { UsersService } from './users.service';
import { UserCreateInput } from './dto/user-create-input.input';
import { LoginInput } from './dto/login-input.input';
import { LoggedUserOutput } from './dto/logged-user.output';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { Example } from './users.interceptor';
import { PaginationInput } from './dto/pagination.input';

@Resolver(UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserModel], { nullable: 'items' })
  async allUsers(
    @Args('pagination', { nullable: true, type: () => PaginationInput })
    pagination: PaginationInput | null,
  ) {
    return this.usersService.findAll(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(Example)
  @Query(() => UserModel, { nullable: true })
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => String, { nullable: true })
  async signUp(@Args('user') user: UserCreateInput) {
    return this.usersService.create(user);
  }

  @Mutation(() => LoggedUserOutput, { nullable: true })
  async signIn(@Args('user') loginUserInput: LoginInput) {
    return this.usersService.login(loginUserInput);
  }
}
