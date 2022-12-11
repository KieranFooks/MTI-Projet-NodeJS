import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CommonModule, UsersModule, TeamsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
