import { Module } from '@nestjs/common';
import { CollectionsModule } from './collections/collections.module';
import { CommonModule } from './common/common.module';
import { NFTsModule } from './nfts/nfts.module';
import { TeamsModule } from './teams/teams.module';
import { UserRatingsModule } from './userRatings/userRatings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    TeamsModule,
    CollectionsModule,
    NFTsModule,
    UserRatingsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
