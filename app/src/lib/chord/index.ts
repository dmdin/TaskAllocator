import 'reflect-metadata';
import axios from 'axios';

interface MethodDescription {
  key: string;
  descriptor: PropertyDescriptor;
  target: unknown;
  metadata: {
    returnType: unknown;
    argsType: unknown[];
  }
}

export interface Schema {
  route: string
  methods: Record<string, { argsType: string[], returnType: string }>
}

export interface Call {
  method: string;
  args: unknown[]
}

export interface ComposerConfig {
  route?: string,
  wrapped?: boolean
}

// TODO think to make constructor instead
export class Composer {
  config?: ComposerConfig
  models: unknown[]

  constructor([...models], config?: ComposerConfig) {
    this.config = config 
    this.models = models;
  }
  static methods = new Map<string, MethodDescription>();

  static add({ key, descriptor, metadata, target }: MethodDescription) {
    Composer.methods.set(key, { key, descriptor, metadata, target });
  }

  getSchema(route?: string): Schema {
    route = route || this.config?.route as string;
    if (!route) {
      throw new EvalError("No route provided during Composer initialization or Schema generation")
    }
    const methods = {}
    for (const [key, info] of Composer.methods.entries()) {
      const { argsType, returnType } = info.metadata
      methods[key] = { argsType: argsType.map(a => a.name), returnType }
    }
    return { methods, route }
  }

  async exec({ method, args }: Call) {
    const { target, descriptor } = Composer.methods.get(method)
    return await descriptor.value.apply(target, [args])
  }
}



export function rpc() {
  return function (target: unknown, key: string, descriptor: PropertyDescriptor) {
    // console.log(key, key, descriptor)
    // console.log('Metadata', Reflect.getMetadataKeys(target))
    // console.log("design:paramtypes", Reflect.getMetadata("design:paramtypes", target, key));
    // console.log("design:type", Reflect.getMetadata("design:type", target, key));

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

  function call(method) {
    async function intercept(args) {
      return (await axios.post(schema.route, { args, method } as Call)).data
    }
    return intercept
  }


  const handler = {
    get(target, prop, argumentsList) { // (A)
      // if (typeof target[prop] === 'function') {
      return call(prop)
      // } else {
      //   return Reflect.get(target, prop);
      // }
    }
  }
  return new Proxy(schema.methods, handler)

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
