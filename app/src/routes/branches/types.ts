import type { IBranchModel } from '$lib/models/IBranchModel';
import type { IPagingParams } from '$lib/models/IPagingParams';

export interface IBranchRPC {
  createBranch(branch: IBranchModel): Promise<string>;
  getAll(params: IPagingParams): Promise<IBranchModel[]>;
  getBranch(id: string): Promise<IBranchModel>;
  update(id: string): Promise<IBranchRPC>;
  delete(id: string): Promise<void>;
  // getBranch(id: number): IBranch
}


export type Wrapped = { BranchRPC: IBranchRPC; };
export interface Unwrapped extends IBranchRPC {}