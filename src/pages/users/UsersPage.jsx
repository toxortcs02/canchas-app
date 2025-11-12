import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import './UsersPage.css';

const UsersPage = () => {
  return (
    <div className="users-page">
      <HeaderComponent />
      <NavBarComponent />
      
      <main className="main-content">
        {/* Listado de usuarios (solo admin) */}
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default UsersPage;
