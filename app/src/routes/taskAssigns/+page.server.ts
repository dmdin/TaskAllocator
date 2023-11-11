import { fltMongo } from '$lib/utils';
import { composer } from './+server';

export async function load() {
  const tasks = await composer.TaskAssignRPC.getBySpecialistEmail({ email: 'bobip@yandex.ru', onlyActive: false }).then(r => fltMongo(r))
  const employees = await composer.SpecialistRPC.getAll({offset: 0, limit: 100}).then(r => fltMongo(r))
  return { schema: composer.getSchema(), tasks,employees };
}
