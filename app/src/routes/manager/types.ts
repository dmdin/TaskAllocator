import type { IManagerModel } from "$lib/models/IManagerModel"

export interface IManagerRPC {
    get(id: number): Promise<IManagerModel | null>
  }

  