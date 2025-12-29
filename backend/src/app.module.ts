import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { RegistrationModule } from './registration/registration.module';
import { GcsService } from './gcs.service';

@Module({
  imports: [RegistrationModule],
  controllers: [FilesController],
  providers: [GcsService],
})
export class AppModule {}
