import type { IPagingParams } from '$lib/models/IPagingParams';
import type { ITaskModel } from '$lib/models/ITaskModel';

export interface ITaskRPC {
  create(branch: ITaskModel): Promise<string>;
  getAll(params: IPagingParams): Promise<ITaskModel[]>;
  get(id: string): Promise<ITaskModel>;
  update(id: string): Promise<ITaskModel>;
  delete(id: string): Promise<void>;
}
