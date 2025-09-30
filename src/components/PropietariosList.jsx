import React, { useState, useEffect } from 'react';
import './UsersList.css';
import { getAllUsers, deleteUser } from '../utils/auth';
import UserEditModal from './UserEditModal';

const PropietariosList = ({ userProfile, isAdmin }) => {
  const [propietarios, setPropietarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadPropietarios();
  }, []);

  const loadPropietarios = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Cargando propietarios...');
      const result = await getAllUsers();
      console.log('Resultado:', result);
      
      if (result.success) {
        // Filtrar solo propietarios (is_staff = false)
        const propietariosData = result.data.filter(user => !user.is_staff);
        setPropietarios(propietariosData);
        console.log('Propietarios cargados:', propietariosData);
      } else {
        setError(result.error);
        console.error('Error al cargar propietarios:', result.error);
      }
    } catch (error) {
      console.error('Error en loadPropietarios:', error);
      setError('Error al cargar propietarios: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId, username) => {
    if (!isAdmin) {
      alert('No tienes permisos para eliminar usuarios');
      return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar al propietario ${username}?`)) {
      try {
        setIsLoading(true);
        console.log('Eliminando propietario:', userId);
        
        const result = await deleteUser(userId);
        
        if (result.success) {
          alert('Propietario eliminado exitosamente');
          loadPropietarios(); // Recargar la lista
        } else {
          alert('Error al eliminar propietario: ' + result.error);
        }
      } catch (error) {
        console.error('Error al eliminar propietario:', error);
        alert('Error al eliminar propietario: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUserUpdated = () => {
    loadPropietarios(); // Recargar la lista después de editar
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Lista de Propietarios</h1>
        </div>
        <div className="loading">
          <p>Cargando propietarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Lista de Propietarios</h1>
        </div>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={loadPropietarios} className="refresh-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h1>Lista de Propietarios</h1>
        <p>Total de propietarios: {propietarios.length}</p>
        <button onClick={loadPropietarios} className="refresh-button">Actualizar Lista</button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Propietarios</h3>
          <p className="stat-number">{propietarios.length}</p>
        </div>
        <div className="stat-card">
          <h3>Activos</h3>
          <p className="stat-number">{propietarios.filter(user => user.is_active).length}</p>
        </div>
        <div className="stat-card">
          <h3>Inactivos</h3>
          <p className="stat-number">{propietarios.filter(user => !user.is_active).length}</p>
        </div>
      </div>

      {propietarios.length === 0 ? (
        <div className="no-users">
          <p>No hay propietarios registrados</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propietarios.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                    </div>
                  </td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
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
                        title="Modificar propietario"
                      >
                        Modificar
                      </button>
                      {isAdmin && (
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          title="Eliminar propietario"
                        >
                          Eliminar
                        </button>
                      )}
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

export default PropietariosList;