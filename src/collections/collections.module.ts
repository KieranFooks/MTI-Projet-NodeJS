import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';

@Module({
  imports: [CommonModule, UsersModule],
  providers: [CollectionsResolver, CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
