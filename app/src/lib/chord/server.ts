import 'reflect-metadata';

import type {
  ComposerConfig,
  ComposerModels,
  MethodDescription,
  PropertyDescription,
  Target,
  Schema,
  MethodMetadata,
  PropKey,
} from './types';

import {
  ErrorCode,
  buildResponse,
  buildError,
  type Response,
  type Request,
  type FailedResponse,
  type Some,
} from './specs';

import c from 'chalk';

// TODO think to make constructor instead
export class Composer<T>{
  config?: ComposerConfig;
  models: ComposerModels;
  middlewares: CallableFunction[];

  constructor(models: T[], config?: ComposerConfig) {
    this.config = config;
    // List is unwrapped client and Records<string, Target> are wrapped
    this.models = models;
    for (const model of models) {
      this[model.name] = new model()
      // Reflect.defineProperty(this, model.name, {
      //   configurable: false,
      //   enumerable: false,
      //   get() {
      //     console.log('init model', new model())
      //     new model()
      //   }
      // });
    }
    this.middlewares = [];
  }

  // We need mapping <ClassName>/<MethodName> to avoid overlapping of methods with the same name
  static methods = new Map<string, MethodDescription>();

  // We need to use name of class as key to optimize dependency search in case of large amount of DI
  static props = new Map<string, PropertyDescription[]>();

  static addMethod({ key, descriptor, metadata, target }: MethodDescription) {
    key = `${target.constructor.name}.${key}`;
    Composer.methods.set(key, { key, descriptor, metadata, target });
  }

  static addProp({ key, target }) {
    const targetName = `${target.constructor.name}`;
    const oldProps = Composer.props.get(targetName) ?? [];
    Composer.props.set(targetName, oldProps.concat({ key, target }));
  }

  static findRequestField(event: unknown) {
    if (event?.body && event.method) {
      return event;
    }

    const fields = Object.getOwnPropertyNames(event);
    if (fields.includes('request')) return (event as { request: Request })['request'];
  }

  // static resolve(injectable: object, key: PropKey) {
  //
  // }

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

  async exec(event: unknown): Promise<Some<FailedResponse, Response>> {
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

    // @ts-ignore
    let request = ctx?.request;

    if (!request) {
      console.warn(
        c.yellow('No middleware specified "request" field in context. Trying to find it')
      );
      request = Composer.findRequestField(event);
    }
    if (!request) {
      return buildError({
        code: ErrorCode.ParseError,
        message: 'Request object was not found in provided event',
        data: []
      })
    }

    const body: Request = await request.json();
    if (!body?.method || !body?.params) {
      return buildError({
        code: ErrorCode.InvalidRequest,
        message: 'Wrong invocation. Method and Args must be defined',
        data: []
      })
    }

    const { method, params } = body;
    const methodDesc = Composer.methods.get(method);
    if (!method) {
      return buildError({
        code: ErrorCode.MethodNotFound,
        message: `Cannot find method: ${method}`,
        data: [],
      })
    }
    // TODO handle Invalid Params error

    const { target, descriptor } = methodDesc as MethodDescription;

    // Inject ctx dependency
    const ctxProp = Composer.props.get(target.constructor.name)?.find((d) => d.key === 'ctx');
    if (ctxProp) {
      Reflect.defineProperty(target, ctxProp.key, {
        configurable: false,
        enumerable: false,
        get() {
          return ctx;
        }
      });
    }

    try {
      const result = await descriptor.value.apply(target, params.concat(ctx));
      return buildResponse({
        request: body,
        result
      })
    } catch (e) {
      await (this.config?.onError ?? console.error)(e, body)
      return buildError({
        code: ErrorCode.InternalError,
        message: e?.message as string,
        data: [e]
      })
    }
  }
}

export function rpc() {
  return function (target: Target, key: PropKey, descriptor: PropertyDescriptor) {
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
    Composer.addMethod({ key, descriptor, metadata, target });
  };
}

export function depends() {
  return function (target: object, key: PropKey) {
    // const injectable = Reflect.getMetadata("design:type", target, key) as ClassConstructor<object>;
    Composer.addProp({
      key,
      target
    });

    // If dependency is context, inject it during exec call
    if (key === 'ctx') return;

    Reflect.defineProperty(target, key, {
      configurable: false,
      enumerable: false,
      get() {
        return 'hello world';
      }
    });
  };
}
