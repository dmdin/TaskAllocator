import mongoose, { Model } from 'mongoose';
import { ensureConnected } from './mongo';
import type { IEntityRepository } from './IEntityRepository';
import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import type { ITaskModel } from '$lib/models/ITaskModel';
import type { IBranchModel } from '$lib/models/IBranchModel';
import type { ITaskAssign } from '$lib/models/ITaskAssign';
import type { IModel } from './IModel';
import { ToModel } from './toModel';

export class Repository<T extends IModel> implements IEntityRepository<T> {
  model: Model<T>;

  constructor(collecionName: string, scheme: mongoose.Schema) {
    this.model = mongoose.model<T>(collecionName, scheme);
  }

  @ensureConnected
  async create(item: T): Promise<T> {
    return ToModel<T>(await this.model.create(item)) as T;
  }

  @ensureConnected
  async get(id: string): Promise<T | null> {
    return ToModel<T>(await this.model.findById(id));
  }

  @ensureConnected
  async update(id: string, newItem: T): Promise<T | null> {
    return ToModel<T>(await this.model.findByIdAndUpdate(id, newItem, { new: true }));
  }

  @ensureConnected
  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  @ensureConnected
  async getAll(offset: number, count: number): Promise<T[]> {
    let branches = await this.model.find().skip(offset).limit(count);
    return branches.map((x) => ToModel<T>(x) as T);
  }
}
