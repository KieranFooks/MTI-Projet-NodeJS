import { Inject, UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CurrentUser, JWTUser } from '../users/users.decorator';
import { TransactionsModel } from '../Models/transactions';
import { TransactionsService } from './transactions.service';

@Resolver(TransactionsModel)
export class TransactionsResolver {
  constructor(
    @Inject(TransactionsService)
    private transactionsService: TransactionsService,
  ) {}

  @Query(() => [TransactionsModel], {
    nullable: 'items',
    name: 'lastSells',
    description: 'Get the last X sells.',
  })
  lastSells(
    @Args('top', {
      type: () => Int,
      description: 'The number of sells to return.',
    })
    top: number,
  ) {
    return this.transactionsService.lastSells(top);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [TransactionsModel], {
    nullable: 'items',
    name: 'myLastSells',
    description: 'Get the last sells of the logged user.',
  })
  myLastSells(@CurrentUser() user: JWTUser) {
    return this.transactionsService.myLastSells(user);
  }
}
