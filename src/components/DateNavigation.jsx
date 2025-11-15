import React from 'react';
import '../assets/styles/DateNavigation.css';

const DateNavigation = ({ 
  selectedDate, 
  onDateChange, 
  onPreviousDay, 
  onNextDay, 
  onToday 
}) => {
  
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="date-navigation">
      <div className="date-display">
        <h2>{formatDisplayDate(selectedDate)} 📅</h2>
      </div>
      
      <div className="date-controls">
        <button onClick={onPreviousDay} className="nav-button">
          ← Día anterior
        </button>
        
        <button onClick={onToday} className="nav-button nav-button-today">
          Hoy
        </button>
        
        <button onClick={onNextDay} className="nav-button">
          Día siguiente →
        </button>
        
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateNavigation;