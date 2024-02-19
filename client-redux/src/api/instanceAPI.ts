import axios, { AxiosRequestConfig } from 'axios';

// 
const config: AxiosRequestConfig = {
    baseURL: 'http://localhost:3030/',
    headers: {},
};

export const instanceAPI = axios.create(config);
