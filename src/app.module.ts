import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CollectionsModule } from './collections/collections.module';
import { CommonModule } from './common/common.module';
import { NftsModule } from './nfts/nfts.module';
import { TeamsModule } from './teams/teams.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserRatingsModule } from './userRatings/userRatings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    TeamsModule,
    CollectionsModule,
    NftsModule,
    UserRatingsModule,
    TransactionsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
