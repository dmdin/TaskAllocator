import { fltMongo } from '$lib/utils';
import { composer } from './+server';

export async function load() {
  const branches = fltMongo(await composer.BranchRPC.getAll({ count: 100, offset: 0 }));

  return { schema: composer.getSchema(), branches };
}
