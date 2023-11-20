import type {
  Some,
  Request,
  Response,
  Error,
  FailedResponse,
} from './specs'
import type {Composer} from '.'

export interface MethodDescription {
  key: string;
  descriptor: PropertyDescriptor;
  target: Target;
  metadata: MethodMetadata;
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

export type Transport = (data: { route: string, body: unknown }) => Promise<Some<FailedResponse, Response>>
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
  [Property in keyof T]: T[Property]
}

export type Client<T> = InjectedModels<T> & {
  batch: (...calls: unknown[]) => Promise<unknown>,
  b: InjectedModels<T>
}

export type Composed<T> = Composer<T> & InjectedModels<T>

export type PropKey = string | symbol;
export type ClassConstructor<T extends object> = new (...params: any) => T;
