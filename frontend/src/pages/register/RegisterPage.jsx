import React, { useState } from "react";
import "./RegisterPage.css";
import SuccessPopup from "../../components/SuccessMessage.jsx";
import FailedPopup from "../../components/FailedMessage.jsx";
import { authService } from "../../services/authService";

const RegisterPage = () => {

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ------------------------------
  // VALIDACIÓN
  // ------------------------------
  const validate = () => {
    let newErrors = {};

    // EMAIL
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "El email debe contener @";
    } else {
      // Regex simple de email (más estricto que solo "@")
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(formData.email.trim())) {
        newErrors.email = "Formato de email inválido";
      }
    }

    // NOMBRE
    if (!formData.first_name.trim()) {
      newErrors.first_name = "El nombre es obligatorio";
    }

    // APELLIDO
    if (!formData.last_name.trim()) {
      newErrors.last_name = "El apellido es obligatorio";
    }

    // PASSWORD
    if (!formData.password.trim()) {
      newErrors.password = "La clave es obligatoria";
    } else {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


      if (!passRegex.test(formData.password)) {
        newErrors.password =
          "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // SUBMIT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await authService.register(
        formData.email,formData.password,
        formData.first_name,
        formData.last_name
        
      );

      setSuccess(true);

      // Reset form
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
      });

    } catch (err) {
      console.error("Error registrando usuario:", err);

      // Error de backend
      setErrorMessage(
        err.response?.data?.error || "Error desconocido al registrar usuario"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="register-page">
      <main className="register-container">
        <div className="register-header">
          <span className="register-icon">📝</span>
          <h1>Registro de Usuario</h1>
          <p>Completa los datos para crear una cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? "input-error" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@mail.com"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* NOMBRE */}
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="first_name"
              className={`form-input ${errors.first_name ? "input-error" : ""}`}
              value={formData.first_name}
              onChange={handleChange}
            />
            {errors.first_name && (
              <span className="error-message">{errors.first_name}</span>
            )}
          </div>

          {/* APELLIDO */}
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="last_name"
              className={`form-input ${errors.last_name ? "input-error" : ""}`}
              value={formData.last_name}
              onChange={handleChange}
            />
            {errors.last_name && (
              <span className="error-message">{errors.last_name}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Clave</label>
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? "input-error" : ""}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>
      </main>

      {errorMessage && (
        <FailedPopup message={errorMessage} onClose={() => setErrorMessage("")} />
      )}

      {success && (
        <SuccessPopup
          message="Usuario registrado con éxito"
          onClose={() => setSuccess(false)}
        />
      )}
    </div>
  );
};

export default RegisterPage;
