export enum TaskPriority { Low, Medium, High };
export enum EmployeeLevel { Junior = 0, Middle = 1, Senior = 2 };

//Условие назначения задачи
export interface appointmentConditions{
    text: string
}

export interface ITaskModel{
    id: string | undefined,
    name: string,
    priority: TaskPriority,
    executionPeriodMinutes: number,
    conditions: appointmentConditions[],
    level: EmployeeLevel
}