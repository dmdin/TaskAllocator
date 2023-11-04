export interface IPagingParams{
    offset: number,
    count: number
}

export interface ISpecialistRPC {
    createBranch(branch: IBranchModel): Promise<string>
    getAll(params: IPagingParams): Promise<IBranchModel[]>
    getBranch(id: string): Promise<IBranchModel>
    update(id: string): Promise<ISpecialistRPC>
    delete(id: string): Promise<void>
    // getBranch(id: number): IBranch
  }

  