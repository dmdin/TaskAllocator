import { json } from '@sveltejs/kit'

import { Composer, rpc } from '$lib/chord'
import type { IManagerRPC } from './types'
import type { IManagerModel } from '$lib/models/IManagerModel'
import { getManagerInfo } from '$lib/roles/GetManagerInfo';

class ManagerRPC implements IManagerRPC {

    @rpc()
    async get(id: number): Promise<IManagerModel | null> {
        return await getManagerInfo(id);
    }
}

const composer = new Composer([ManagerRPC], { route: '/manager' })

export async function POST({ request }) {
  debugger;
  const body = await request.json()
  return json(await composer.exec(body))
}

export async function GET() {
  debugger;
  return json(composer.getSchema())
}