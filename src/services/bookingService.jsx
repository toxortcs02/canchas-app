import api from './api';

export const bookingService = {
  // Obtener reservas del día - GET /booking (público)
  getBookingsToday: async () => {
    const response = await api.get('/booking');
    return response.data;
  },

getBookingsByDate: async (date) => {
  const response = await api.get(`/booking`, {
    params: { date }
  });

  return response.data;
},

  // Crear reserva - POST /booking
  createBooking: async (courtId, bookingDatetime, durationBlocks, participants) => {
    const response = await api.post('/booking', {
      court_id: courtId,
      booking_datetime: bookingDatetime,
      duration_blocks: durationBlocks,
      participants: participants // array de IDs
    });
    return response.data;
  },

  // Eliminar reserva - DELETE /booking/{id} (creador o admin)
  deleteBooking: async (id) => {
    const response = await api.delete(`/booking/${id}`);
    return response.data;
  },

  // Actualizar participantes - PUT /booking_participants/{id}
  updateParticipants: async (bookingId, participants) => {
    const response = await api.put(`/booking_participants/${bookingId}`, {
      participants: participants // array de IDs
    });
    return response.data;
  }
};