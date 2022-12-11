import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth.module';
import { GraphqlModule } from './graphql.module';

@Module({
  imports: [ConfigModule, GraphqlModule, AuthModule],
  exports: [ConfigModule, GraphqlModule, AuthModule],
})
export class CommonModule {}
