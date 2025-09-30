import React, { useState, useEffect } from 'react';
import './UsersList.css';
import { getAllUsers, deleteUser } from '../utils/auth';
import UserEditModal from './UserEditModal';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Cargando usuarios...');
      const result = await getAllUsers();
      console.log('Resultado:', result);
      
      if (result.success) {
        setUsers(result.data);
        console.log('Usuarios cargados:', result.data);
      } else {
        setError(result.error);
        console.error('Error al cargar usuarios:', result.error);
      }
    } catch (error) {
      console.error('Error en loadUsers:', error);
      setError('Error al cargar usuarios: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${username}?`)) {
      try {
        setIsLoading(true);
        console.log('Eliminando usuario:', userId);
        
        const result = await deleteUser(userId);
        
        if (result.success) {
          alert('Usuario eliminado exitosamente');
          loadUsers(); // Recargar la lista
        } else {
          alert('Error al eliminar usuario: ' + result.error);
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUserUpdated = () => {
    loadUsers(); // Recargar la lista después de editar
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Lista de Usuarios</h1>
        </div>
        <div className="loading">
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Lista de Usuarios</h1>
        </div>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={loadUsers} className="refresh-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h1>Lista de Usuarios</h1>
        <p>Total de usuarios: {users.length}</p>
        <button onClick={loadUsers} className="refresh-button">Actualizar Lista</button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Usuarios</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Staff</h3>
          <p className="stat-number">{users.filter(user => user.is_staff).length}</p>
        </div>
        <div className="stat-card">
          <h3>Activos</h3>
          <p className="stat-number">{users.filter(user => user.is_active).length}</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <p>No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Staff</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                    </div>
                  </td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.is_staff ? 'staff' : 'regular'}`}>
                      {user.is_staff ? 'SÍ' : 'NO'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(user.date_joined).toLocaleDateString('es-ES')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditUser(user)}
                        title="Modificar usuario"
                      >
                        Modificar
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        title="Eliminar usuario"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición */}
      {isEditModalOpen && editingUser && (
        <UserEditModal
          user={editingUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default UsersList;