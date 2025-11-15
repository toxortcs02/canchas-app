import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '/src/services/authService.jsx';
import { validators } from  '/src/utils/validator.js';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    const emailError = validators.validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Validar contraseña
    const passwordError = validators.validateRequired(formData.password, 'La contraseña');
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Llamar al servicio de login
      await authService.login(formData.email, formData.password);
      
      // Redirigir al home después de login exitoso
      navigate('/');
      window.location.reload(); // Para actualizar el header/navbar
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.response?.status === 401) {
        setGeneralError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
      } else if (error.response?.status === 404) {
        setGeneralError('Usuario no encontrado.');
      } else {
        setGeneralError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta para gestionar tus reservas</p>
        </div>

        {generalError && (
          <div className="alert alert-error">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Tu contraseña"
              disabled={loading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;