import React, { useState, useEffect } from "react";
import "../assets/styles/UserEditModal.css";


const UserEditModal = ({ user, editForm, setEditForm, onCancel, onConfirm, loading }) => {
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isValid, setIsValid] = useState(false);

  // Función para validar inputs
  const validate = (field, value) => {
    let error = "";

    if (!value.trim() && field !== "password") {
      error = "Este campo es obligatorio";
    }

    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        error = "Formato de email inválido";
      }
    }

    if (field === "password" && value) {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passRegex.test(value.trim())) {
        error =
          "Debe tener 8 caracteres, mayúscula, minúscula, número y carácter especial";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Validar todo el form para habilitar/deshabilitar botón
  useEffect(() => {
    const hasErrors = Object.values(errors).some((e) => e !== "");
    const requiredFilled =
      editForm.first_name.trim() &&
      editForm.last_name.trim() &&
      editForm.email.trim();
    setIsValid(!hasErrors && requiredFilled);
  }, [errors, editForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Editar Usuario</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="first_name"
              value={editForm.first_name}
              onChange={handleChange}
            />
            {errors.first_name && <span className="error">{errors.first_name}</span>}
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input
              type="text"
              name="last_name"
              value={editForm.last_name}
              onChange={handleChange}
            />
            {errors.last_name && <span className="error">{errors.last_name}</span>}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password (opcional):</label>
            <input
              type="password"
              name="password"
              value={editForm.password || ""}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-confirm" disabled={!isValid || loading}>
              {loading ? "Editando..." : "Editar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;