import type { ITaskAssign } from '$lib/models/ITaskAssign';
import type { ITaskAssignFullInfo } from '$lib/models/ITaskAssignFullInfo';

export interface ITaskAssignRPC {
  create(branch: ITaskAssign): Promise<string>;
  getBySpecialistEmail(params: IFindAssignedTaskByEmail): Promise<ITaskAssignFullInfo[]>
  getForManager(isAcrtive: boolean): Promise<ITaskAssignFullInfo[]>;
  get(id: string): Promise<ITaskAssign>;
  update(id: string): Promise<ITaskAssign>;
  delete(id: string): Promise<void>;
}
