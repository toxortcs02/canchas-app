import React from "react";
import "../assets/styles/SuccessMessage.css";

const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-success" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon">✓</div>
        <h2>{message}</h2>
        {onClose && (
          <button 
            className="popup-close-btn"
            onClick={onClose}
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;