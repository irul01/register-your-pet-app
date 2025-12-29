import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GcsService {
  private readonly logger = new Logger(GcsService.name);
  private storage: Storage;
  private bucketName: string;

  constructor() {
    // Use GOOGLE_APPLICATION_CREDENTIALS or the service account provided in the environment
    this.storage = new Storage();
    this.bucketName = process.env.GCP_UPLOADS_BUCKET || '';
    if (!this.bucketName) {
      this.logger.warn('GCS uploads bucket not configured. Set GCP_UPLOADS_BUCKET env var.');
    }
  }

  async uploadBuffer(buffer: Buffer, destinationPath: string, contentType?: string) {
    if (!this.bucketName) {
      throw new Error('GCP_UPLOADS_BUCKET is not configured');
    }

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(destinationPath);

    await file.save(buffer, {
      resumable: false,
      contentType: contentType || 'application/octet-stream',
      public: true,
      metadata: { cacheControl: 'public, max-age=31536000' },
    });

    // Make public and return public URL
    try {
      await file.makePublic();
    } catch (e) {
      // ignore if already public or permission issue
      this.logger.debug('makePublic failed: ' + e.message);
    }

    return `https://storage.googleapis.com/${this.bucketName}/${encodeURIComponent(destinationPath)}`;
  }
}
