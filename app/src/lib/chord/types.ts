import type {
  Request,
  Error,
  BatchRequest,
  SomeResponse,
  BatchResponse,
} from './specs'
import type {Composer} from '.'

export interface MethodDescription {
  key: PropKey;
  descriptor: PropertyDescriptor;
  target: Target;
  metadata: MethodMetadata;
  use: Middleware[];
}

export interface MethodConfig {
  use?: Middleware[]
}

export interface PropertyDescription {
  key: string;
  target: Target;
}

export interface MethodMetadata {
  returnType: string;
  argsType: string[];
}

export interface Schema {
  route: string;
  methods: Record<string, MethodMetadata>;
  models: string[];
}

export type Transport = (data: { route: string, body: unknown }) => Promise<SomeResponse | BatchResponse>
export type ErrorCallback = (e: Error, req: Request) => Promise<unknown> | unknown

export interface ClientConfig {
  transport?: Transport
  onError?: ErrorCallback;
}

export interface ComposerConfig {
  route?: string;
  onError?: ErrorCallback;
}

export interface Target {
  constructor: { name: string };
}

export type InjectedModels<T> = {
  [Property in keyof T]: BatchedMethods<T[Property]>
}

export type BatchedMethods<T> = {
  [Property in keyof T]: T[Property] & {
    // @ts-nocheck
    batch: (...args: Parameters<T[Property]>) => Request
  }

}

export type Client<T> = InjectedModels<T> & {
  batch: (...calls: BatchRequest) => Promise<unknown[]>,
}

export type Composed<T> = Composer<T> & InjectedModels<T>

export type PropKey = string | symbol;
export type ClassConstructor<T extends object> = new (...params: unknown[]) => T;
export type Middleware = (event: unknown, ctx: Record<string, unknown>, next: CallableFunction) => Promise<unknown>;