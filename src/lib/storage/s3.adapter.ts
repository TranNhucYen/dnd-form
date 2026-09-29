import 'server-only';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { IStorageService, S3StorageConfig, UploadFileInput, UploadResult } from './storage.types';
import { buildStorageKey, buildFileUrl } from './storage.keys';

export class S3StorageAdapter implements IStorageService {
  private readonly client: S3Client;

  constructor(private readonly config: S3StorageConfig) {
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  async upload(input: UploadFileInput): Promise<UploadResult> {
    const key = buildStorageKey(input.extension);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: input.file,
        ContentType: input.mimeType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return {
      key,
      url: this.getUrl(key),
      mimeType: input.mimeType,
      fileSize: input.file.byteLength,
    };
  }

  getUrl(key: string): string {
    return buildFileUrl(this.config.publicUrl, key);
  }
}
