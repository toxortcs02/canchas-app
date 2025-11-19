import React from "react";
import "../assets/styles/SuccessMessage.css";

const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="success-message-container">
      <div className="success-message-box">
        <span className="success-icon">✔</span>
        <p className="success-text">{message}</p>

        {onClose && (
          <button className="success-close-btn" onClick={onClose}>
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
