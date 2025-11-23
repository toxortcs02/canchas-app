import React, { useState, useEffect } from "react";
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import './UsersUpdatePage.css';

const UsersUpdatePage = () => {
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Cargar usuario logueado al iniciar
  useEffect(() => {
    const fetchUser = async () => {
      const userId = authService.getCurrentUserId();
      if (!userId) {
        alert("No hay usuario logueado");
        setLoading(false);
        return;
      }
      try {
        const user = await authService.getCurrentUser(userId);
        setEditForm({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || ""
        });
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        alert("No se pudieron cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Validación de campos
  const validate = (field, value) => {
    let error = "";
    if (!value.trim()) {
      error = "Este campo es obligatorio";
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        error = "Formato de email inválido";
      }
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Habilitar botón si todo está bien
  useEffect(() => {
    const hasErrors = Object.values(errors).some(e => e !== "");
    const requiredFilled =
      editForm.first_name.trim() &&
      editForm.last_name.trim() &&
      editForm.email.trim();
    setIsValid(!hasErrors && requiredFilled);
  }, [errors, editForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitLoading(true);
    try {
      const userId = authService.getCurrentUserId();
      
      // Actualizar usuario con userService
      await userService.updateUser(userId, {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim()
      });

      // Actualizar nombre en localStorage
      const fullName = `${editForm.first_name} ${editForm.last_name}`;
      localStorage.setItem('name', fullName);

      alert("Usuario actualizado exitosamente");
      
      // Opcional: recargar la página para actualizar el header
      window.location.reload();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      const errorMsg = err.response?.data?.error || "Error al actualizar usuario. Verifica los datos e inténtalo nuevamente.";
      alert(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="users-update-page">
        <main className="main-content">
          <p>Cargando datos del usuario...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="users-update-page">
      <main className="main-content">
        <div className="user-edit-card">
          <h1>Editar mi usuario</h1>
          <p className="page-description">
            Actualiza tu información personal
          </p>
          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="first_name"
                value={editForm.first_name}
                onChange={handleChange}
                className={errors.first_name ? "input-error" : ""}
              />
              {errors.first_name && <span className="error">{errors.first_name}</span>}
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                name="last_name"
                value={editForm.last_name}
                onChange={handleChange}
                className={errors.last_name ? "input-error" : ""}
              />
              {errors.last_name && <span className="error">{errors.last_name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="modal-actions">
              <button 
                type="submit" 
                className="btn btn-confirm" 
                disabled={!isValid || submitLoading}
              >
                {submitLoading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UsersUpdatePage;