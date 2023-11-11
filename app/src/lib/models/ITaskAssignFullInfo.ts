import type { ISpecialistModel } from './ISpecialistModel';
import type { TaskAssignStatus } from './ITaskAssign';
import type { TaskPriority } from './ITaskModel';

export interface ITaskInfo {
  id: string | undefined;
  name: string | undefined;
}

export interface IOfficeInfo {
  id: string | undefined;
  address: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
}

export interface ITaskAssignFullInfo {
  id: string | undefined | undefined;
  task: ITaskInfo | undefined;
  branch: IOfficeInfo | undefined;
  specialist: ISpecialistModel | null,
  taskNum: number | null;
  created: Date | null;
  priority: TaskPriority | null;
  status: TaskAssignStatus | undefined;
  level: string,
}
