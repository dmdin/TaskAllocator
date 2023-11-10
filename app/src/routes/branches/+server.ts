import { json } from '@sveltejs/kit';

import { Composer, rpc } from '$lib/chord';
import type { IBranchModel } from '$lib/models/IBranchModel';
import sveltekit from '$lib/chord/middlewares/sveltekit';
import type { IBranchRPC, IPagingParams } from './types';
import { Repository } from '$lib/repositories/Repository';
import { BranchSchema } from '$lib/repositories/mongoSchemes';
import type { IValidationResult } from '$lib/repositories/IValidationResult';

const repo = new Repository<IBranchModel>('branch', BranchSchema);
export class BranchRPC implements IBranchRPC {
  @rpc()
  async create(branch: IBranchModel): Promise<IBranchModel> {
    return await repo.create(branch);
  }

  @rpc()
  async get(id: string): Promise<IBranchModel | null> {
    return await repo.get(id);
  }

  @rpc()
  async getAll(params: IPagingParams): Promise<IBranchModel[]> {
    return await repo.getAll(params.offset, params.count);
  }

  @rpc()
  async update(branch: IBranchModel): Promise<IBranchModel | null> {
    let result: IResponse<IBranchModel> = {
      validation: { valid: true } as IValidationResult,
      entity: null
    };

    if (branch.id != null) {
      result = await repo.update(branch.id, branch);
    }

    return result;
  }

  @rpc()
  async delete(id: string): Promise<void> {
    await repo.delete(id);
  }
}

export const composer = new Composer([BranchRPC], { route: '/branches' });
composer.use(sveltekit());
export async function POST(event) {
  debugger;
  return json(await composer.exec(event));
}