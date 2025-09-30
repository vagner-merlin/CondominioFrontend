import React, { useState } from 'react';
import './Home.css';

const Home = ({ userProfile, onProfileUpdate }) => {
  if (!userProfile) {
    return (
      <div className="home-container">
        <div className="loading">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const { user, perfil } = userProfile;

  // Función para obtener el nombre completo
  const getFullName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  // Función para obtener las iniciales
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="home-container" data-testid="main-content">
      <div className="home-content">
        <div className="home-layout">
          {/* Sección izquierda - Información del usuario */}
          <div className="user-info-section">
            <div className="user-info">
              <h1 className="user-name" data-testid="user-name">
                {getFullName()}
              </h1>
              <p className="user-role" data-testid="user-role">
                {perfil.tipo_usuario_display}
              </p>
              <p className="welcome-message">
                Welcome to My Home
              </p>
            </div>
          </div>

          {/* Sección derecha - Foto de perfil */}
          <div className="profile-section">
            <div className="profile-photo-container" data-testid="profile-photo">
              {perfil.imagen_perfil_url ? (
                <img 
                  src={perfil.imagen_perfil_url} 
                  alt="Foto de perfil"
                  className="profile-photo"
                />
              ) : (
                <div className="profile-photo-placeholder">
                  <span className="initials">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional (opcional) */}
        <div className="additional-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{perfil.telefono}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Dirección:</span>
              <span className="info-value">{perfil.direccion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;