import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    // If DATABASE_URL is not set, skip connecting to Prisma. This allows running
    // the app locally for upload tests without a database configured.
    if (!process.env.DATABASE_URL) {
      // eslint-disable-next-line no-console
      console.warn('DATABASE_URL not set; skipping Prisma connect (dev/test mode)');
      return;
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
