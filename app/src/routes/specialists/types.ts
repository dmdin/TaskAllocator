import type { IBranchModel } from '$lib/models/IBranchModel';
import type { IPagingParams } from '../branches/types';

export interface ISpecialistRPC {
  getAll(params: IPagingParams): Promise<IBranchModel[]>;
  update(id: string): Promise<ISpecialistRPC>;
  delete(id: string): Promise<void>;
  // getBranch(id: number): IBranch
}
