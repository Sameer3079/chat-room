import { Message } from '~/models/message';
import { publicProcedure, router } from '../trpc';

export const messageRouter = router({
  list: publicProcedure.query(() => {
    const messageList: Array<Message> = [
      { attachment: '', content: 'Hey Sameer', id: '1', createdAt: new Date() },
      { attachment: '', content: 'Hey Bob', id: '2', createdAt: new Date() },
      { attachment: '', content: 'Message 1', id: '3', createdAt: new Date() },
      { attachment: '', content: 'Message 1', id: '4', createdAt: new Date() },
    ];
    return messageList;
  }),
  add: publicProcedure.mutation(() => ''),
  delete: publicProcedure.mutation(() => ''),
});
