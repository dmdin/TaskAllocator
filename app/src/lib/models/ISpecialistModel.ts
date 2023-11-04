import type { EmployeeLevel } from "./ITaskModel";

export interface ISpecialistModel {
    id: string | undefined,
    firstName: string;
    lastName: string;
    fatherName: string;
    location: string;
    coordinates: number[];
    level: EmployeeLevel;
  }