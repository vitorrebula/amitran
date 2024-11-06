import axios from 'axios';
import { getToken, removeToken } from './auth';
import { url } from './url';
import { Dispatch, SetStateAction } from 'react';

const api = axios.create({
    baseURL: url,
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const setAuthHandler = (setIsAuthenticated?: Dispatch<SetStateAction<boolean>>) => {
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                removeToken();
                setIsAuthenticated && setIsAuthenticated(false);
                window.location.href = '/login'; 
            }
            return Promise.reject(error);
        }
    );
};

export { api, setAuthHandler };