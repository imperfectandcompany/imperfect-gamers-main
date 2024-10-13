// apiClient.ts

import axios from 'axios';

const apiBase = 'https://api.imperfectgamers.org';

const apiClient = axios.create({
  baseURL: apiBase,
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or use a global state
    if (token) {
      config.headers['authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
