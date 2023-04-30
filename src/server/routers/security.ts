import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { BucketName, s3 } from '~/utils/s3';

const params = {
  Bucket: BucketName,
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
