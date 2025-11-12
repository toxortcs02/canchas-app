// Formatear fecha para mostrar (DD/MM/YYYY)
export const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Formatear fecha para el backend (YYYY-MM-DD HH:MM:SS)
  export const formatDateTimeForAPI = (date, time) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${time}:00`;
  };
  
  // Obtener fecha de hoy (YYYY-MM-DD)
  export const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Generar horarios de 08:00 a 22:00 cada 30 min
  export const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      if (hour < 22) {
        slots.push(`${String(hour).padStart(2, '0')}:30`);
      }
    }
    return slots;
  };
  
  // Calcular bloques de 30 min
  export const calculateDurationBlocks = (durationMinutes) => {
    return Math.ceil(durationMinutes / 30);
  };
  
  // Verificar si el usuario es admin
  export const isAdmin = (user) => {
    return user && user.is_admin === true;
  };
  
  // Manejar errores de API
  export const handleAPIError = (error) => {
    if (error.response) {
      return error.response.data.message || 'Error en el servidor';
    } else if (error.request) {
      return 'No se pudo conectar con el servidor';
    } else {
      return 'Error al procesar la solicitud';
    }
  };