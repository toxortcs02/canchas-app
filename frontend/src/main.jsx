import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// jQuery y Select2 ya están cargados desde CDN
// Solo verificamos que estén disponibles


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);