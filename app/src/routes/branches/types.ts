export interface IBranchRPC {
    createBranch(branch: IBranchModel): Promise<string>
    getBranch(id: string): Promise<IBranchModel>
    // getBranch(id: number): IBranch
  }