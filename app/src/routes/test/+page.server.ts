import { composer } from './+server';

export async function load() {
  // composer
  return { schema: composer.getSchema() };
}
