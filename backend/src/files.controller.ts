// backend/src/files.controller.ts
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join, extname } from 'path';
import { GcsService } from './gcs.service';

@Controller('files')
export class FilesController {
  constructor(private readonly gcs: GcsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded. Field name must be "file".');
    }
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = unique + (file.originalname ? extname(file.originalname) : '.bin');
    const dest = `uploads/${filename}`;

    // Upload to GCS
    const publicUrl = await this.gcs.uploadBuffer(file.buffer, dest, file.mimetype);

    // eslint-disable-next-line no-console
    console.log('[UPLOAD OK]', { filename, size: file.size, mimetype: file.mimetype, url: publicUrl });
    return { path: publicUrl };
  }
}
