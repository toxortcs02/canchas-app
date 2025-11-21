import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// jQuery y Select2 ya están cargados desde CDN
// Solo verificamos que estén disponibles
console.log('jQuery disponible:', typeof window.$ !== 'undefined');
console.log('jQuery version:', window.$?.fn?.jquery);
console.log('Select2 disponible:', typeof window.$?.fn?.select2 !== 'undefined');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);