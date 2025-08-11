// backend/src/files.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class FilesController {
  // 프론트에서 POST /files 로 전송 (field 이름: "file")
  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    // 정적 서빙 prefix가 '/uploads' 라는 가정 (main.ts에서 설정)
    return { path: `/uploads/${file.filename}` };
  }
}
