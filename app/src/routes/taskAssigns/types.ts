import type { ITaskAssign } from '$lib/models/ITaskAssign';
import type { ITaskAssignFullInfo } from '$lib/models/ITaskAssignFullInfo';

export interface ITaskAssignRPC {
  create(branch: ITaskAssign): Promise<string>;
  getBySpecialistEmail(specialitsId: string): Promise<ITaskAssignFullInfo[]>;
  getForManager(isActive: boolean): Promise<ITaskAssign[]>;
  get(id: string): Promise<ITaskAssign>;
  update(id: string): Promise<ITaskAssign>;
  delete(id: string): Promise<void>;
}

export type Wrapped = { TaskAssignRPC: ITaskAssignRPC; };
