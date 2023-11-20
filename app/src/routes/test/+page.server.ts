import { composer } from './+server';

export async function load() {
  console.log(composer.TestRPC.dbReq2('2'))
  return { schema: composer.getSchema() };
}
