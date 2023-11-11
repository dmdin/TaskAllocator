import { json } from '@sveltejs/kit';

import { Composer, depends, rpc } from '$lib/chord';
import type { ISpecialistRPC, IPagingParams } from './types';
import type { RequestEvent } from '../$types';
import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import type { IValidationResult } from '$lib/repositories/IValidationResult';
import type { IResponse } from '$lib/models/IResponse';
import { SpecialistsRepository } from '$lib/repositories/SpecialistRepository';
import sveltekit from '$lib/chord/middlewares/sveltekit';
import { BranchRPC } from '../branches/+server';

const repo = new SpecialistsRepository();

interface Context {
  sb: unknown;
}

export class SpecialistRPC implements ISpecialistRPC {
  @depends()
  private readonly rpc2!: unknown;

  @depends()
  private readonly ctx!: Context;

  @rpc()
  async create(specialist: ISpecialistModel): Promise<IResponse<ISpecialistModel>> {
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

export const composer = new Composer([SpecialistRPC, BranchRPC], { route: '/specialists' });
composer.use(sveltekit());

export async function POST(event: RequestEvent) {
  return json(await composer.exec(event));
}
