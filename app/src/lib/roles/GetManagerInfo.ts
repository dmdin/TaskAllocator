import type { IManagerModel } from "$lib/models/IManagerModel";

export async function getManagerInfo(id: number): Promise<IManagerModel | null> {
    // TODO: mongo get info about manager by id
    return {manager_id: 123,
        name: "Huy",
        surname: "Suy",
        fatherName: "You"} as IManagerModel;
}

