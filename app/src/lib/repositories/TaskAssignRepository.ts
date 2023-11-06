import type { IBranchModel } from '$lib/models/IBranchModel';
import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import { TaskAssignStatus, type ITaskAssign } from '$lib/models/ITaskAssign';
import type { ITaskModel } from '$lib/models/ITaskModel';
import { isValidObjectId } from 'mongoose';
import type { IValidationResult } from './IValidationResult';
import { Repository } from './Repository';
import { ensureConnected } from './mongo';
import { BranchSchema, SpecialistSchema, TaskAssignScheme } from './mongoSchemes';
import { ToModel } from './toModel';
import { SpecialistsRepository } from './SpecialistRepository';

export class TaskAssignRepository extends Repository<ITaskAssign> {
  @ensureConnected
  async getForSpecialist(
    specialistId: string,
    onlyActive: boolean
  ): Promise<(ITaskAssign | null)[]> {
    let tasks = await this.model.find({
      specialistId: specialistId,
      status: { $in: this.getAvailableStatuses(onlyActive) }
    });
    return tasks.map(ToModel<ITaskAssign>);
  }

  @ensureConnected
  async getBySpecialistEmail(email: string, onlyActive: boolean): Promise<(ITaskAssign | null)[]> {
    var specialistRepo = new SpecialistsRepository();

    var specialist = await specialistRepo.getByEmail(email);

    let specialistId = specialist?.id ?? '';

    let tasks = await this.model.find({
      specialistId: specialistId.toString(),
      status: { $in: this.getAvailableStatuses(onlyActive) }
    });
    return tasks.map(ToModel<ITaskAssign>);
  }

  @ensureConnected
  async updateStatus(id: string, status: TaskAssignStatus): Promise<ITaskAssign | null> {
    let currentEntity = await this.model.findById(id);

    if (currentEntity != null) {
      currentEntity.status = status;
      return ToModel<ITaskAssign>(
        await this.model.findByIdAndUpdate(id, currentEntity, { new: true })
      );
    }

    return null;
  }

  async validateTaskAssign(entity: ITaskAssign): Promise<IValidationResult> {
    let result: IValidationResult = { valid: true, message: null };
    let branchRepo: Repository<IBranchModel> = new Repository<IBranchModel>('branch', BranchSchema);

    if (!isValidObjectId(entity.branchId)) {
      result.valid = false;
      result.message = `Невалидный Id отеделения`;
      return result;
    }

    let branch = await branchRepo.get(entity.branchId);

    if (branch == null) {
      result.valid = false;
      result.message = `Отеделения с id: ${entity.branchId} не существует`;
      return result;
    }

    if (entity.specialistId !== undefined && entity.specialistId !== null) {
      if (!isValidObjectId(entity.specialistId)) {
        result.valid = false;
        result.message = `Невалидный Id специалиста`;
        return result;
      }

      let specialistRepo: Repository<ISpecialistModel> = new Repository<ISpecialistModel>(
        'specialists',
        SpecialistSchema
      );

      let specialist = await specialistRepo.get(entity.specialistId);

      if (specialist == null) {
        result.valid = false;
        result.message = `Специалиста с id: ${entity.branchId} не существует`;
        return result;
      }
    }

    if (!isValidObjectId(entity.taskId)) {
      result.valid = false;
      result.message = `Невалидный Id задачи`;
      return result;
    }

    let taskRepo: Repository<ITaskModel> = new Repository<ITaskModel>('tasks', TaskAssignScheme);

    let task = taskRepo.get(entity.taskId);

    if (task == null) {
      result.valid = false;
      result.message = `Задача с id: ${entity.taskId} не существует`;
      return result;
    }

    return result;
  }

  private getAvailableStatuses(onlyActive: boolean): TaskAssignStatus[] {
    let availableTaskStatuses: TaskAssignStatus[];

    if (onlyActive) {
      availableTaskStatuses = [
        TaskAssignStatus.Assigned,
        TaskAssignStatus.InWork,
        TaskAssignStatus.Completed
      ];
    } else {
      availableTaskStatuses = [
        TaskAssignStatus.Created,
        TaskAssignStatus.Assigned,
        TaskAssignStatus.InWork,
        TaskAssignStatus.Completed
      ];
    }

    return availableTaskStatuses;
  }
}
