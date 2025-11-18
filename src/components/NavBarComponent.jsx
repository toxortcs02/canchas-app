import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import "../assets/styles/NavBarComponent.css";

const NavBarComponent = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  const isAdmin = user && user.is_admin;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Botón hamburguesa para móvil */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
        </button>

        {/* Links de navegación */}
        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          {/* Rutas públicas */}
          <li className="navbar-item">
            <Link to="/" className={isActive("/")} onClick={closeMenu}>
               Inicio
            </Link>
          </li>

          <li className="navbar-item">
            <Link to="/courts" className={isActive("/courts")} onClick={closeMenu}>
               Canchas
            </Link>
          </li>
                    {/* Rutas solo para administradores */}
          {isAdmin && (
            <li className="navbar-item">
              <Link to="/users" className={isActive("/users")} onClick={closeMenu}>
                👥 Usuarios
              </Link>
            </li>
          )}
          {/* Rutas solo para usuarios logueados */}
          {user && (
            <>
              <li className="navbar-item">
                <Link to="/booking/new" className={isActive("/booking/new")} onClick={closeMenu}>
                   Nueva Reserva
                </Link>
              </li>
|             
              <li className="navbar-item">
                <Link to="/forgot-password" className={isActive("/forgot-password")} onClick={closeMenu}>
                   Cambiar Contraseña
                </Link>
              </li>
                            
              <li className="navbar-item">
                <Link to="/profile/edit" className={isActive("/profile/edit")} onClick={closeMenu}>
                  👤 Mi Perfil
                </Link>
              </li>


            </>
          )}


        </ul>
      </div>
    </nav>
  );
};

export default NavBarComponent;