import type { TaskPriority } from "./ITaskModel";

export enum TaskAssignStatus { Todo, InWork, Completed };

export interface ITaskAssign {
    id: string | undefined;
    taskId: string,
    specialistId: string,
    branchId: string,
    date: Date,
    taskNumber: number,
    status: TaskAssignStatus,
    priority: TaskPriority
}