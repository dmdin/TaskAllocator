import { json } from '@sveltejs/kit';

import { Composer, rpc } from '$lib/chord';
import type { ISpecialistRPC, IPagingParams } from './types';
import sveltekit from '$lib/chord/middlewares/sveltekit';
import { Repository } from '$lib/repositories/Repository';
import { SpecialistSchema } from '$lib/repositories/mongoSchemes';
import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import type { IValidationResult } from '$lib/repositories/IValidationResult';
import type { IResponse } from '$lib/models/IResponse';
import { SpecialistsRepository } from '$lib/repositories/SpecialistRepository';
import type { RequestEvent } from '../$types';

const repo = new SpecialistsRepository();

class SpecialistRPC implements ISpecialistRPC {
  @rpc()
  async create(specialist: ISpecialistModel, ctx?: unknown): Promise<IResponse<ISpecialistModel>> {
    return {
      validation: { valid: true } as IValidationResult,
      entity: await repo.create(specialist)
    };
  }

  @rpc()
  async get(id: string): Promise<ISpecialistModel | null> {
    return await repo.get(id);
  }

  @rpc()
  async getAll(params: IPagingParams): Promise<ISpecialistModel[]> {
    return await repo.getAll(params.offset, params.count);
  }

  @rpc()
  async getByEmail(email: String): Promise<ISpecialistModel | null> {
    return await repo.getByEmail(email);
  }

  @rpc()
  async update(specialist: ISpecialistModel): Promise<ISpecialistModel | null> {
    let result: IResponse<ISpecialistModel> = {
      validation: { valid: true } as IValidationResult,
      entity: null
    };

    if (specialist.id != null) {
      result.entity = await repo.update(specialist.id, specialist);

      if (result.entity == null) {
        result.validation.valid = false;
        result.validation.message = `Сущность с Id: ${specialist.id} не найдена`;
      }
    }

    return result;
  }

  @rpc()
  async delete(id: string): Promise<void> {
    await repo.delete(id);
  }
}

export const composer = new Composer([SpecialistRPC], { route: '/specialists' });
composer.use(sveltekit());
export async function POST(event) {
  debugger;
  return json(await composer.exec(event));
}
