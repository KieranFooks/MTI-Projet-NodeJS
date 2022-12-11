import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { NFTsResolver } from './nfts.resolver';
import { NFTsService } from './nfts.service';

@Module({
  imports: [CommonModule],
  providers: [NFTsResolver, NFTsService],
  exports: [NFTsService],
})
export class NFTsModule {}
