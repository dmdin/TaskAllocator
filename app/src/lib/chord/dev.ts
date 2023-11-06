import 'reflect-metadata';
import axios from 'axios';

interface MethodDescription {
  key: string;
  descriptor: PropertyDescriptor;
  target: Target;
  metadata: MethodMetadata;
}

export interface MethodMetadata {
  returnType: unknown;
  argsType: unknown[];
}

export interface Schema {
  route: string
  methods: Record<string, MethodMetadata>
  models: string[]
}

export interface Call {
  method: string;
  args: unknown[]
}

export interface ComposerConfig {
  route?: string,
}

export interface Target {
  constructor: { name: string }
}

// export type UnwrappedRPC<> = T extends K

export type ComposerModels = unknown[] | Record<string, unknown>
// TODO think to make constructor instead
export class Composer {
  config?: ComposerConfig
  models: ComposerModels
  middlewares: [];

  constructor(models: ComposerModels, config?: ComposerConfig) {
    this.config = config;
    // List is unwrapped client and Records<string, Target> are wrapped
    this.models = models;
    this.middlewares = []

  }

  static methods = new Map<string, MethodDescription>();

  static methodKey(target: Target, key: string) {
    return `${target.constructor.name}/${key}`
  }

  static add({ key, descriptor, metadata, target }: MethodDescription) {
    key = Composer.methodKey(target, key)
    Composer.methods.set(key, { key, descriptor, metadata, target });
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  getSchema(route?: string): Schema {
    route = route || this.config?.route as string;
    if (!route) {
      throw new EvalError("No route provided during Composer initialization or Schema generation")
    }
    const methods: Record<string, MethodMetadata> = {}
    const modelsSet: Set<string> = new Set()
    for (const [key, info] of Composer.methods.entries()) {
      modelsSet.add(info.target.constructor.name)
      const { argsType, returnType } = info.metadata
      methods[key] = { argsType, returnType } as MethodMetadata
    }

    const models = Array.from(modelsSet)
    return { methods, route, models }
  }

  async exec({ method, args }: Call) {
    console.log('method', method)
    const methodDesc = Composer.methods.get(method)
    if (!method) throw new EvalError(`Cannot find method: ${method}`)

    const { target, descriptor } = methodDesc as MethodDescription
    return await descriptor.value.apply(target, [args])
  }
}



export function rpc() {
  return function (target: Target, key: string, descriptor: PropertyDescriptor) {
    // console.log(key, key, descriptor)
    // console.log('Metadata', Reflect.getMetadataKeys(target))
    // console.log("design:paramtypes", Reflect.getMetadata("design:paramtypes", target, key));
    // console.log("design:type", Reflect.getMetadata("design:type", target, key));
    // console.log('add', )
    // TODO return type doesn`t work
    // console.log(target.constructor.name)
    // console.log("design:returntype", Reflect.getMetadata("design:returntype", target, key));
    const metadata = {
      key,
      argsType: Reflect.getMetadata("design:paramtypes", target, key),
      returnType: Reflect.getMetadata("design:returntype", target, key),
    }
    Composer.add({ key, descriptor, metadata, target })
  }
}

export function initClient<T>(schema: Schema): T {
  function call(method: string) {
    async function intercept(args: unknown) {
      return (await axios.post(schema.route, { args, method } as Call)).data
    }
    return intercept
  }

  const handler: Record<string, string | ((args: unknown) => Promise<any>)> = {}

  for (const model of schema.models) {
    const modelMethods = Object.entries(schema.methods).filter(([k, v]) => k.startsWith(model))

    const renamed = Object.fromEntries(
      // Remove Model name from key and place callable
      modelMethods.map(([k, v]) => {
        const methodName = k.split('/')[1]
        const callable = call(k)
        // Allow unwrapped calls
        handler[methodName] = callable
        return [methodName, callable]
      })
    )
    handler[model] = renamed
  }
  return handler
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
