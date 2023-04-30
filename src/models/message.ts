import { z } from 'zod';

export const TextOnlyMessage = z.object({
  id: z.string(),
  hasImage: z.literal(false),
  content: z.string(),
  createdAt: z.date(),
});
export type TextOnlyMessage = z.infer<typeof TextOnlyMessage>;

export const TextWithImageMessage = z.object({
  id: z.string(),
  hasImage: z.literal(true),
  content: z.string(),
  imageFileName: z.string(),
  imageUrl: z.string().url(),
  createdAt: z.date(),
});
export type TextWithImageMessage = z.infer<typeof TextWithImageMessage>;

export type Message = TextOnlyMessage | TextWithImageMessage;
