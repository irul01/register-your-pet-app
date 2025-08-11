import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegistrationModule } from './registration/registration.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [RegistrationModule, UploadModule],
  providers: [PrismaService],
})
export class AppModule {}
