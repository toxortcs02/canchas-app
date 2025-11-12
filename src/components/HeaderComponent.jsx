import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import "../assets/styles/HeaderComponent.css";
import logo from "../assets/img/logo.png";
const HeaderComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userId = authService.getCurrentUserId();
          if (userId) {
            const userData = await userService.getUserById(userId);
            setUser(userData);
          }
        } catch (error) {
          console.error("Error al obtener usuario:", error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <header className="header">
        <div className="header-content">
          <div className="header-content-left">
            <Link to="/">
                <img src={logo} alt="Logo" className="header-logo" />
            </Link>
          </div>
          <div className="header-content-right">
            <span>Cargando...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-content-left">
          <Link to="/" className="header-logo-link">
            <img 
              src={logo} 
              alt="Tenis - Reservas de Canchas" 
              className="header-logo" 
            />
            <h1 className="header-title">Tenis</h1>
          </Link>
        </div>
        
        <div className="header-content-right">
          {user ? (
            // Usuario logueado
            <div className="header-user-section">
              <span className="header-username">
                Hola, {user.first_name} {user.last_name}
              </span>
              <button 
                onClick={handleLogout} 
                className="header-btn header-btn-logout"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            // Usuario no logueado
            <div className="header-guest-section">
              <Link to="/login" className="header-btn header-btn-login">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;