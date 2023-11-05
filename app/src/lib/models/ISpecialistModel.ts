import type { IAddressModel } from "./IAddressModel";
import type { EmployeeLevel } from "./ITaskModel";

export interface ISpecialistModel {
    id: string | undefined,
    firstName: string;
    lastName: string;
    fatherName: string;
    address: IAddressModel,
    level: EmployeeLevel;
  }