import api from './api';

export const userService = {
  // Buscar usuarios por nombre o email - GET /users?query=
  searchUsers: async (query = '') => {
    const response = await api.get('/users', {
      params: { query }
    });
    return response.data;
  },

  // Obtener todos los usuarios (sin query)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obtener usuario por ID - GET /user/{id}
  getUserById: async (id) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Actualizar usuario - PATCH /user/{id}
  updateUser: async (id, userData) => {
    // Convertir campos al formato de la API
    const data = {
      email: userData.email,
      first_name: userData.firstName || userData.first_name,
      last_name: userData.lastName || userData.last_name,
    };
    
    // Solo incluir password si se proporciona
    if (userData.password) {
      data.password = userData.password;
    }

    const response = await api.patch(`/user/${id}`, data);
    return response.data;
  },

  // Eliminar usuario - DELETE /user/{id}
  deleteUser: async (id) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  }
};