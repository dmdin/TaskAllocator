import type { RequestEvent } from '../$types';

async function sveltekitMiddleware(
  event: RequestEvent,
  ctx: Record<string, unknown>,
  next: CallableFunction
) {
  ctx.request = event?.request;
  Object.assign(ctx, event.locals);
  next();
}

export default () => sveltekitMiddleware;
