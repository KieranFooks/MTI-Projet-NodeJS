import { Module } from '@nestjs/common';
import { CollectionsModule } from '../collections/collections.module';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { NftsResolver } from './nfts.resolver';
import { NftsService } from './nfts.service';

@Module({
  imports: [CommonModule, TeamsModule, CollectionsModule, UsersModule],
  providers: [NftsResolver, NftsService],
  exports: [NftsService],
})
export class NftsModule {}
