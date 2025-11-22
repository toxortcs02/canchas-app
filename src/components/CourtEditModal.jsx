import React, { useState, useEffect } from "react";
import "../assets/styles/UserEditModal.css"; // si tenés un CourtEditModal.css, cambiá esto

const CourtEditModal = ({ court, editForm, setEditForm, onCancel, onConfirm, loading }) => {
  const [errors, setErrors] = useState({
    name: "",
    description: ""
  });

  const [isValid, setIsValid] = useState(false);

  // Validaciones básicas para cada campo
  const validate = (field, value) => {
    let error = "";

    if (!value.trim()) {
      error = "Este campo es obligatorio";
    }


    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Habilitar botón si todo está ok
  useEffect(() => {
    const hasErrors = Object.values(errors).some((e) => e !== "");
    const requiredFilled =
      editForm.name.trim() && editForm.description.trim();

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
        <h3>Editar Cancha</h3>

        <form onSubmit={handleSubmit} noValidate>

          {/* Nombre */}
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleChange}
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>



          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-confirm"
              disabled={!isValid || loading}
            >
              {loading ? "Guardando..." : "Editar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CourtEditModal;
