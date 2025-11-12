import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si requiere admin, verificar permisos
  if (requireAdmin) {
    // Aquí podrías verificar si el usuario es admin
    // Por ahora, solo verificamos autenticación
    // TODO: Implementar verificación de admin
  }
  
  return children;
};

export default ProtectedRoute;

