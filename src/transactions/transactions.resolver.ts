import { Inject, UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';
import { CurrentUser, JWTUser } from 'src/users/users.decorator';
import { TransactionsModel } from '../Models/transactions';
import { TransactionsService } from './transactions.service';

@Resolver(TransactionsModel)
export class TransactionsResolver {
  constructor(
    @Inject(TransactionsService)
    private transactionsService: TransactionsService,
  ) {}

  @Query(() => [TransactionsModel], { nullable: 'items' })
  lastSells(
    @Args('top', { type: () => Int })
    top: number,
  ) {
    return this.transactionsService.lastSells(top);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [TransactionsModel], { nullable: 'items' })
  myLastSells(@CurrentUser() user: JWTUser) {
    return this.transactionsService.myLastSells(user);
  }
}
