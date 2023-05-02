import { z } from 'zod';

export const Message = z.discriminatedUnion('hasImage', [
  z.object({
    id: z.string(),
    hasImage: z.literal(false),
    content: z.string(),
    createdAt: z.date(),
  }),
  z.object({
    id: z.string(),
    hasImage: z.literal(true),
    content: z.string(),
    imageFileName: z.string(),
    imageUrl: z.string().url(),
    createdAt: z.date(),
  }),
]);
export type Message = z.infer<typeof Message>;
