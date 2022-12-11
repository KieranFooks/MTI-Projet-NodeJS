import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';

@Module({
  imports: [CommonModule],
  providers: [CollectionsResolver, CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
