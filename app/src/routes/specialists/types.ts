import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
export type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import type { IPagingParams, IBranchRPC } from '../branches/types';
import type { IResponse } from '$lib/models/IResponse';


export interface ISpecialistRPC {
  getAll(params: IPagingParams): Promise<ISpecialistModel[]>;
  update(specialist: ISpecialistModel): Promise<ISpecialistModel>;
  delete(id: string): Promise<void>;
  create(specialist: ISpecialistModel): Promise<IResponse<ISpecialistModel>>;
  // getBranch(id: number): IBranch
}

export type Wrapped = { SpecialistRPC: ISpecialistRPC; BranchRPC: IBranchRPC };
export interface Unwrapped extends ISpecialistRPC {}
