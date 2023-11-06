export interface ITestRPC {
  dbReq(param: number): string
  dbReq2(param: string): string
}

export interface ITestRPC2 {
  dbReq(param: number): string
}

export type Composed = {ITestRPC: ITestRPC, ITestRPC2: ITestRPC2}