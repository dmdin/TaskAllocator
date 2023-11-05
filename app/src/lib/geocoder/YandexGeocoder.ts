import { GEOCODER_API_KEY } from '$env/static/private';
import type { IAddressModel } from "$lib/models/IAddressModel";
import axios from "axios";

export async function getCoordinates(address: string): Promise<IAddressModel | null> {
    let result: IAddressModel | null = null;

    var response = await axios
        .get(`https://geocode-maps.yandex.ru/1.x/?apikey=${GEOCODER_API_KEY}&geocode=${address},Россия&format=json`);

    if (response?.data?.response?.GeoObjectCollection?.featureMember?.length > 0) {
        let address = `${response.data.response.GeoObjectCollection.featureMember[0].GeoObject.name} 
        ${response.data.response.GeoObjectCollection.featureMember[0].GeoObject.description}`;
        let coords = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
            
        if (coords?.length > 0) {
            let coordsArr = coords.split(" ").map(x => x.trim());
            if (coordsArr.length == 2) {
                result = {
                    latitude: Number(coordsArr[1]),
                    longitude: Number(coordsArr[0]),
                    address: address
                }
            }
        }
    }

    return result;
}

