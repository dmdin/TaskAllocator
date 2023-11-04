enum TaskPriority { Low, Medium, High };

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
    requiredEmployeeLevel: 
}