import { json } from '@sveltejs/kit'

import { Composer, rpc } from '$lib/chord'
import type { IBranchRPC } from './types'
import { BranchRepository } from '$lib/repositories/branchRepository'

class BranchRPC implements IBranchRPC {
    repo: BranchRepository;
    constructor(){
        this.repo = new BranchRepository()
    }
  @rpc()
  async createBranch(branch: IBranchModel): Promise<IBranchModel> {
    return await this.repo.create(branch)
  }

  @rpc()
  async getBranch(id: string): Promise<IBranchModel | null> {
    return await this.repo.get(id)
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