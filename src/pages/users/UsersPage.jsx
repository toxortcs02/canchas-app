import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './UsersPage.css';
import { EditButton, DeleteButton, ViewButton } from '../../components/Buttons';
import EditUserModal from '../../components/UserEditModal.jsx';

const UsersPage = () => {

  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  // modal edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // modal eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // user details show/hide
  const [selectedUserId, setSelectedUserId] = useState(null);

  // formulario de edición
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
        console.log('usuarios cargados:', data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); 

  const onEdit = (user) => {
    setUserToEdit(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
    setShowEditModal(true);
  };
    const handleCancelEdit = () => {
    setShowEditModal(false);
    setUserToEdit(null);
  };

  // confirmar edición
const handleConfirmEdit = async () => {
  if (!userToEdit) return;

  const { first_name, last_name, email, password } = editForm;

  // 1. Validar campos obligatorios
  if (!first_name?.trim() || !last_name?.trim() || !email?.trim()) {
    alert("Nombre, Apellido y Email son obligatorios.");
    return;
  }

  // 2. Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    alert("El email no tiene un formato válido.");
    return;
  }

  // 3. Validar password si se proporcionó
  if (password) {
    const pass = password.trim();
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passRegex.test(pass)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }
  }

  setEditLoading(true);

  try {
    // Solo enviar campos válidos
    const dataToSend = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim(),
    };

    if (password) {
      dataToSend.password = password.trim();
    }

    // Llamada al servicio
    const updatedUser = await userService.updateUser(userToEdit.id, dataToSend);

    // Actualizar lista de usuarios
    setUsers((prev) =>
      prev.map((u) => (u.id === userToEdit.id ? { ...u, ...dataToSend } : u))
    );

    // Cerrar modal y limpiar estado
    setShowEditModal(false);
    setUserToEdit(null);
  } catch (error) {
    console.error("Error al editar usuario:", error);
    alert("Error al editar usuario. Verifica los datos e inténtalo nuevamente.");
  } finally {
    setEditLoading(false);
  }
};



  // abre modal de confirmación
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // borra realmente al confirmar
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    try {
      await userService.deleteUser(userToDelete.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al borrar usuario:', error);
      alert('Error al borrar usuario.');
    } finally {
      setDeleteLoading(false);
    }
  };



  // Mostrar detalles solo del usuario seleccionado
  const onView = (user) => {
    console.log('Ver usuario:', user);
    setSelectedUserId(selectedUserId === user.id ? null : user.id);
  }

  // Función para hacer mayuscula la primera letra
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  
  if (loading) {
    return (
      <div className="users-page">
        <main className="main-content">
          <p>Cargando usuarios...</p>
        </main>
      </div>
    );
  }

 return (
    <div className="users-page">
      <main className="main-content">
        <div className="users-list">
          <h1>Listado de Usuarios</h1>

          <div className="users-grid">
            {users.map(user => (
              <div key={user.id} className="users-card">
                
                <div className="user-info-row">
                  <span className="info-label"><strong>Nombre:</strong></span>
                  <span className="info-value">{capitalize(user.first_name)}</span>
                </div>

                <div className="user-info-row">
                  <span className="info-label"><strong>Apellido:</strong></span>
                  <span className="info-value">{capitalize(user.last_name)}</span>
                </div>

                {selectedUserId === user.id && (
                  <div className="user-details">
                    <div className="detail-row">
                      <span className="detail-label"><strong>Email:</strong></span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label"><strong>ID:</strong></span>
                      <span className="detail-value">{user.id}</span>
                    </div>
                  </div>
                )}

                <div className="action-buttons">
                  <EditButton  onClick={() => onEdit(user)} />
                  <DeleteButton onClick={() => confirmDelete(user)} />
                  <ViewButton onClick={() => onView(user)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL EDITAR */}
      {showEditModal && (
        <EditUserModal
          user={userToEdit}
          editForm={editForm}
          setEditForm={setEditForm}
          onCancel={handleCancelEdit}
          onConfirm={handleConfirmEdit}
          loading={editLoading}
        />
      )}

      {/* MODAL ELIMINAR */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar borrado</h3>
            <p>
              ¿Eliminar usuario{" "}
              <strong>
                {userToDelete.first_name} {userToDelete.last_name}
              </strong>?
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

    </div>
  );
};

export default UsersPage;