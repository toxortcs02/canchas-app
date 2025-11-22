import React, { useEffect, useState } from "react";
import { courtService } from "/src/services/courtService.jsx";
import { authService } from "/src/services/authService.jsx";
import { userService } from "/src/services/userService.jsx";
import { EditButton, DeleteButton } from '../../components/Buttons';
import EditCourtModal from '../../components/CourtEditModal.jsx';
import CreateCourtModal from '../../components/CourtCreateModal.jsx';
import "./CourtPage.css";

const CourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [user, setUser] = useState(null);
  const [activeBookings, setActiveBookings] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courtToDelete, setCourtToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [courtToEdit, setCourtToEdit] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [newCourtForm, setNewCourtForm] = useState({
      name: "",
      description: ""
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");

      const [editForm, setEditForm] = useState({
        name: "",
        description: ""
      });

  // 🧩 Traer listado de canchas
  const fetchCourts = async () => {
    try {
      const data = await courtService.getAllCourts();
      setCourts(data);
      data.forEach(court => checkActiveBookings(court.id));
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


  const checkActiveBookings = async (courtId) => {
  try {
    const bookings = await courtService.getCourtBookings(courtId);
    const now = new Date();

    const hasFutureBookings = bookings.some(b => new Date(b.booking_datetime) > now);

    setActiveBookings(prev => ({ ...prev, [courtId]: hasFutureBookings }));
  } catch (error) {
    console.error('Error al verificar reservas', error);
    setActiveBookings(prev => ({ ...prev, [courtId]: false }));
  }
};
  useEffect(() => {
    fetchCourts();
    fetchUser();
  }, []);


  //eliminar cancha
  const confirmDelete = (court) => {
  setCourtToDelete(court);
  setShowDeleteModal(true);
  };
  const handleCancelDelete = () => {
  setShowDeleteModal(false);
  setCourtToDelete(null);
  };
  const handleConfirmDelete = async (court) => {
    if (!courtToDelete) return;

    setDeleteLoading(true);
    try {
      await courtService.deleteCourt(courtToDelete.id);
      setCourts(prev => prev.filter(c => c.id !== courtToDelete.id));
      setShowDeleteModal(false);
      setCourtToDelete(null);
    } catch (error) {
      // Si el backend devuelve mensaje, mostrarlo
      const msg = error?.response?.data?.message || 'Error al borrar cancha';
      alert(msg);
    } finally {
      setDeleteLoading(false);
    }
  };


  //editar cancha

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
    const dataToSend = {
      name: name.trim(),
      description: description.trim()
    };
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



  // Abrir modal
const openCreateModal = () => {
  setNewCourtForm({ name: "", description: "" });
  setCreateError("");
  setShowCreateModal(true);
};

// Cerrar modal
const closeCreateModal = () => {
  setShowCreateModal(false);
};

// Confirmar creación
const handleCreateCourt = async () => {
  try {
    setCreateLoading(true);
    setCreateError("");

    const response = await courtService.createCourt(newCourtForm.name, newCourtForm.description);

    // Si el backend devolvió error
    if (response.error) {
      setCreateError(response.error);
      alert(response.error);
      setCreateLoading(false);
      return;
    }

    // Recargar listado de canchas
    await fetchCourts();

    setShowCreateModal(false);
  } catch (error) {
    const msg = error?.response?.data?.error || 'Error al crear cancha';
      alert(msg);
    setCreateError("Ocurrió un error al crear la cancha");
  } finally {
    setCreateLoading(false);
  }
};

  return (
    <div className="court-page">
      <div className="main-content">
        <div className="court-list">
          <h1>Listado de Canchas</h1>

          {isAdmin && (
            <div className="admin-actions">
              <button className="btn btn-primary" onClick={openCreateModal}>
                Crear cancha
              </button>

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

          {showCreateModal && (
            <CreateCourtModal
              editForm={newCourtForm}
              setEditForm={setNewCourtForm}
              onCancel={closeCreateModal}
              onConfirm={handleCreateCourt}
              loading={createLoading}
            />
          )}


          {showDeleteModal && courtToDelete && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Confirmar borrado</h3>
                  <p>
                    ¿Eliminar cancha{" "}
                    <strong>{courtToDelete.name}</strong>?
                  </p>

                  <div className="modal-actions">
                    <button className="btn btn-cancel" onClick={handleCancelDelete}>
                      Cancelar
                    </button>

                    <button
                      className="btn btn-delete"
                      onClick={handleConfirmDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          <div className="court-grid">
            {courts.map((court) => (
              <div key={court.id} className="court-card">
                <h2 className="court-name">{court.name}</h2>
                  <p
                    className={
                      court.description
                        ? "court-description with-description"
                        : "court-description no-description"
                    }
                  >
                    {court.description ? court.description : "Sin descripción"}
                  </p>

                {isAdmin && (
                  <div className="actions">
                      <EditButton  onClick={() => onEdit(court)} />
                      <DeleteButton onClick={() => confirmDelete(court)} 
                         disabled={activeBookings[court.id]} 
                          title={activeBookings[court.id] ? "Hay reservas activas para esta cancha" : ""}
                          />
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
