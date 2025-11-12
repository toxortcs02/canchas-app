import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import './UsersUpdatePage.css';

const UsersUpdatePage = () => {
  return (
    <div className="users-update-page">
      <HeaderComponent />
      <NavBarComponent />
      
      <main className="main-content">
        {/* Formulario de modificación de usuario */}
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default UsersUpdatePage;
