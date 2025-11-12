import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import './CourtPage.css';

const CourtPage = () => {
  return (
    <div className="court-page">
      <HeaderComponent />
      <NavBarComponent />
      
      <main className="main-content">
        {/* Listado de canchas */}
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default CourtPage;