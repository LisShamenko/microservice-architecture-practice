import axios, { AxiosRequestConfig } from 'axios';

// 
const config: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {},
};

export const instanceAPI = axios.create(config);
