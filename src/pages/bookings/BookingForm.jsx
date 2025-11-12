import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import './BookingForm.css';

const BookingForm = () => {
  return (
    <div className="booking-form-page">
      <HeaderComponent />
      <NavBarComponent />
      
      <main className="main-content">
        {/* Formulario de reserva */}
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default BookingForm;
