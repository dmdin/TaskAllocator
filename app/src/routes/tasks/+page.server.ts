import { composer } from './+server';

export async function load() {
  const tasks = await composer.TaskAssignRPC.getForManager(false);
  const branches = await composer.BranchRPC.getAll({ count: 100, offset: 0 });
  const employees = await composer.SpecialistRPC.getAll({ count: 100, offset: 0 });
  return { tasks, branches, employees, schema: composer.getSchema() };
}
