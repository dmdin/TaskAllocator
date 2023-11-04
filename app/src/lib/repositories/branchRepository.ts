import mongoose, { Document, Model, type AnyArray, type ConnectOptions } from 'mongoose';
import { ensureConnected } from './mongo';



const branchSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId, required: false},
    address: { type: String, required: true },
    connectionDate: {type: Number, required: true},
    cardMaterialsDelivered: { type: Number, required: true },
    lastCardIssuanceDays: { type: Number, required: true },
    approvedIssuesNumber: { type: Number, required: true },
    issuanceCardCount: { type: Number, required: true },
  });

const BranchModel: Model<IBranchModel> = mongoose.model<IBranchModel>('Branch', branchSchema);

const ToModel = (mongoBranch: any): IBranchModel | null => {
    if(mongoBranch != null)
    {
        const { _id, __v, ...rest } = mongoBranch._doc;
        return { id: _id.toString(), ...rest };
    }
    else{
        return null;
    }
  };
  


export class BranchRepository {
    @ensureConnected
    async create(item: IBranchModel): Promise<IBranchModel> {
       return ToModel(await BranchModel.create(item));
    }
  
    @ensureConnected
    async get(id: string): Promise<IBranchModel | null> {
       return ToModel(await BranchModel.findById(id));
    }
  
    @ensureConnected
    async update(id: string, newItem: IBranchModel): Promise<IBranchModel | null> {
        return ToModel(await BranchModel.findByIdAndUpdate(id, newItem, { new: true }));
    }
  
    @ensureConnected
    async delete(id: string): Promise<void> {
        await BranchModel.findByIdAndDelete(id);
    }
    
    @ensureConnected
    async getAll(offset: number, count: number): Promise<IBranchModel[]> {
        let branches =  await BranchModel.find().skip(offset).limit(count);
        return branches.map(ToModel);
      }
  }