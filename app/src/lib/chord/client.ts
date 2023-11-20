import type {
  Schema,
  ClientConfig,
  Transport,
  ErrorCallback,
  Client,
} from './types';

import type { FailedResponse, Response, Request } from './specs';
import { buildRequest } from './specs';


const defaultTransport: Transport = async ({ route, body }) => {
  // TODO Catch if request failed
  return await fetch(route, { method: 'POST', body: JSON.stringify(body) }).then(r => r.json()).catch(e => {
    return { error: { message: 'Failed durning fetch request' } } as FailedResponse
  })
}

const defaultErrorCallback: ErrorCallback = async (e, { method, params }) => {
  console.error(`Error occurred during RPC Call: ${method}(${params})`)
  throw new EvalError(e.message)
}

export function initClient<T>(
  schema: Schema,
  config?: ClientConfig
): Client<T> {
  function call(method: string) {
    return async (...params: unknown[]) => {
      const transport = config?.transport ?? defaultTransport
      const errorCallback = config?.onError ?? defaultErrorCallback
      const body = buildRequest({ method, params })
      const res = await transport({ route: schema.route, body })
      if ((res as FailedResponse).error) {
        return await errorCallback((res as FailedResponse).error, body)
      }
      return (res as Response).result;
    };
  }

  function batchedCall(method: string) {
    return (...params: unknown[]): Request => {
      return buildRequest({ method, params })
    }
  }

  async function batch(...calls: Request[]) {
    console.log('batch', calls)
  }

  const handler = {
    batch,
    b: {}
  };

  for (const model of schema.models) {
    const modelMethods = Object.entries(schema.methods).filter(
      ([k, v]) => k.split('.')[0] === model
    );
    const callable = Object.fromEntries(
      // Remove Model name from key and place callable
      modelMethods.map(([k, v]) => {
        const methodName = k.split('.')[1];
        const callable = call(k);
        // Allow unwrapped calls
        handler[methodName] = callable;
        return [methodName, callable];
      })
    );

    const batched = Object.fromEntries(
      modelMethods.map(
        ([k, v]) => [k.split('.')[1], batchedCall(k)]
      )
    )
    handler[model] = callable;
    handler.b[model] = batched
  }
  // console.log(handler)
  return handler as Client<T>;
}
