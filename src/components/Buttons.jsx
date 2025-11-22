// Buttons.jsx
import React from "react";
import '../assets/styles/Buttons.css';

export const EditButton = ({ onClick, label = "Editar", disabled = false }) => (
  <button
    className="btn btn-edit"
    onClick={onClick}
    disabled={disabled}
    title={label}
  >
    {label}
  </button>
);

export const DeleteButton = ({ onClick, label = "Borrar", disabled = false,title  }) => (
  <button
    className="btn btn-delete"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    {label}
  </button>
);

export const ViewButton = ({ onClick, label = "Ver", disabled = false }) => (
  <button
    className="btn btn-view"
    onClick={onClick}
    disabled={disabled}
    title={label}
  >
    {label}
  </button>
);
