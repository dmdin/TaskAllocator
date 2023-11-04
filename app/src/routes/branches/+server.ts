import { json } from '@sveltejs/kit'

import { Composer, rpc } from '$lib/chord'
import type { IBranchRPC, IPagingParams } from './types'
import { BranchRepository } from '$lib/repositories/branchRepository'

var repo = new BranchRepository()
class BranchRPC implements IBranchRPC {

    @rpc()
    async create(branch: IBranchModel): Promise<IBranchModel> {
        return await repo.create(branch)
    }

    @rpc()
    async get(id: string): Promise<IBranchModel | null> {
        return await repo.get(id)
    }

    @rpc()
    async getAll(params: IPagingParams): Promise<IBranchModel[]>{
        return await repo.getAll(params.offset, params.count)
    }

    @rpc()
    async update(branch: IBranchModel): Promise<IBranchModel | null>{
        let result: IBranchModel | null = null;
        if(branch.id != null){
            result = await repo.update(branch.id, branch)
        }
        
        return result;
    }

    @rpc()
    async delete(id: string): Promise<void>{
        await repo.delete(id)
    }
}

const composer = new Composer([BranchRPC], { route: '/test' })

export async function POST({ request }) {
  debugger;
  const body = await request.json()
  return json(await composer.exec(body))
}

export async function GET() {
  debugger;
  return json(composer.getSchema())
}