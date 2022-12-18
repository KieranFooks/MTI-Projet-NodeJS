import 'reflect-metadata';
import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { UserModel } from '../Models/user';
import { UsersService } from './users.service';
import { UserCreateInput } from './dto/user-create-input.input';
import { LoginInput } from './dto/login-input.input';
import { LoggedUserOutput } from './dto/logged-user.output';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Example } from './users.interceptor';
import { PaginationInput } from './dto/pagination.input';

@Resolver(UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserModel], {
    nullable: 'items',
    name: 'users',
    description: 'Get all users. You need to be logged in to use this query.',
  })
  async allUsers(
    @Args('pagination', {
      nullable: true,
      type: () => PaginationInput,
      description: 'Optional argument used to paginate the query.',
    })
    pagination: PaginationInput | null,
  ) {
    return this.usersService.findAll(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(Example)
  @Query(() => UserModel, {
    nullable: true,
    description: 'Get user by id. You need to be logged in to use this query.',
  })
  async user(
    @Args('id', {
      type: () => Int,
      description: 'The id of the user.',
    })
    id: number,
  ) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => String, {
    nullable: true,
    name: 'signUp',
    description: 'Sign up. It will return your password.',
  })
  async signUp(
    @Args('user', {
      description:
        'The new user informations with email, name and blockchain address.',
    })
    user: UserCreateInput,
  ) {
    return this.usersService.create(user);
  }

  @Mutation(() => LoggedUserOutput, {
    nullable: true,
    name: 'signIn',
    description: 'Sign in. It will return a JWT token.',
  })
  async signIn(
    @Args('user', { description: 'The user email and password' })
    loginUserInput: LoginInput,
  ) {
    return this.usersService.login(loginUserInput);
  }
}
