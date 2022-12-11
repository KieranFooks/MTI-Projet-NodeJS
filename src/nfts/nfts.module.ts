import { Module } from '@nestjs/common';
import { CollectionsModule } from 'src/collections/collections.module';
import { TeamsModule } from 'src/teams/teams.module';
import { CommonModule } from '../common/common.module';
import { NftsResolver } from './nfts.resolver';
import { NftsService } from './nfts.service';

@Module({
  imports: [CommonModule, TeamsModule, CollectionsModule],
  providers: [NftsResolver, NftsService],
  exports: [NftsService],
})
export class NftsModule {}
