import React, { useState, useEffect } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import { courtService } from '/src/services/courtService.jsx';
import './CourtPage.css';

const CourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await courtService.getAllCourts();
        setCourts(Array.isArray(data) ? data : []);
        console.log('Canchas cargadas:', data);
      } catch (error) {
        console.error('Error al cargar canchas:', error);
        setCourts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  if (loading) {
    return (
      <div className="court-page">

        <main className="main-content">
          <p>Cargando canchas...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="court-page">

      <main className="main-content">
        <div className="court-list">
          <h1>Listado de Canchas</h1>
          <div className="court-grid">
            {courts.map(court => (
              <div key={court.id} className="court-card">
                <h2 className="court-name">{court.name}</h2>
                <p className="court-description">{court.description}</p>
                {/* Aquí podrías agregar botones de editar/borrar si es admin */}
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};

export default CourtPage;
