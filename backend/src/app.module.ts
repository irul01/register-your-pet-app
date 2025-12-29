import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [RegistrationModule],
  controllers: [FilesController],
})
export class AppModule {}
