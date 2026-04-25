import React from "react";
import "../assets/styles/FailedMessage.css";

const FailedMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-failed" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon error">✖</div>
        <h2>{message}</h2>
        {onClose && (
          <button
            className="btn-failed"
            onClick={onClose}
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default FailedMessage;
