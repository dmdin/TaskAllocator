enum TaskPriority { Low, Medium, High };
enum EmployeeLevel { Junior, Middle, Senior };

//Условие назначения задачи
interface appointmentConditions{
    text: string
}

interface ITaskModel{
    id: string | undefined,
    name: string,
    priority: TaskPriority,
    executionPeriodMinutes: number,
    conditions: appointmentConditions[],
    requiredEmployeeLevel: EmployeeLevel
}