import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { S3 } from 'aws-sdk';

const s3 = new S3({ region: 'us-east-1' });

// const params = {
//   Bucket: 'chat-room-sameer-basil',
//   Key: ''
// };

// s3.getSignedUrlPromise('putObject', params);

export const securityRouter = router({
  presignedUrl: publicProcedure.input(z.string()).query(async ({ input }) => {
    return 'us-east-1';
  }),
});
