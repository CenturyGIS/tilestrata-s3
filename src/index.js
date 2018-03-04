import S3Cache from './s3-cache';

export function TilestrataS3 (options) {
  return new S3Cache(options);
}
