import { publicProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { BucketName, s3 } from '~/utils/s3';

const defaultMessageSelect = Prisma.validator<Prisma.MessageSelect>()({
  id: true,
  hasImage: true,
  content: true,
  imageFileName: true,
  imageUrl: true,
  createdAt: true,
});

export const messageRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.string().nullish(),
        sortBy: z.enum(['createdAt']),
        sortOrder: z.enum(['asc', 'desc']),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const messages = await prisma.message.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          // [input.sortBy]: input.sortOrder,
          createdAt: 'desc',
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items: messages.reverse(),
        nextCursor,
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        content: z.string().min(1).max(500),
        hasImage: z.boolean().optional(),
        imageFileName: z.string().optional(),
        imageFileContentType: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      let presignedUrl: string | undefined;
      let data;
      const messageWithImageSchema = z.object({
        hasImage: z.literal(true),
        imageFileName: z.string(),
        imageFileContentType: z.string(),
      });
      const result = messageWithImageSchema.safeParse(input);
      if (result.success) {
        // Generate presigned URL
        const params = {
          Bucket: BucketName,
          Expires: 300,
        };

        // Create new unique file name to prevent overwriting existing files
        const newFileName = `${Date.now()}_${result.data.imageFileName}`;

        console.log('New File Name:', newFileName);
        const newParams = {
          ...params,
          Key: newFileName,
          ContentType: result.data.imageFileContentType,
        };
        console.log('newParams:', newParams);
        presignedUrl = await s3.getSignedUrlPromise('putObject', newParams);
        console.log('Signed URL', presignedUrl);

        data = {
          content: input.content,
          hasImage: true,
          imageFileName: newFileName,
          imageUrl: `https://${BucketName}.s3.amazonaws.com/${newFileName}`,
        };
      } else {
        data = {
          content: input.content,
          hasImage: false,
          imageFileName: undefined,
          imageUrl: undefined,
        };
      }

      await prisma.message.create({
        data: data,
        select: defaultMessageSelect,
      });
      return presignedUrl;
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const message = await prisma.message.findFirst({
      where: {
        id: input,
      },
    });
    if (!message) return null;
    console.log(message);
    if (message.hasImage && message.imageFileName) {
      await s3
        .deleteObject({
          Bucket: BucketName,
          Key: message.imageFileName,
        })
        .promise();
    }
    await prisma.message.delete({
      where: { id: input },
    });
    return message;
  }),
});
