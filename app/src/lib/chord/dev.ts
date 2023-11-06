import 'reflect-metadata';

import type {
  ComposerConfig,
  ComposerModels,
  MethodDescription,
  Target,
  Schema,
  MethodMetadata,
  Call
} from './types';

import axios from 'axios';
import c from 'chalk';

// TODO think to make constructor instead
export class Composer {
  config?: ComposerConfig;
  models: ComposerModels;
  middlewares: CallableFunction[];

  constructor(models: ComposerModels, config?: ComposerConfig) {
    this.config = config;
    // List is unwrapped client and Records<string, Target> are wrapped
    this.models = models;
    this.middlewares = [];
  }

  static methods = new Map<string, MethodDescription>();

  static methodKey(target: Target, key: string) {
    return `${target.constructor.name}/${key}`;
  }

  static add({ key, descriptor, metadata, target }: MethodDescription) {
    key = Composer.methodKey(target, key);
    Composer.methods.set(key, { key, descriptor, metadata, target });
  }

  static findRequest(event: unknown) {
    // console.log(event)

    if (event?.body && event.method) {
      return event;
    }

    const fields = Object.getOwnPropertyNames(event);
    if (fields.includes('request')) return (event as { request: Request })['request'];
  }

  use(middleware: CallableFunction) {
    this.middlewares.push(middleware);
  }

  getSchema(route?: string): Schema {
    route = route || (this.config?.route as string);
    if (!route) {
      throw new EvalError('No route provided during Composer initialization or Schema generation');
    }
    const methods: Record<string, MethodMetadata> = {};
    const modelsSet: Set<string> = new Set();
    for (const [key, info] of Composer.methods.entries()) {
      modelsSet.add(info.target.constructor.name);
      const { argsType, returnType } = info.metadata;
      methods[key] = { argsType, returnType } as MethodMetadata;
    }
    const models = Array.from(modelsSet);
    return { methods, route, models };
  }

  async exec(event: unknown) {
    const ctx = {};

    let lastMiddlewareResult;
    let middlewareIndex = -1;
    const middlewares = this.middlewares;

    function next() {
      middlewareIndex++;
      if (middlewareIndex >= middlewares.length) return;

      const middleware = middlewares[middlewareIndex];
      lastMiddlewareResult = middleware(event, ctx, next);
    }
    next();

    if (middlewareIndex <= middlewares.length - 1) {
      console.warn(c.yellow(`"${middlewares[middlewareIndex].name}" stopped execution`));
      return lastMiddlewareResult;
    }

    let request = ctx?.request;

    if (!request) {
      console.warn(
        c.yellow('No middleware specified "request" field in context. Trying to find it')
      );
      request = Composer.findRequest(event);
    }
    if (!request) {
      throw ReferenceError('Request object was not found in provided event');
    }

    const body = await request.json();
    if (!body?.method || !body?.args)
      throw TypeError('Wrong invocation. Method and Args must be defined');

    const { method, args } = body;
    const methodDesc = Composer.methods.get(method);
    if (!method) throw new EvalError(`Cannot find method: ${method}`);

    const { target, descriptor } = methodDesc as MethodDescription;
    // console.log(method, args)
    return await descriptor.value.apply(target, args.concat(ctx));
  }
}

export function rpc() {
  return function (target: Target, key: string, descriptor: PropertyDescriptor) {
    // console.log(key, key, descriptor)
    // console.log('Metadata', Reflect.getMetadataKeys(target))
    // console.log("design:paramtypes", Reflect.getMetadata("design:paramtypes", target, key).map(v => v.name));
    // console.log("design:type", Reflect.getMetadata("design:type", target, key));
    // console.log('add', )
    // TODO return type doesn`t work
    // console.log(target.constructor.name)
    // console.log("design:returntype", Reflect.getMetadata('design:returntype', target, key)?.name);
    const metadata = {
      key,
      argsType: Reflect.getMetadata('design:paramtypes', target, key)?.map((a) => a?.name),
      returnType: Reflect.getMetadata('design:returntype', target, key)
    };
    Composer.add({ key, descriptor, metadata, target });
  };
}

export function initClient<T>(schema: Schema): T {
  function call(method: string) {
    async function intercept(...args: unknown[]) {
      return (await axios.post(schema.route, { args, method } as Call)).data;
    }
    return intercept;
  }

  const handler: Record<string, string | ((args: unknown) => Promise<any>)> = {};

  for (const model of schema.models) {
    const modelMethods = Object.entries(schema.methods).filter(([k, v]) => k.startsWith(model));

    const renamed = Object.fromEntries(
      // Remove Model name from key and place callable
      modelMethods.map(([k, v]) => {
        const methodName = k.split('/')[1];
        const callable = call(k);
        // Allow unwrapped calls
        handler[methodName] = callable;
        return [methodName, callable];
      })
    );
    handler[model] = renamed;
  }
  return handler;
}

// const example = Injector.resolve();
// export function loggedMethod(target: any, memberName: string, propertyDescriptor: PropertyDescriptor) {
//   function replacementMethod(this: any, ...args: any[]) {
//     console.log(`LOG: Entering method '${memberName}'.`)
//     const result = propertyDescriptor.value.call(this, ...args);
//     console.log(`LOG: Exiting method '${memberName}'.`)
//     return result;
//   }
//   return {
//     get() {
//       Object.defineProperty(this, memberName, {
//         value: replacementMethod,
//         configurable: true,
//         writable: true
//       });
//       return replacementMethod;

//     }
//   }
// }
