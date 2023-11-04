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
    async create(item: IBranchModel): Promise<IBranchModel> {
       await ensureConnected();
       return ToModel(await BranchModel.create(item));
    }
  
    async get(id: string): Promise<IBranchModel | null> {
       await ensureConnected();
       return ToModel(await BranchModel.findById(id));
    }
  
    async update(id: string, newItem: IBranchModel): Promise<IBranchModel | null> {
        await ensureConnected();
        return ToModel(await BranchModel.findByIdAndUpdate(id, newItem, { new: true }));
    }
  
    async delete(id: string): Promise<void> {
        await ensureConnected();
        await BranchModel.findByIdAndDelete(id);
    }
        
    async getAll(offset: number, count: number): Promise<IBranchModel[]> {
        await ensureConnected();
        let branches =  await BranchModel.find().skip(offset).limit(count);
        return branches.map(ToModel);
      }
  }