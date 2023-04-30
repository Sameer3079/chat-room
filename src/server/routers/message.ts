import { publicProcedure, router } from '../trpc';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const defaultMessageSelect = Prisma.validator<Prisma.MessageSelect>()({
  id: true,
  content: true,
  imageUrl: true,
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
          [input.sortBy]: input.sortOrder,
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items: messages,
        nextCursor,
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        content: z.string().min(1).max(500),
        imageUrl: z.string().nullish(),
        type: z.enum(['text', 'text-with-image']),
      }),
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.create({
        data: input,
        select: defaultMessageSelect,
      });
      return message;
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const message = await prisma.message.delete({
      where: { id: input },
    });
    return message;
  }),
});
