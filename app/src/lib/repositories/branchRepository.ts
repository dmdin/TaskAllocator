import mongoose, { Document, Model } from 'mongoose';

await mongoose.connect('');


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


export class BranchRepository {
    async create(item: IBranchModel): Promise<IBranchModel> {
       return await BranchModel.create(item);
    }
  
    async get(id: string): Promise<IBranchModel | null> {
        return await BranchModel.findById(id);
    }
  
    async update(id: string, newItem: IBranchModel): Promise<IBranchModel | null> {
        return await BranchModel.findByIdAndUpdate(id, newItem, { new: true });
    }
  
    async delete(id: string): Promise<void> {
        await BranchModel.findByIdAndDelete(id);
    }
        
  
    async getAll(): Promise<IBranchModel[]> {
        return await BranchModel.find();
      }
  }