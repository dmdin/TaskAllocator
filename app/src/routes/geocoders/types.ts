import type { IAddressModel } from '$lib/models/IAddressModel';

export interface IGeocoderRPC {
  getCoords(address: string): Promise<IAddressModel | null>;
}
