// backend/src/files.controller.ts (추가 라우트)
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';

@Controller('files')
export class FilesController {
  @Post('mem') // ← 테스트: POST /files/mem
  @UseInterceptors(FileInterceptor('file')) // 기본은 memoryStorage
  async uploadMem(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file');

    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = unique + (file.originalname ? extname(file.originalname) : '.bin');
    const dest = join('/app/uploads', filename);

    await writeFile(dest, file.buffer); // 디스크에 직접 씀

    console.log('[UPLOAD MEM OK]', { filename, size: file.size });
    return { path: `/uploads/${filename}` };
  }
}
