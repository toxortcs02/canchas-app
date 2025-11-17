import api from './api';

export const authService = {
  // Login - retorna token
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('name', response.data.full_name)
    }
    return response.data;
  },

  // Registro - endpoint: POST /user
  register: async (email, password, firstName, lastName) => {
    const response = await api.post('/user', {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    });
    return response.data;
  },

  // Logout - endpoint: POST /user/logout
  logout: async () => {
    try {
      await api.post('/user/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('name')      
    }
  },

  // Verificar si está logueado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener ID del usuario actual
  getCurrentUserId: () => {
    return localStorage.getItem('userId');
  },

  // Obtener usuario actual por ID
  getCurrentUser: async (userId) => {
    if (!userId) return null;
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  // Cambiar contraseña - endpoint: PATCH /user/{id}
  changePassword: async (userId, newPassword) => {
    const response = await api.patch(`/user/${userId}`, {
      password: newPassword
    });
    return response.data;
  }
};