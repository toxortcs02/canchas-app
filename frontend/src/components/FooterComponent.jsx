import React from "react";
import "../assets/styles/FooterComponent.css";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  


  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-members">
          <p className="footer-title">Grupo 5</p>
          <ul className="footer-list">
            Tomas Sabella
          </ul>
        </div>
        
        <div className="footer-year">
          <p> {currentYear} - Seminario de Lenguajes</p>
          <p className="footer-subtitle">Opción: PHP, React y API Rest</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;