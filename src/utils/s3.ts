import { S3 } from 'aws-sdk';

export const BucketName: string = process.env.BUCKET_NAME as string;

export const s3 = new S3({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
