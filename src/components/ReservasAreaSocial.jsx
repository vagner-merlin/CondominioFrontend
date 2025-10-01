import React, { useState, useEffect } from 'react';
import './ReservasAreaSocial.css';
import { getRegistrosByAreaSocial } from '../utils/auth';

const ReservasAreaSocial = ({ area, onBack }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (area?.id) {
      loadReservas();
    } else {
      setLoading(false);
    }
  }, [area]);

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Cargando reservas para área:', area);
      console.log('URL que se llamará: http://127.0.0.1:8000/api/registros-areas-sociales/');
      console.log('Filtrando por AreaSocial:', area.id);
      
      const result = await getRegistrosByAreaSocial(area.id);
      console.log('Resultado completo:', result);
      
      if (result.success && result.data) {
        // result.data ya viene filtrado desde la función
        setReservas(result.data);
        console.log(`Reservas filtradas para área ${area.id}:`, result.data);
        console.log(`Total de reservas encontradas: ${result.data.length}`);
      } else {
        console.error('Error en la respuesta:', result.error);
        setError(result.error || 'Error al cargar las reservas');
        setReservas([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar las reservas');
      setReservas([]);
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
    } catch {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="reservas-container">
        <div className="reservas-header">
          <button className="volver-button" onClick={onBack}>
            ← Volver
          </button>
          <h2>Cargando reservas...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservas-container">
        <div className="reservas-header">
          <button className="volver-button" onClick={onBack}>
            ← Volver
          </button>
          <h2>Error</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadReservas} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="reservas-container">
        <div className="reservas-header">
          <button className="volver-button" onClick={onBack}>
            ← Volver
          </button>
          <h2>Área no encontrada</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="reservas-container">
      <div className="reservas-header">
        <button className="volver-button" onClick={onBack}>
          ← Volver
        </button>
        <h2>Reservas - {area.descripcion}</h2>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Total de reservas</h3>
          <p className="stat-number">{reservas.length}</p>
        </div>
      </div>

      {reservas.length === 0 ? (
        <div className="no-reservas">
          <p>No hay reservas registradas para {area.descripcion}</p>
        </div>
      ) : (
        <div className="reservas-list">
          {reservas.map((reserva) => (
            <div key={reserva.id} className="reserva-card">
              <div className="reserva-header">
                <h3>Reserva #{reserva.id}</h3>
                <span className="fecha-reserva">
                  {formatDate(reserva.fecha_reserva)}
                </span>
              </div>
              <div className="reserva-content">
                <p><strong>Descripción:</strong> {reserva.descripcion}</p>
                <p><strong>Tipo:</strong> {reserva.is_principal ? 'Principal' : 'Secundaria'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservasAreaSocial;