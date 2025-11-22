import React, { useEffect, useState } from "react";
import { courtService } from "/src/services/courtService.jsx";
import { authService } from "/src/services/authService";
import { userService } from "/src/services/userService";
import { EditButton, DeleteButton } from '../../components/Buttons';
import EditCourtModal from '../../components/CourtEditModal.jsx';
import "./CourtPage.css";

const CourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [user, setUser] = useState(null);



    const [showEditModal, setShowEditModal] = useState(false);
    const [courtToEdit, setCourtToEdit] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

      const [editForm, setEditForm] = useState({
        name: "",
        description: ""
      });

  // 🧩 Traer listado de canchas
  const fetchCourts = async () => {
    try {
      const data = await courtService.getAllCourts();
      setCourts(data);
    } catch (error) {
      console.error("Error al obtener canchas", error);
    }
  };

   const fetchUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userId = authService.getCurrentUserId();
        if (userId) {
          const userData = await userService.getUserById(userId);
          setUser(userData);
        }
      } catch (err) {
        console.error("Error al obtener usuario", err);
      }
    }
  };

  useEffect(() => {
    fetchCourts();
    fetchUser();
  }, []);


  const onEdit = (court) => {
    setCourtToEdit(court);
    setEditForm({
      name: court.name,
      description: court.description
    });
    setShowEditModal(true);
  };
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setCourtToEdit(null);
  };


//confirmar editar
const handleConfirmEdit = async () => {
  if (!courtToEdit) return;

  const { name, description } = editForm;

  // 1. Validar campos obligatorios
  if (!name?.trim() ) {
    alert("El nombre es obligatorio.");
    return;
  }

  setEditLoading(true);

  try {

    


    // Llamada al servicio
    const updateCourt = await courtService.updateCourt(courtToEdit.id, name,description);

    // Actualizar lista de usuarios
    setCourts((prev) =>
      prev.map((c) => (c.id === courtToEdit.id ? { ...c, ...dataToSend } : c))
    );

    // Cerrar modal y limpiar estado
    setShowEditModal(false);
    setCourtToEdit(null);
  } catch (error) {
    console.error("Error al editar cancha:", error);
    alert("Error al editar cancha. Verifica los datos e inténtalo nuevamente.");
  } finally {
    setEditLoading(false);
  }
}; 





  const isAdmin = user && user.is_admin;

  return (
    <div className="court-page">
      <div className="main-content">
        <div className="court-list">
          <h1>Listado de Canchas</h1>

          {isAdmin && (
            <div className="admin-actions">
              <button className="btn-create">+ Crear Nueva Cancha</button>
            </div>
          )}

          {/* MODAL EDITAR */}
          {showEditModal && (
            <EditCourtModal
              court={courtToEdit}
              editForm={editForm}
              setEditForm={setEditForm}
              onCancel={handleCancelEdit}
              onConfirm={handleConfirmEdit}
              loading={editLoading}
            />
          )}

          <div className="court-grid">
            {courts.map((court) => (
              <div key={court.id} className="court-card">
                <h2 className="court-name">{court.name}</h2>
                <p className="court-description">{court.description}</p>

                {isAdmin && (
                  <div className="actions">
                      <EditButton  onClick={() => onEdit(court)} />
                      <DeleteButton onClick={() => confirmDelete(court)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtPage;
