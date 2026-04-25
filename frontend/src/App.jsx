import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes base
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import NavBarComponent from './components/NavBarComponent';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/bookings/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import CourtPage from './pages/courts/CourtPage';
import BookingForm from './pages/bookings/BookingForm';
import UsersPage from './pages/users/UsersPage';
import UsersUpdatePage from './pages/users/UsersUpdatePage';
import ChangePasswordPage from './pages/users/ChangePasswordPage';

import './assets/styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <HeaderComponent />
        <NavBarComponent />
        
        <main className="main-content">
          <Routes>
            {/* ========================================
                RUTAS PÚBLICAS (sin protección)
                ======================================== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courts" element={<CourtPage />} />

            {/* ========================================
                RUTAS PROTEGIDAS (requieren login)
                ======================================== */}

            {/* Cambiar contraseña - PROTEGIDA */}
            <Route 
              path="/forgot-password" 
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              } 
            />

            {/* Crear reserva - PROTEGIDA */}
            <Route 
              path="/booking/new" 
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } 
            />

            {/* Editar reserva - PROTEGIDA */}
            <Route 
              path="/booking/edit/:id" 
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } 
            />

            {/* Editar perfil propio - PROTEGIDA */}
            <Route 
              path="/profile/edit" 
              element={
                <ProtectedRoute>
                  <UsersUpdatePage />
                </ProtectedRoute>
              } 
            />
            
            {/* ========================================
                RUTAS DE ADMINISTRADOR
                ======================================== */}
            
            {/* Listar usuarios - ADMIN */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <UsersPage />
                </ProtectedRoute>
              } 
            />

            {/* Editar usuario (admin) - ADMIN */}
            <Route 
              path="/users/edit/:id" 
              element={
                <ProtectedRoute requireAdmin>
                  <UsersUpdatePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta 404: redirigir al login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;