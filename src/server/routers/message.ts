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
  list: publicProcedure.query(async () => {
    const messages = await prisma.message.findMany({});
    return messages;
  }),
  add: publicProcedure
    .input(
      z.object({
        content: z.string().min(1).max(500),
        imageUrl: z.optional(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const message = await prisma.message.create({
        data: input as any,
        select: defaultMessageSelect,
      });
      return message;
    }),
  delete: publicProcedure.mutation(() => ''),
});
