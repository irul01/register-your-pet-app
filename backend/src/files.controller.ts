// backend/src/files.controller.ts
import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded. Field name must be "file".');
    }
    // 업로드 시 파일 정보 로그 (Railway Logs에서 확인)
    // eslint-disable-next-line no-console
    console.log('[UPLOAD]', { filename: file.filename, size: file.size, mimetype: file.mimetype });

    return { path: `/uploads/${file.filename}` };
  }
}
