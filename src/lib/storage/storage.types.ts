export interface UploadFileInput {
  file: Buffer;
  mimeType: string;
  extension: string;
}

export interface UploadResult {
  key: string;
  url: string;
  mimeType: string;
  fileSize: number;
}

export interface IStorageService {
  upload(input: UploadFileInput): Promise<UploadResult>;
  getUrl(key: string): string;
}

export interface LocalStorageConfig {
  driver: 'local';
  localDir: string;
  localPublicUrl: string;
}

export interface S3StorageConfig {
  driver: 's3';
  bucket: string;
  region: string;
  endpoint?: string;
  forcePathStyle: boolean;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl: string;
}

export type StorageConfig = LocalStorageConfig | S3StorageConfig;
