import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL as string;
const base = axios.create({
  baseURL: BASE_URL,
});

export default base;
