import { composer } from './+server';
import {fltMongo} from '$lib/utils'


export async function load() {
  const tasks = fltMongo(await composer.TaskAssignRPC.getForManager(false));
  const branches = fltMongo(await composer.BranchRPC.getAll({ count: 100, offset: 0 }));
  const employees = fltMongo(await composer.SpecialistRPC.getAll({ count: 100, offset: 0 }));
  console.log('load triggered')
  return { tasks, branches, employees, schema: composer.getSchema() };
}
