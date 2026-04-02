import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1"
});

const refreshApi = axios.create({
    baseURL: "http://localhost:8000/api/v1"
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(async (config) => {
    const result = await chrome.storage.local.get('accessToken');
    if (result.accessToken) {
        config.headers.Authorization = `${result.accessToken}`; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalReq = error.config;

    if (error.response && error.response.status === 401 && !originalReq._retry) {
        
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalReq.headers.Authorization = `${token}`;
                return api(originalReq);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        originalReq._retry = true;
        isRefreshing = true;

        try {
            const tokens = await chrome.storage.local.get('refreshToken');
            const response = await refreshApi.post('/users/refresh', {
                refreshToken: tokens.refreshToken
            }); 
            
            const newAccessToken = response.data.data.accessToken;
            
            await chrome.storage.local.set({
                'accessToken': newAccessToken,
                'refreshToken': response.data.data.refreshToken
            });
            
            originalReq.headers.Authorization = `${newAccessToken}`;

            processQueue(null, newAccessToken);
            
            return api(originalReq);
            
        } catch (refreshError) {
            processQueue(refreshError, null);
            await chrome.storage.local.remove(['accessToken', 'refreshToken']);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});

export default api;