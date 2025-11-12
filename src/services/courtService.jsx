import api from './api';

export const courtService = {
  // Crear cancha - POST /court (requiere admin)
  createCourt: async (name, description) => {
    const response = await api.post('/court', {
      name,
      description
    });
    return response.data;
  },

  // Obtener cancha por ID - GET /court/{id}
  getCourtById: async (id) => {
    const response = await api.get(`/court/${id}`);
    return response.data;
  },

  // Actualizar cancha - PUT /court/{id} (solo admin)
  updateCourt: async (id, name, description) => {
    const response = await api.put(`/court/${id}`, {
      name,
      description
    });
    return response.data;
  },

  // Eliminar cancha - DELETE /court/{id} (solo admin)
  deleteCourt: async (id) => {
    const response = await api.delete(`/court/${id}`);
    return response.data;
  },

  // Obtener todas las canchas - GET /courts
  getAllCourts: async () => {
    const response = await api.get('/courts');
    return response.data;
  }
  
};