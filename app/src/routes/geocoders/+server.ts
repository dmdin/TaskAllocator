import { json } from '@sveltejs/kit';

import { Composer, rpc } from '$lib/chord';
import type { IGeocoderRPC } from './types';
import type { IAddressModel } from '$lib/models/IAddressModel';
import { getCoordinates } from '$lib/geocoder/YandexGeocoder';

class GeocoderRPC implements IGeocoderRPC {
  @rpc()
  async getCoords(address: string): Promise<IAddressModel | null> {
    return await getCoordinates(address);
  }
}

const composer = new Composer({ GeocoderRPC }, { route: '/geocoder' });

export async function POST({ request }) {
  debugger;
  const body = await request.json();
  return json(await composer.exec(body));
}

export async function GET() {
  debugger;
  return json(composer.getSchema());
}
