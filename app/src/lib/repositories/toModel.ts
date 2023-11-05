import type { IModel } from "./IModel";

export function ToModel<T extends IModel>(mongoModel: any): T | null {
    if(mongoModel != null)
    {
        const { _id, __v, ...rest } = mongoModel._doc;
        return { id: _id.toString(), ...rest };
    }
    else{
        return null;
    }
  };
  