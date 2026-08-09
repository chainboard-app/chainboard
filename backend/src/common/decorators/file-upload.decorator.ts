import { SetMetadata } from '@nestjs/common';

export const FILE_UPLOAD_KEY = 'file_upload';

export interface FileUploadOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
  fieldName?: string;
}

export const FileUpload = (options: FileUploadOptions = {}) =>
  SetMetadata(FILE_UPLOAD_KEY, options);
