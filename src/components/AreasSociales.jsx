import React, { useState, useEffect } from 'react';
import './AreasSociales.css';
import { getAllAreasSociales } from '../utils/auth';

const AreasSociales = ({ onSelectArea }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      console.log('Cargando áreas sociales...');
      const result = await getAllAreasSociales();
      console.log('Resultado recibido:', result);
      
      if (result.success && result.data) {
        setAreas(result.data);
        console.log('Áreas cargadas desde API:', result.data);
      } else {
        console.error('Error en la respuesta:', result.error);
        setError(result.error || 'Error al cargar las áreas sociales');
      }
    } catch (err) {
      console.error('Error al cargar áreas sociales:', err);
      setError('Error al cargar las áreas sociales');
    } finally {
      setLoading(false);
    }
  };

  const getAreaImage = (areaId) => {
    const images = {
      1: '/img/salonInfanitil.png',
      2: '/img/salonfamiliar.png',
      3: '/img/sauan.png',
      4: '/img/futbol.png'
    };
    return images[areaId] || '/img/logo.png';
  };

  if (loading) {
    return (
      <div className="areas-sociales-container">
        <h2>Cargando áreas sociales...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="areas-sociales-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadAreas} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="areas-sociales-container">
      <h2>Áreas Sociales</h2>
      <p>Selecciona un área social para ver las reservas</p>
      <p>Debug: Número de áreas: {areas.length}</p>
      
      <div className="areas-grid">
        {areas.length === 0 ? (
          <p>No hay áreas sociales disponibles</p>
        ) : (
          areas.map((area) => (
            <div className="area-card" key={area.id} onClick={() => onSelectArea(area)}>
              <div className="area-image">
                <img src={getAreaImage(area.id)} alt={area.descripcion} />
              </div>
              <div className="area-info">
                <h3>{area.descripcion}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AreasSociales;