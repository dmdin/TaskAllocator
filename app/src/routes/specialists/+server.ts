import { json } from '@sveltejs/kit'

import { Composer, rpc } from '$lib/chord'
import type { ISpecialistRPC, IPagingParams } from './types'
import { Repository } from '$lib/repositories/Repository'
import { SpecialistSchema } from '$lib/repositories/mongoSchemes'
import type { ISpecialistModel } from '$lib/models/ISpecialistModel'

var repo = new Repository<ISpecialistModel>("specialists", SpecialistSchema)
class SpecialistRPC implements ISpecialistRPC {

    @rpc()
    async create(specialist: ISpecialistModel): Promise<ISpecialistModel> {
        return await repo.create(specialist)
    }

    @rpc()
    async get(id: string): Promise<ISpecialistModel | null> {
        return await repo.get(id)
    }

    @rpc()
    async getAll(params: IPagingParams): Promise<ISpecialistModel[]>{
        return await repo.getAll(params.offset, params.count)
    }

    @rpc()
    async update(specialist: ISpecialistModel): Promise<ISpecialistModel | null>{
        let result: ISpecialistModel | null = null;
        if(specialist.id != null){
            result = await repo.update(specialist.id, specialist)
        }
        
        return result;
    }

    @rpc()
    async delete(id: string): Promise<void>{
        await repo.delete(id)
    }
}

const composer = new Composer([SpecialistRPC], { route: '/specialists' })

export async function POST({ request }) {
  debugger;
  const body = await request.json()
  return json(await composer.exec(body))
}

export async function GET() {
  debugger;
  return json(composer.getSchema())
}