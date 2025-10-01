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
      
      console.log('Cargando usuarios...');
      
      // Solo usar API de usuarios
      const usersResult = await getAllUsers();
      
      console.log('Usuarios:', usersResult);
      
      if (usersResult.success) {
        // Filtrar solo staff (is_staff = true, excluyendo superuser si quieres)
        const personalData = usersResult.data.filter(user => 
          user.is_staff === true
        );
        
        setPersonal(personalData);
        console.log('Staff cargado:', personalData);
        
      } else {
        setError('Error al cargar usuarios: ' + (usersResult.message || 'Error desconocido'));
      }
      
    } catch (error) {
      console.error('Error en loadPersonal:', error);
      setError('Error al cargar personal: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (item) => {
    setEditingUser(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = async (item) => {
    if (!isAdmin) {
      alert('No tienes permisos para eliminar');
      return;
    }

    const confirmMessage = `¿Estás seguro de que quieres eliminar al usuario ${item.username}?`;

    if (window.confirm(confirmMessage)) {
      try {
        setIsLoading(true);
        
        console.log('Eliminando usuario:', item.id);
        const result = await deleteUser(item.id);
        
        if (result.success) {
          alert('Usuario eliminado exitosamente');
          loadPersonal(); // Recargar la lista
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
    loadPersonal(); // Recargar la lista después de editar
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const getItemData = (item) => {
    return {
      id: item.id,
      username: item.username,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      isActive: item.is_active,
      dateJoined: item.date_joined
    };
  };

  if (isLoading) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Staff del Condominio</h1>
        </div>
        <div className="loading">
          <p>Cargando staff...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list-container">
        <div className="users-header">
          <h1>Staff del Condominio</h1>
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
        <h1>Staff del Condominio</h1>
        <p>Total de staff: {personal.length}</p>
        <button onClick={loadPersonal} className="refresh-button">Actualizar Lista</button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <h3>Total Staff</h3>
          <p className="stat-number">{personal.length}</p>
        </div>
        <div className="stat-card">
          <h3>Administradores</h3>
          <p className="stat-number">{personal.filter(user => user.is_superuser).length}</p>
        </div>
        <div className="stat-card">
          <h3>Staff Regular</h3>
          <p className="stat-number">{personal.filter(user => user.is_staff && !user.is_superuser).length}</p>
        </div>
        <div className="stat-card">
          <h3>Activos</h3>
          <p className="stat-number">{personal.filter(user => user.is_active).length}</p>
        </div>
      </div>

      {personal.length === 0 ? (
        <div className="no-users">
          <p>No hay staff registrado</p>
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
              {personal.map((item, index) => {
                const itemData = getItemData(item);
                return (
                  <tr key={itemData.id || index}>
                    <td>
                      <div className="user-info">
                        <span className="username">{itemData.username}</span>
                      </div>
                    </td>
                    <td>{itemData.firstName} {itemData.lastName}</td>
                    <td>{itemData.email}</td>
                    <td>
                      <span className={`status-badge ${itemData.isActive ? 'active' : 'inactive'}`}>
                        {itemData.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{itemData.dateJoined ? new Date(itemData.dateJoined).toLocaleDateString('es-ES') : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditUser(item)}
                          title="Modificar"
                        >
                          Modificar
                        </button>
                        {isAdmin && (
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteItem(item)}
                            title="Eliminar"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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