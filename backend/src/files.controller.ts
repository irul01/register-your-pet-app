// backend/src/files.controller.ts
import { BadRequestException, Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdir, writeFile } from 'fs/promises';
import { memoryStorage } from 'multer';
import { join, extname } from 'path';
import { GcsService } from './gcs.service';

@Controller('files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

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
    const useGcs = process.env.USE_GCS_UPLOADS === 'true';

    if (useGcs && this.gcs.isConfigured()) {
      try {
        const publicUrl = await this.gcs.uploadBuffer(file.buffer, dest, file.mimetype);
        this.logger.log(`[UPLOAD OK][GCS] ${filename} ${file.mimetype} ${file.size} bytes`);
        return { path: publicUrl };
      } catch (err) {
        this.logger.warn(`[UPLOAD FALLBACK] GCS failed: ${(err as Error).message}`);
      }
    }

    const uploadsDir = join(__dirname, '..', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), file.buffer);
    const localPath = `/uploads/${filename}`;
    this.logger.log(`[UPLOAD OK][LOCAL] ${filename} ${file.mimetype} ${file.size} bytes -> ${localPath}`);
    return { path: localPath };
  }
}
