import React from 'react';
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './UsersPage.css';
import { EditButton, DeleteButton, ViewButton } from '../../components/Buttons';

const UsersPage = () => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
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
    console.log('Editar usuario:', user);
  }
  const onDelete = (user) => {
    console.log('Borrar usuario:', user);
  }
  const onView = (user) => {
    console.log('Ver usuario:', user);
  }

  
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
                <h2 className="user-name">{user.first_name}</h2>
                <p className="user-lastname">{user.last_name}</p>
                <div className="action-buttons">
                <EditButton  onClick={() => onEdit(user)} />
                <DeleteButton onClick={() => onDelete(user)} />
                <ViewButton onClick={() => onView(user)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};


export default UsersPage;
