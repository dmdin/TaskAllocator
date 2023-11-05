import { json } from '@sveltejs/kit'

import { Composer, rpc } from '$lib/chord'
import type { ITaskAssign } from '$lib/models/ITaskAssign'
import { TaskScheme } from '$lib/repositories/mongoSchemes'
import type { IResponse } from '$lib/models/IResponse'
import type { ITaskRPC } from './types'
import { Repository } from '$lib/repositories/Repository'
import type { IPagingParams } from '$lib/models/IPagingParams'
import type { ITaskModel } from '$lib/models/ITaskModel'
import type { IValidationResult } from '$lib/repositories/IValidationResult'

var taskRepo = new Repository<ITaskModel>("tasks", TaskScheme)
class TaskRPC implements ITaskRPC {

    @rpc()
    async create(task: ITaskModel): Promise<IResponse<ITaskModel>> {
        return {
            validation: {valid: true} as IValidationResult,
            entity: await taskRepo.create(task)
        };
    }

    @rpc()
    async get(id: string): Promise<ITaskModel | null> {
        return await taskRepo.get(id)
    }

    @rpc()
    async getAll(params: IPagingParams): Promise<(ITaskModel | null)[]>{
        return await taskRepo.getAll(params.offset, params.count)
    }

    @rpc()
    async update(task: ITaskModel): Promise<IResponse<ITaskModel>>{
        let result: IResponse<ITaskModel> = {validation: {valid: true} as IValidationResult, entity: null}

        if(task.id != null){
            result.entity = await taskRepo.update(task.id, task)

            if(result.entity == null){
                result.validation.valid = false;
                result.validation.message = `Сущность с Id: ${task.id} не найдена`
            }
        }
        
        return result;
    }

    @rpc()
    async delete(id: string): Promise<void>{
        await taskRepo.delete(id)
    }
}

const composer = new Composer([TaskRPC], { route: '/test' })

export async function POST({ request }) {
  debugger;
  const body = await request.json()
  return json(await composer.exec(body))
}

export async function GET() {
  debugger;
  return json(composer.getSchema())
}