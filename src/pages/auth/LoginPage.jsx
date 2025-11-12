import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <HeaderComponent />
      <NavBarComponent />
      
      <main className="main-content">
        {/* Formulario de login */}
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default LoginPage;
