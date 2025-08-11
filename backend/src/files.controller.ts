// backend/src/files.controller.ts
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';

@Controller('files')
export class FilesController {
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
    const dest = join('/app/uploads', filename);

    await writeFile(dest, file.buffer); // 메모리 → 디스크 저장

    // eslint-disable-next-line no-console
    console.log('[UPLOAD OK]', { filename, size: file.size, mimetype: file.mimetype });
    return { path: `/uploads/${filename}` };
  }
}
