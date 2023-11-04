import { json } from '@sveltejs/kit'

import { Composer, rpc } from '$lib/chord'
import type { ITestRPC } from './types'

// THIS IS CONTROLLER
class TestRPC implements ITestRPC {
  @rpc()
  dbReq(param: number): string {
    return `Hello, ${param}`
  }
  @rpc()
  dbReq2(param: string): number {
    return `Hello, ${param} from dbReq2!`
  }
}

const composer = new Composer([TestRPC], { route: '/test' })

export async function POST({ request }) {
  const body = await request.json()
  return json(await composer.exec(body))
}

export async function GET() {
  return json(composer.getSchema())
}