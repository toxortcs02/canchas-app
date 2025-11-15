import React from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import NavBarComponent from '../../components/NavBarComponent';
import { courtService } from '/src/services/courtService.jsx'; 
import { useState, useEffect } from 'react';
import './CourtPage.css';


//Listado de canchas: ○ Crear un archivo dentro de la carpeta pages/courts llamado CourtPage.js.  
// ○ Dicha página debe contener un listado de las canchas con: nombre y descripción. 
// ○ Si el usuario está logueado y es administrador podrá actualizar el nombre o la descripción. 
// ○ Si el usuario está logueado, es administrador y la cancha no tiene reservas podrá borrarla. 

const CourtPage = () => {

  const [courts, setCourts] = useState([]);



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
  return (
    <div className="court-page">
      
      <main className="main-content">
        <div className="court-list">
          <h2>Listado de Canchas</h2>
          {
            courts.map(court => (
              <div key={court.id} className="court-item">
                <h2>{court.name}</h2>
                <p>{court.description}</p>
              </div>
            )
          )}
        </div>
      </main>
      

    </div>
  );
};

export default CourtPage;