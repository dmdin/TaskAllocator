import { composer } from './+server';
import { fltMongo } from '$lib/utils';

export async function load() {
  const employees = fltMongo(await composer.SpecialistRPC.getAll({ count: 100, offset: 0 }));
  const branches = fltMongo(await composer.BranchRPC.getAll({ count: 100, offset: 0 }));
  return { branches, employees, schema: composer.getSchema() };
}
