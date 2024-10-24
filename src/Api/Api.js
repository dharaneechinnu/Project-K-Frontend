import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://140.245.214.34/api'
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
