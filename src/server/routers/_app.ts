/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { messageRouter } from './message';
import { securityRouter } from './security';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  msg: messageRouter,

  security: securityRouter,
});

export type AppRouter = typeof appRouter;
