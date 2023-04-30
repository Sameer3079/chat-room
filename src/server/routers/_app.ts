/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { messageRouter } from './message';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  msg: messageRouter,

  // security: securityRouter,
});

export type AppRouter = typeof appRouter;
