import type { EmployeeLevel } from './ITaskModel';

export interface ISpecialistModel {
  id: string | undefined;
  firstName: string;
  lastName: string;
  fatherName: string;
  address: string;
  email: string;
  level: EmployeeLevel;
}
