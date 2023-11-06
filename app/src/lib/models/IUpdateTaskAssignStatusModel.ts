import type { TaskAssignStatus } from './ITaskAssign';

export interface IUpdateTaskAssignStatusModel {
  id: string;
  newStatus: TaskAssignStatus;
}
