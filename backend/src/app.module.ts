import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesController } from './files.controller';

@Module({
  imports: [
   MulterModule.register({
      storage: diskStorage({
        destination: '/app/uploads',  // 컨테이너 내부 경로 (Railway Volume 마운트)
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 예시
    }),
  ],
  controllers: [FilesController],
})
export class AppModule {}
