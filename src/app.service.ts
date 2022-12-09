import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { PrismaClient, Role, Status } from '@prisma/client';

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    registerEnumType(Role, {
      name: 'Role',
    });

    registerEnumType(Status, {
      name: 'Status',
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
