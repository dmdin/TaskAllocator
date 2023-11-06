import { json } from '@sveltejs/kit'

import { Composer, rpc } from '$lib/chord/dev'
import type { ITestRPC, ITestRPC2, Composed } from './types'

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
    return ` Hello from TestRPC2, ${param}!`
  }
}




const composer = new Composer({TestRPC, TestRPC2}, { route: '/test' })

export async function POST({ request }) {
  debugger;
  const body = await request.json()
  return json(await composer.exec(body))
}

export async function GET() {
  debugger;
  return json(composer.getSchema())
}