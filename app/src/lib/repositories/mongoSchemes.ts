import { EmployeeLevel, TaskPriority } from "$lib/models/ITaskModel"; 
import mongoose from "mongoose";

export const AddressScheme = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
})

export const BranchSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId, required: false},
    address:{ type: AddressScheme, required: true },
    connectionDate: {type: Number, required: true},
    cardMaterialsDelivered: { type: Number, required: true },
    lastCardIssuanceDays: { type: Number, required: true },
    approvedIssuesNumber: { type: Number, required: true },
    issuanceCardCount: { type: Number, required: true },
  });

 

  export const SpecialistSchema = new mongoose.Schema ({
    id: { type: mongoose.Schema.ObjectId, required: false},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String, required: true },
    address:{ type: AddressScheme, required: true },
    level: { type: String, enum: Object.values(EmployeeLevel), required: true },
  });

  export const TaskSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId, required: false},
    name: { type: String, required: true },
    priority: { type: String, enum: Object.values(TaskPriority), required: true },
    executionPeriodMinutes: { type: Number, required: true },
    conditions: { type: Object, required: true },
    level: { type: String, enum: Object.values(EmployeeLevel), required: true },
});