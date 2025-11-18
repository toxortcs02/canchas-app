import React from 'react';
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './UsersPage.css';
import { EditButton, DeleteButton, ViewButton } from '../../components/Buttons';

const UsersPage = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Cambiar a selectedUserId en lugar de showUserDetails
  const [selectedUserId, setSelectedUserId] = useState(null);

  // nuevos estados para confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setShowForm(true);
  }

  // abre modal de confirmación
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  // borra realmente al confirmar
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    try {
      await userService.deleteUser(userToDelete.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setShowConfirm(false);
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

  // Función para capitalizar la primera letra
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


      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Usuario {user.name}</h3>
            <p>¿Eliminar usuario <strong>{userToDelete.first_name} {userToDelete.last_name}</strong>?</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={handleCancelDelete}>Cancelar</button>
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
      
      {/* Modal de confirmación */}
      {showConfirm && userToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar borrado</h3>
            <p>¿Eliminar usuario <strong>{userToDelete.first_name} {userToDelete.last_name}</strong>?</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={handleCancelDelete}>Cancelar</button>
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
