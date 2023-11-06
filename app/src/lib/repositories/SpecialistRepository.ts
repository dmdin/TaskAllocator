import type { ISpecialistModel } from '$lib/models/ISpecialistModel';
import { Repository } from './Repository';
import { ensureConnected } from './mongo';
import { SpecialistSchema } from './mongoSchemes';
import { ToModel } from './toModel';

export class SpecialistsRepository extends Repository<ISpecialistModel> {
  constructor() {
    super('specialists', SpecialistSchema);
  }

  @ensureConnected
  async getByEmail(email: String): Promise<ISpecialistModel | null> {
    let specialist = await this.model.findOne({ email: email });
    return ToModel<ISpecialistModel>(specialist);
  }
}
