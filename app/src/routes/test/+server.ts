import { json } from '@sveltejs/kit'
import type { RequestEvent } from '../$types'
import { Composer, rpc } from '$lib/chord'
import sveltekit from '$lib/chord/middlewares/sveltekit'
import type { ITestRPC, ITestRPC2 } from './types'


// THIS IS CONTROLLER
class TestRPC implements ITestRPC {
  @rpc()
  dbReq(param: number): string {
    return `Hello, ${param}`
  }
  @rpc()
  dbReq2(param: string): string {
    return `Hello dbReq2, ${param}`
  }
}

class TestRPC2 implements ITestRPC2 {
  @rpc()
  dbReq(param: number): string {
    return `Hello from TestRPC2, ${param}!`
  }
  @rpc()
  dbReq3(param: string, param2: number, ctx?: unknown): string {
    console.log('ctx', ctx.session.user.email)
    return `Hello from TestRPC2 dbReq3, ${param} ${param2}!`
  }
}

export const composer = new Composer({ TestRPC, TestRPC2 }, { route: '/test' })
composer.use(sveltekit())

export async function POST(event: RequestEvent) {
  return json(await composer.exec(event))
}
