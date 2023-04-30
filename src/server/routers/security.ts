import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { S3 } from 'aws-sdk';

const s3 = new S3({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const params = {
  Bucket: 'chat-room-sameer-basil',
  Expires: 300,
};

export const securityRouter = router({
  presignedUrl: publicProcedure
    .input(z.object({ filename: z.string(), contentType: z.string() }))
    .mutation(async ({ input }) => {
      const signedUrl = await s3.getSignedUrlPromise('putObject', {
        ...params,
        Key: input.filename,
        ContentType: input.contentType,
      });
      return signedUrl;
    }),
});
