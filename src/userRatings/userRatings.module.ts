import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserRatingsResolver } from './userRatings.resolver';
import { UserRatingsService } from './userRatings.service';

@Module({
  imports: [CommonModule],
  providers: [UserRatingsResolver, UserRatingsService],
  exports: [UserRatingsService],
})
export class UserRatingsModule {}
