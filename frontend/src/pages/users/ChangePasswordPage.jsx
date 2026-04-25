import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import SuccessPopup from "../../components/SuccessMessage.jsx";
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: ""
  });
  
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: ""
  });
  
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Requisitos de contraseña
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false
  });

  // Obtener info del usuario logueado
  useEffect(() => {
    const userId = authService.getCurrentUserId();
    if (!userId) return;

    authService.getCurrentUser(userId).then((data) => {
      setUser(data);
    });
  }, []);

  // Validar requisitos de contraseña en tiempo real
  useEffect(() => {
    const pwd = formData.newPassword;
    setPasswordRequirements({
      hasMinLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSymbol: /[^a-zA-Z0-9]/.test(pwd)
    });
  }, [formData.newPassword]);

  const validatePassword = (pwd) => {
    return (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^a-zA-Z0-9]/.test(pwd)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Limpiar mensajes globales
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Debes ingresar tu contraseña actual";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Debes ingresar una nueva contraseña";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "La contraseña no cumple los requisitos de seguridad";
    }

    if (!formData.repeatNewPassword.trim()) {
      newErrors.repeatNewPassword = "Debes repetir la nueva contraseña";
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      newErrors.repeatNewPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    if (!user) {
      setError("No se pudo obtener el usuario actual.");
      return;
    }

    setLoading(true);

    try {
      // 1. Verificar contraseña actual con login
      await authService.login(user.email, formData.currentPassword);

      // 2. Cambiar contraseña
      await authService.changePassword(user.id, formData.newPassword);

      // Mostrar popup de éxito
      setShowSuccess(true);
      
      // Limpiar formulario
      setFormData({
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: ""
      });
      setErrors({});
      
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      setError("La contraseña actual es incorrecta o hubo un error al actualizar.");
    } finally {
      setLoading(false);
    }
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

  return (
    <div className="forgot-password-page">
      <main className="main-content">
        <form className="forgot-password-form" onSubmit={handleSubmit} noValidate>
          <h2>Cambiar contraseña</h2>
          <p className="page-description">
            Actualiza tu contraseña para mantener tu cuenta segura
          </p>

          {error && <div className="error-msg">{error}</div>}

          {/* Contraseña actual */}
          <div className="form-group">
            <label htmlFor="currentPassword">Contraseña actual</label>
            <input
              id="currentPassword"
              type="password"
              name="currentPassword"
              placeholder="Ingresa tu contraseña actual"
              value={formData.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? "input-error" : ""}
            />
            {errors.currentPassword && (
              <span className="error">{errors.currentPassword}</span>
            )}
          </div>

          {/* Nueva contraseña */}
          <div className="form-group">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Ingresa tu nueva contraseña"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? "input-error" : ""}
            />
            {errors.newPassword && (
              <span className="error">{errors.newPassword}</span>
            )}
            
            {/* Requisitos de contraseña */}
            {formData.newPassword && (
              <div className="password-requirements">
                <strong>Tu contraseña debe contener:</strong>
                <ul>
                  <li className={passwordRequirements.hasMinLength ? "requirement-met" : "requirement-unmet"}>
                    {passwordRequirements.hasMinLength ? "✓" : "○"} Al menos 8 caracteres
                  </li>
                  <li className={passwordRequirements.hasUppercase ? "requirement-met" : "requirement-unmet"}>
                    {passwordRequirements.hasUppercase ? "✓" : "○"} Una letra mayúscula
                  </li>
                  <li className={passwordRequirements.hasLowercase ? "requirement-met" : "requirement-unmet"}>
                    {passwordRequirements.hasLowercase ? "✓" : "○"} Una letra minúscula
                  </li>
                  <li className={passwordRequirements.hasNumber ? "requirement-met" : "requirement-unmet"}>
                    {passwordRequirements.hasNumber ? "✓" : "○"} Un número
                  </li>
                  <li className={passwordRequirements.hasSymbol ? "requirement-met" : "requirement-unmet"}>
                    {passwordRequirements.hasSymbol ? "✓" : "○"} Un símbolo especial (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Repetir nueva contraseña */}
          <div className="form-group">
            <label htmlFor="repeatNewPassword">Repetir nueva contraseña</label>
            <input
              id="repeatNewPassword"
              type="password"
              name="repeatNewPassword"
              placeholder="Repite tu nueva contraseña"
              value={formData.repeatNewPassword}
              onChange={handleChange}
              className={errors.repeatNewPassword ? "input-error" : ""}
            />
            {errors.repeatNewPassword && (
              <span className="error">{errors.repeatNewPassword}</span>
            )}
            {formData.repeatNewPassword && formData.newPassword === formData.repeatNewPassword && (
              <span className="success-inline">✓ Las contraseñas coinciden</span>
            )}
          </div>

          <div className="modal-actions">
            <button 
              className="forgot-password-button" 
              type="submit"
              disabled={loading || !formData.currentPassword || !allRequirementsMet || formData.newPassword !== formData.repeatNewPassword}
            >
              {loading ? "Cambiando contraseña..." : "Cambiar contraseña"}
            </button>
          </div>
        </form>
      </main>

      {/* Popup de éxito */}
      {showSuccess && (
        <SuccessPopup
          message="¡Contraseña actualizada correctamente!"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default ChangePasswordPage;