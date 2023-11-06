import type { ITaskAssign } from '$lib/models/ITaskAssign';

export interface ITaskAssignRPC {
  create(branch: ITaskAssign): Promise<string>;
  getForSpecialit(specialitsId: string): Promise<ITaskAssign[]>;
  get(id: string): Promise<ITaskAssign>;
  update(id: string): Promise<ITaskAssign>;
  delete(id: string): Promise<void>;
}
