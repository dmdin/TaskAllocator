import type { RequestEvent } from '../$types';

async function sveltekitMiddleware(
  event: RequestEvent,
  ctx: Record<string, unknown>,
  next: CallableFunction
) {
  ctx.body = await event.request.json();
  Object.assign(ctx, event.locals);
  next();
}

export default () => sveltekitMiddleware;
