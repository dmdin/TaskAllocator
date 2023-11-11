import type { TaskPriority } from './ITaskModel';

export enum TaskAssignStatus {
  Todo = 0,
  InWork,
  Completed
}

export interface ITaskAssign {
  id: string | undefined;
  taskId: string;
  specialistId: string | null;
  branchId: string;
  date: Date | null;
  taskNumber: number | null;
  status: TaskAssignStatus;
  priority: TaskPriority;
  level: string
}
