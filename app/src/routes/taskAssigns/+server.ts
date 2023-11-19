import { json } from '@sveltejs/kit';

import { Composer, rpc } from '$lib/chord';
import type { ITaskAssignRPC, IPagingParams } from './types';
import { Repository } from '$lib/repositories/Repository';
import sveltekit from '$lib/chord/middlewares/sveltekit';
import type { ITaskAssign } from '$lib/models/ITaskAssign';
import { TaskAssignScheme } from '$lib/repositories/mongoSchemes';
import { TaskAssignRepository } from '$lib/repositories/TaskAssignRepository';
import type { IValidationResult } from '$lib/repositories/IValidationResult';
import type { IResponse } from '$lib/models/IResponse';
import type { IUpdateTaskAssignStatusModel } from '$lib/models/IUpdateTaskAssignStatusModel';
import type { ITaskAssignFullInfo } from '$lib/models/ITaskAssignFullInfo';
import { SpecialistRPC } from '../specialists/+server';

const taskAssignRepo = new TaskAssignRepository('task-assign', TaskAssignScheme);
export class TaskAssignRPC implements ITaskAssignRPC {
  @rpc()
  async create(taskAssign: ITaskAssign): Promise<IResponse<ITaskAssign>> {
    let validationResult = await taskAssignRepo.validateTaskAssign(taskAssign);

    if (validationResult.valid !== true) {
      return {
        validation: validationResult,
        entity: null
      };
    }

    return {
      validation: validationResult,
      entity: await taskAssignRepo.create(taskAssign)
    };
  }

  @rpc()
  async get(id: string): Promise<ITaskAssign | null> {
    return await taskAssignRepo.get(id);
  }

  @rpc()
  async getForSpecialist(
    specialitsId: string,
    onlyActive: boolean
  ): Promise<(ITaskAssign | null)[]> {
    return await taskAssignRepo.getForSpecialist(specialitsId, onlyActive);
  }

  @rpc()
  async updateStatus(param: IUpdateTaskAssignStatusModel): Promise<ITaskAssign | null> {
    return await taskAssignRepo.updateStatus(param.id, param.newStatus);
  }

  @rpc()
  async getBySpecialistEmail(params: IFindAssignedTaskByEmail): Promise<ITaskAssignFullInfo[]> {
    const tasks = await taskAssignRepo.getBySpecialistEmail(params.email, params.onlyActive)
    tasks.sort((a, b) => a.taskNum - b.taskNum)
    return tasks;
  }

  @rpc()
  async getForManager(onlyActive: boolean): Promise<ITaskAssignFullInfo[]> {
    return await taskAssignRepo.getForManager(onlyActive);
  }

  @rpc()
  async update(taskAssign: ITaskAssign): Promise<ITaskAssign | null> {
    let result: ITaskAssign | null = null;
    if (taskAssign.id != null) {
      result = await taskAssignRepo.update(taskAssign.id, taskAssign);
    }

    return result;
  }

  @rpc()
  async delete(id: string): Promise<void> {
    await taskAssignRepo.delete(id);
  }
}

export const composer = new Composer({ TaskAssignRPC, SpecialistRPC }, { route: '/taskAssigns' });
composer.use(sveltekit());

export async function POST(event) {
  return json(await composer.exec(event));
}

export async function GET() {
  return json(composer.getSchema());
}
