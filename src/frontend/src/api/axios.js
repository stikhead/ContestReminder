import axios from "axios";

const api = axios.create({
    "baseURL": "http://localhost:8000/api/v1"
})

const refreshApi = axios.create({
    "baseURL": "http://localhost:8000/api/v1"
})

api.interceptors.request.use(async (config) => {
    const result = await chrome.storage.local.get('accessToken');
    if (result.accessToken) {
        config.headers.Authorization = `Bearer ${result.accessToken}`;
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
        try {
            originalReq._retry = true;
            const tokens = await chrome.storage.local.get('refreshToken');
            const response = await refreshApi.post('/users/refreshUser', {
                refreshToken: tokens.refreshToken
            }); await chrome.storage.local.set({
                accessToken: response.data.accessToken
            })
            originalReq.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalReq);
        } catch (error) {
            await chrome.storage.local.remove(['accessToken', 'refreshToken']);
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
})

export default api;