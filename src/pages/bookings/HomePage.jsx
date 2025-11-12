import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateTimeSlots, formatDate, getToday } from '../../utils/helpers';
import './HomePage.css';

const HomePage = () => {
  const timeSlots = generateTimeSlots();
  
  // Estado para la fecha seleccionada (inicializada con la fecha de hoy)
  const [selectedDate, setSelectedDate] = useState(getToday());
  
  // Función para formatear fecha a objeto Date para mostrar
  const getDateObject = (dateString) => {
    return new Date(dateString + 'T00:00:00');
  };
  
  // Función para ir al día anterior
  const goToPreviousDay = () => { 
    const date = getDateObject(selectedDate);
    date.setDate(date.getDate() - 1);
    const newDate = formatDateForInput(date);
    setSelectedDate(newDate);
  };
  
  // Función para ir al día siguiente
  const goToNextDay = () => {
    const date = getDateObject(selectedDate);
    date.setDate(date.getDate() + 1);
    const newDate = formatDateForInput(date);
    setSelectedDate(newDate);
  };
  
  // Función para ir a hoy
  const goToToday = () => {
    setSelectedDate(getToday());
  };
  
  // Función para formatear fecha al formato YYYY-MM-DD para el input
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Datos de ejemplo para la estructura (tú implementarás la lógica)
  const courts = [
    { id: 1, name: 'Cancha 1' },
    { id: 2, name: 'Cancha 2' },
    { id: 3, name: 'Cancha 3' }
  ];

  return (
    <div className="home-page">
      <div className="bookings-header">
        <h1>
          Reservas del día - {formatDate(getDateObject(selectedDate))} 📅
        </h1>
        
        <div className="date-navigation">
          <button onClick={goToPreviousDay} className="nav-button">← Día anterior</button>
          <button onClick={goToToday} className="nav-button">Hoy</button>
          <button onClick={goToNextDay} className="nav-button">Día siguiente →</button>
          <input
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="create-booking-link">
          <Link to="/booking/new" className="btn-create-booking">
            Crear nueva reserva
          </Link>
        </div>
      </div>

      <div className="bookings-grid-container">
        <table className="bookings-grid">
          <thead>
            <tr>
              <th className="time-column">Hora</th>
              {courts.map(court => (
                <th key={court.id} className="court-column">
                  {court.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="time-cell">{timeSlot}</td>
                {courts.map(court => (
                  <td
                    key={`${timeSlot}-${court.id}`}
                    className="booking-cell"
                  >
                    {/* Aquí irán los participantes de las reservas */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
