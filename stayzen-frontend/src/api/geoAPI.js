import axios from 'axios';

const geoApi = axios.create({
  baseURL: 'https://wft-geo-db.p.rapidapi.com/v1/geo',
  headers: {
    'X-RapidAPI-Key': 'b4c203956bmshacfcb5529af9680p17a25cjsn25446bfa4e0e',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
});

export default geoApi;