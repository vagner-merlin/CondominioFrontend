import React, { useState, useEffect } from 'react';
import './UsersList.css';
import { getAllUsers, deleteUser } from '../utils/auth';
import UserEditModal from './UserEditModal';

const PersonalList = ({ userProfile, isAdmin }) => {
  const [personal, setPersonal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadPersonal();
  }, []);

  const loadPersonal = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Cargando personal...');
      const result = await getAllUsers();
      console.log('Resultado:', result);
      
      if (result.success) {
        // Filtrar solo personal (is_staff = true)
        const personalData = result.data.filter(user => user.is_staff);
        setPersonal(personalData);
        console.log('Personal cargado:', personalData);
      } else {
        setError(result.error);
        console.error('Error al cargar personal:', result.error);
      }
    } catch (error) {
      console.error('Error en loadPersonal:', error);
      setError('Error al cargar personal: ' + error.message);
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

    if (window.confirm(`¿Estás seguro de que quieres eliminar al miembro del personal ${username}?`)) {
      try {
        setIsLoading(true);
        console.log('Eliminando personal:', userId);
        
        const result = await deleteUser(userId);
        
        if (result.success) {
          alert('Miembro del personal eliminado exitosamente');
          loadPersonal(); // Recargar la lista
        } else {
          alert('Error al eliminar miembro del personal: ' + result.error);
        }
      } catch (error) {
        console.error('Error al eliminar personal:', error);
        alert('Error al eliminar miembro del personal: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUserUpdated = () => {
    loadPersonal(); // Recargar la lista después de editar
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const getRoleDisplay = (user) => {
    if (user.is_superuser) return 'Administrador';
    if (user.is_staff) return 'Secretaria';
    return 'Personal';
  };

  if (isLoading) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Personal del Condominio</h1>
        </div>
        <div className="loading">
          <p>Cargando personal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Personal del Condominio</h1>
        </div>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={loadPersonal} className="refresh-button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h1>Personal del Condominio</h1>
        <p>Total de personal: {personal.length}</p>
        <button onClick={loadPersonal} className="refresh-button">Actualizar Lista</button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Personal</h3>
          <p className="stat-number">{personal.length}</p>
        </div>
        <div className="stat-card">
          <h3>Administradores</h3>
          <p className="stat-number">{personal.filter(user => user.is_superuser).length}</p>
        </div>
        <div className="stat-card">
          <h3>Secretarias/Guardias</h3>
          <p className="stat-number">{personal.filter(user => user.is_staff && !user.is_superuser).length}</p>
        </div>
        <div className="stat-card">
          <h3>Activos</h3>
          <p className="stat-number">{personal.filter(user => user.is_active).length}</p>
        </div>
      </div>

      {personal.length === 0 ? (
        <div className="no-users">
          <p>No hay personal registrado</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personal.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                    </div>
                  </td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.is_superuser ? 'admin' : 'staff'}`}>
                      {getRoleDisplay(user)}
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
                        title="Modificar personal"
                      >
                        Modificar
                      </button>
                      {isAdmin && (
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          title="Eliminar personal"
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

export default PersonalList;