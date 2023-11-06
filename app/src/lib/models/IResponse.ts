import type { IModel } from '$lib/repositories/IModel';
import type { IValidationResult } from '$lib/repositories/IValidationResult';

export interface IResponse<T extends IModel> {
  validation: IValidationResult;
  entity: T | null;
}
