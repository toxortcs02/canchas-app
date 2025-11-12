import React from "react";
import "../assets/styles/FooterComponent.css";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  
  // Reemplaza con los nombres de tu grupo
  const groupMembers = [
    "Nombre Apellido 1",
    "Nombre Apellido 2", 
    "Nombre Apellido 3"
  ];

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