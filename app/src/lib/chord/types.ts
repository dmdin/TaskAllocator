export interface MethodDescription {
  key: string;
  descriptor: PropertyDescriptor;
  target: Target;
  metadata: MethodMetadata;
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

export interface Call {
  method: string;
  args: unknown[];
}

export interface ComposerConfig {
  route?: string;
}

export interface Target {
  constructor: { name: string };
}

export type ComposerModels = unknown[] | Record<string, unknown>;
