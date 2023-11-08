import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import type { IPagingParams } from '../branches/types';

export interface ISpecialistRPC {
  getAll(params: IPagingParams): Promise<ISpecialistModel[]>;
  update(id: string): Promise<ISpecialistModel>;
  delete(id: string): Promise<void>;
  // getBranch(id: number): IBranch
}

export type Wrapped = { SpecialistRPC: ISpecialistRPC; };
export interface Unwrapped extends ISpecialistRPC {}
