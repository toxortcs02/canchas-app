import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
  return (
    <div className="forgot-password-page">
      <HeaderComponent />
      <NavBarComponent />
      
      <main className="main-content">
        {/* Formulario de cambio de clave */}
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default ChangePasswordPage;
