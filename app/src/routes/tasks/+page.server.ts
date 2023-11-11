import { composer } from './+server';
import { fltMongo } from '$lib/utils'


export async function load() {

  let [tasks, branches, employees] = await Promise.all([
    composer.TaskAssignRPC.getForManager(false).then(r => fltMongo(r)),
    composer.BranchRPC.getAll({ count: 100, offset: 0 }).then(r => fltMongo(r)),
    composer.SpecialistRPC.getAll({ count: 100, offset: 0 }).then(r => fltMongo(r))
  ])
  return { tasks, branches, employees, schema: composer.getSchema() };
}
