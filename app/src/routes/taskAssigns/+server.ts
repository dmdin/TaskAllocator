import { json } from '@sveltejs/kit';

import { Composer, rpc } from '$lib/chord';
import type { ITaskAssignRPC, IPagingParams } from './types';
import { Repository } from '$lib/repositories/Repository';
import type { ITaskAssign } from '$lib/models/ITaskAssign';
import { TaskAssignScheme } from '$lib/repositories/mongoSchemes';
import { TaskAssignRepository } from '$lib/repositories/TaskAssignRepository';
import type { IValidationResult } from '$lib/repositories/IValidationResult';
import type { IResponse } from '$lib/models/IResponse';
import type { IUpdateTaskAssignStatusModel } from '$lib/models/IUpdateTaskAssignStatusModel';

var taskAssignRepo = new TaskAssignRepository('task-assign', TaskAssignScheme);
class TaskAssignRPC implements ITaskAssignRPC {
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
  async getBySpecialistEmail(params: IFindAssignedTaskByEmail): Promise<(ITaskAssign | null)[]> {
    return await taskAssignRepo.getBySpecialistEmail(params.email, params.onlyActive);
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
    await repo.delete(id);
  }
}

const composer = new Composer([TaskAssignRPC], { route: '/test' });

export async function POST({ request }) {
  debugger;
  const body = await request.json();
  return json(await composer.exec(body));
}

export async function GET() {
  debugger;
  return json(composer.getSchema());
}
