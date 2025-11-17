import React from 'react';
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './UsersPage.css';

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

                {/* Aquí podrías agregar botones de editar/borrar si es admin */}
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
};


export default UsersPage;
