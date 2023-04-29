import { z } from 'zod';

export const Message = z.object({
  id: z.string(),
  content: z.string(),
  imageUrl: z.optional(z.string()),
  attachment: z.string(),
});
export type Message = z.infer<typeof Message>;
