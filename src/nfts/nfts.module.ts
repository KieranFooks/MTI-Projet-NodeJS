import { Module } from '@nestjs/common';
import { TeamsModule } from 'src/teams/teams.module';
import { CommonModule } from '../common/common.module';
import { NFTsResolver } from './nfts.resolver';
import { NFTsService } from './nfts.service';

@Module({
  imports: [CommonModule, TeamsModule],
  providers: [NFTsResolver, NFTsService],
  exports: [NFTsService],
})
export class NFTsModule {}
