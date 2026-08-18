import axios from 'axios';

const KEY = 'rc_live_c825aecab0a4498ab8ee017da02313a3';

const apiClient = axios.create({
  baseURL: 'https://api.restcountries.com/countries/v5',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${KEY}`,
  },
});

export default apiClient;