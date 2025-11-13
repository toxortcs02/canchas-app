import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateTimeSlots, formatDate, getToday } from '../../utils/helpers';
import './HomePage.css';
import { courtService } from '/src/services/courtService.jsx'; 

const HomePage = () => {
  const timeSlots = generateTimeSlots();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDateObject = (dateString) => new Date(dateString + 'T00:00:00');

  const goToPreviousDay = () => { 
    const date = getDateObject(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(formatDateForInput(date));
  };

  const goToNextDay = () => {
    const date = getDateObject(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(formatDateForInput(date));
  };

  const goToToday = () => setSelectedDate(getToday());

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await courtService.getAllCourts();
        setCourts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar canchas:', error);
        setCourts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  // 🆕 NUEVO useEffect para sincronizar los scrolls
  useEffect(() => {
    const top = document.querySelector('.scroll-top');
    const bottom = document.querySelector('.scroll-bottom');
    const middle = document.querySelector('#scrollContainer');

    if (!top || !bottom || !middle) return;

    const syncScroll = (source, targets) => {
      const handler = () => {
        targets.forEach(t => {
          if (t.scrollLeft !== source.scrollLeft) {
            t.scrollLeft = source.scrollLeft;
          }
        });
      };
      source.addEventListener('scroll', handler);
      return () => source.removeEventListener('scroll', handler);
    };

    const cleanTop = syncScroll(top, [middle, bottom]);
    const cleanMiddle = syncScroll(middle, [top, bottom]);
    const cleanBottom = syncScroll(bottom, [middle, top]);

    // cleanup: elimina solo los listeners
    return () => {
      cleanTop();
      cleanMiddle();
      cleanBottom();
    };
  }, []);

  if (loading) {
    return <div className="home-page"><p>Cargando canchas...</p></div>;
  }

  return (
    <div className="home-page">
      <div className="bookings-header">
        <h1>Reservas del día - {formatDate(getDateObject(selectedDate))} 📅</h1>
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

      {/* 🧩 Contenedor con scrolls sincronizados */}
      <div className="bookings-grid-wrapper">
        {/* Scroll superior: solo barra de scroll */}
        <div className="scroll-top" style={{ overflowX: 'auto', height: '20px' }}>
          <div style={{ minWidth: '100%' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}></th>
                  {courts.map(court => (
                    <th key={court.id} style={{ width: '150px' }}></th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="bookings-grid-container" id="scrollContainer" style={{ overflowX: 'auto' }}>
          <table className="bookings-grid" style={{ minWidth: '100%' }}>
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
                  {courts.map(court => (
                    <td key={`${timeSlot}-${court.id}`} className="booking-cell"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scroll inferior: solo barra de scroll */}
        <div className="scroll-bottom" style={{ overflowX: 'auto', height: '20px' }}>
          <div style={{ minWidth: '100%' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}></th>
                  {courts.map(court => (
                    <th key={court.id} style={{ width: '150px' }}></th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
