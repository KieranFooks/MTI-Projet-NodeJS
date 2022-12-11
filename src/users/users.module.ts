import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UsersResolver } from './users.resolve';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => CommonModule)],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
