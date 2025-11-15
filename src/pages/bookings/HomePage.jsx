import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateTimeSlots } from '../../utils/helpers';
import DateNavigation from '../../components/DateNavigation.jsx';
import './HomePage.css';
import { courtService } from '/src/services/courtService.jsx'; 
import { bookingService } from '/src/services/bookingService';

const HomePage = () => {
  const timeSlots = generateTimeSlots();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formatear Date a string YYYY-MM-DD
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handlers para DateNavigation
  const handlePreviousDay = () => { 
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    setSelectedDate(formatDateForInput(date));
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    setSelectedDate(formatDateForInput(date));
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(formatDateForInput(today));
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Cargar canchas una sola vez
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await courtService.getAllCourts();
        setCourts(Array.isArray(data) ? data : []);
        console.log('Canchas cargadas:', data);
      } catch (error) {
        console.error('Error al cargar canchas:', error);
        setCourts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  // Cargar reservas cada vez que cambie la fecha
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('Cargando reservas para:', selectedDate);
        const data = await bookingService.getBookingsByDate(selectedDate);
        setBookings(Array.isArray(data) ? data : []);
        console.log('Reservas cargadas:', data);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
        setBookings([]);
      }
    };

    if (selectedDate) {
      fetchBookings();
    }
  }, [selectedDate]);

  // Verificar si una celda tiene reserva
  const getBookingForCell = (timeSlot, courtId) => {
    return bookings.find(booking => {
      const bookingTime = new Date(booking.booking_datetime);
      const bookingHour = bookingTime.toTimeString().substring(0, 5);
      
      // Verificar si esta celda es el inicio de la reserva
      if (bookingHour === timeSlot && booking.court_id === courtId) {
        return true;
      }
      
      return false;
    });
  };

  // Verificar si una celda está ocupada por una reserva que empezó antes
  const isCellOccupied = (timeSlot, courtId) => {
    return bookings.some(booking => {
      const bookingStart = new Date(booking.booking_datetime);
      const bookingStartTime = bookingStart.toTimeString().substring(0, 5);
      
      // Calcular tiempo de fin
      const bookingEnd = new Date(bookingStart.getTime() + (booking.duration_blocks * 30 * 60 * 1000));
      const cellTime = new Date(selectedDate + 'T' + timeSlot + ':00');
      
      return booking.court_id === courtId && 
             cellTime > bookingStart && 
             cellTime < bookingEnd;
    });
  };

  // Renderizar celda de reserva
  const renderCell = (timeSlot, court) => {
    const booking = getBookingForCell(timeSlot, court.id);
    
    if (booking) {
      // Esta es la celda de inicio de la reserva
      const participants = booking.participants || [];
      
      return (
        <td 
          key={`${timeSlot}-${court.id}`} 
          className="booking-cell occupied clickable"
          rowSpan={booking.duration_blocks}
        >
          <div className="booking-content">
            <div className="booking-creator">
              <strong>{booking.first_name} {booking.last_name}</strong>
            </div>
            {participants.length > 0 && (
              <div className="booking-participants">
                {participants.map((p, idx) => (
                  <div key={idx} className="participant-name">
                    {p.first_name} {p.last_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </td>
      );
    } else if (isCellOccupied(timeSlot, court.id)) {
      // Esta celda está ocupada por una reserva anterior (no renderizar)
      return null;
    } else {
      // Celda vacía
      return (
        <td 
          key={`${timeSlot}-${court.id}`} 
          className="booking-cell empty"
        >
        </td>
      );
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <p>Cargando canchas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="bookings-header">
        <h1>Reservas de Canchas 🎾</h1>
        
        <DateNavigation
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
        />

        <div className="create-booking-link">
          <Link to="/booking/new" className="btn-create-booking">
            + Crear nueva reserva
          </Link>
        </div>
      </div>

      <div className="bookings-grid-container">
        <table className="bookings-grid">
          <thead>
            <tr>
              <th className="time-column">Hora</th>
              {courts.map(court => (
                <th key={court.id} className="court-column">{court.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="time-cell">{timeSlot}</td>
                {courts.map(court => renderCell(timeSlot, court))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;