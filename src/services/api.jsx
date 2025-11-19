import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
api.interceptors.response.use(
  (response) => {
    // Si el backend envía un nuevo token en el header
    const newToken = response.headers['authorization'];
    
    if (newToken && newToken.startsWith('Bearer ')) {
      const tokenValue = newToken.split(' ')[1];
      localStorage.setItem('token', tokenValue); // actualiza el token guardado
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      //window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default api;