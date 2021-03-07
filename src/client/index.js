import axios from 'axios';
import config from '../lib/config';

export const restClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000
});
