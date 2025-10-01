import React, { useState, useEffect } from 'react';
import { getAllQuejas, updateQueja, deleteQueja, createQueja } from '../utils/auth';
import './Quejas.css';

const Quejas = () => {
  const [quejas, setQuejas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQueja, setEditingQueja] = useState(null);
  const [newQueja, setNewQueja] = useState({
    descripcion: ''
  });

  const estadosQuejas = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'EN_PROCESO', label: 'En Proceso' },
    { value: 'RESUELTO', label: 'Resuelto' },
    { value: 'CERRADO', label: 'Cerrado' }
  ];

  useEffect(() => {
    loadQuejas();
  }, []);

  const loadQuejas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Cargando quejas...');
      const result = await getAllQuejas();
      console.log('Resultado de quejas:', result);
      
      if (result.success && result.data) {
        setQuejas(result.data);
        console.log('Quejas cargadas:', result.data);
      } else {
        console.error('Error en la respuesta:', result.error);
        setError(result.error || 'Error al cargar las quejas');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar las quejas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQueja = async (e) => {
    e.preventDefault();
    
    if (!newQueja.descripcion.trim()) {
      setError('La descripción es requerida');
      return;
    }

    try {
      setLoading(true);
      const result = await createQueja(newQueja);
      
      if (result.success) {
        setNewQueja({ descripcion: '' });
        setShowCreateForm(false);
        loadQuejas(); // Recargar la lista
      } else {
        setError(result.error || 'Error al crear la queja');
      }
    } catch (err) {
      setError('Error al crear la queja');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (quejaId, nuevoEstado) => {
    try {
      setLoading(true);
      const result = await updateQueja(quejaId, { estado: nuevoEstado });
      
      if (result.success) {
        loadQuejas(); // Recargar la lista
        setEditingQueja(null);
      } else {
        setError(result.error || 'Error al actualizar el estado');
      }
    } catch (err) {
      setError('Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQueja = async (quejaId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta queja?')) {
      return;
    }

    try {
      setLoading(true);
      const result = await deleteQueja(quejaId);
      
      if (result.success) {
        loadQuejas(); // Recargar la lista
      } else {
        setError(result.error || 'Error al eliminar la queja');
      }
    } catch (err) {
      setError('Error al eliminar la queja');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'pendiente';
      case 'EN_PROCESO':
        return 'proceso';
      case 'RESUELTO':
        return 'resuelto';
      case 'CERRADO':
        return 'cerrado';
      default:
        return 'pendiente';
    }
  };

  if (loading) {
    return (
      <div className="quejas-container">
        <div className="loading">
          <h2>Cargando quejas...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quejas-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadQuejas} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quejas-container">
      <div className="quejas-header">
        <h2>Gestión de Quejas</h2>
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(true)}
        >
          + Nueva Queja
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-overlay">
          <div className="create-form">
            <h3>Crear Nueva Queja</h3>
            <form onSubmit={handleCreateQueja}>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={newQueja.descripcion}
                  onChange={(e) => setNewQueja({...newQueja, descripcion: e.target.value})}
                  placeholder="Describe la queja..."
                  rows={4}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Crear Queja
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="quejas-list">
        {quejas.length === 0 ? (
          <p className="no-quejas">No hay quejas registradas</p>
        ) : (
          quejas.map((queja) => (
            <div key={queja.id} className="queja-card">
              <div className="queja-header">
                <div className="queja-id">Queja #{queja.id}</div>
                <div className={`estado-badge ${getEstadoColor(queja.estado)}`}>
                  {queja.estado}
                </div>
              </div>
              
              <div className="queja-content">
                <p className="descripcion">{queja.descripcion}</p>
                <div className="queja-meta">
                  <span>Fecha: {formatDate(queja.fecha_creacion)}</span>
                  <span>Propietario ID: {queja.propietarios}</span>
                </div>
              </div>

              <div className="queja-actions">
                {editingQueja === queja.id ? (
                  <div className="estado-selector">
                    <select 
                      onChange={(e) => handleUpdateEstado(queja.id, e.target.value)}
                      defaultValue={queja.estado}
                    >
                      {estadosQuejas.map(estado => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                    <button 
                      className="cancel-edit-button"
                      onClick={() => setEditingQueja(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      className="edit-button"
                      onClick={() => setEditingQueja(queja.id)}
                    >
                      Cambiar Estado
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteQueja(queja.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Quejas;