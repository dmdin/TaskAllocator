import mongoose, { Model } from 'mongoose';
import { ensureConnected } from './mongo';
import type { IEntityRepository } from './IEntityRepository';
import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import type { ITaskModel } from '$lib/models/ITaskModel';


type IModel = IBranchModel | ISpecialistModel | ITaskModel

const ToModel = (mongoModel: any): IModel | null => {
    if(mongoModel != null)
    {
        const { _id, __v, ...rest } = mongoModel._doc;
        return { id: _id.toString(), ...rest };
    }
    else{
        return null;
    }
  };
  

export class Repository<T extends IModel> implements IEntityRepository<T> {

    model: Model<T>

    constructor(collecionName: string, scheme: mongoose.Schema){
        this.model =  mongoose.model<T>(collecionName, scheme);
    }

    @ensureConnected
    async create(item: T): Promise<T> {
       return ToModel(await this.model.create(item));
    }
  
    @ensureConnected
    async get(id: string): Promise<T | null> {
       return ToModel(await this.model.findById(id));
    }
  
    @ensureConnected
    async update(id: string, newItem: T): Promise<T | null> {
        return ToModel(await this.model.findByIdAndUpdate(id, newItem, { new: true }));
    }
  
    @ensureConnected
    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }
    
    @ensureConnected
    async getAll(offset: number, count: number): Promise<T[]> {
        let branches =  await this.model.find().skip(offset).limit(count);
        return branches.map(ToModel);
      }
  }