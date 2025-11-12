import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <HeaderComponent />
      <NavBarComponent />
      
      <main className="main-content">
        {/* Formulario de registro */}
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default RegisterPage;