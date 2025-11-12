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
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courts" element={<CourtPage />} />
            <Route path="/forgot-password" element={<ChangePasswordPage />} />
            
            {/* Rutas protegidas (requieren login) */}
            <Route path="/booking/new" element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            } />
            <Route path="/booking/edit/:id" element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <UsersUpdatePage />
              </ProtectedRoute>
            } />
            
            {/* Rutas de administrador */}
            <Route path="/users" element={
              <ProtectedRoute requireAdmin>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/users/edit/:id" element={
              <ProtectedRoute requireAdmin>
                <UsersUpdatePage />
              </ProtectedRoute>
            } />
            
            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;