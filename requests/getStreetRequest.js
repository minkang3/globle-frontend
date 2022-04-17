import axios from 'axios'
import {GOOGLE_API_KEY, GOOGLE_URL} from '@env';

const RADIUS = 200; 

if(!GOOGLE_API_KEY){ throw new Error('GOOGLE_API_KEY cannot be undefined'); }

if(!URL){ throw new Error('URL cannot be undefined'); }

function createURL(url, lat, lon, radius, apikey, size='400x400', fov=80, head=70, pitch=0) {
    return `${url}?size=${size}&location=${lat},${lon}&fov=${fov}&heading=${head}&pitch=${pitch}&radius=${radius}&key=${apikey}`;
}

const getStreetRequest = async (latitude, longitude) => {

    const url = createURL(GOOGLE_URL, latitude, longitude, RADIUS, GOOGLE_API_KEY);

    return {
        url: url,
        method: 'get',
        headers: {},
    }

}

export default getStreetRequest;