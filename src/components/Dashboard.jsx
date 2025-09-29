import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import { getProfile, logout } from '../utils/auth';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [activeRoute, setActiveRoute] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const result = await getProfile();
      
      if (result.success) {
        setUserProfile(result.data);
      } else {
        setError(result.error);
        // Si falla la carga del perfil, probablemente el token es inválido
        onLogout();
      }
    } catch (error) {
      setError('Error al cargar el perfil');
      onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (route, key) => {
    setActiveRoute(key);
    // Aquí puedes agregar navegación real cuando implementes otras páginas
    console.log(`Navegando a: ${route}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      onLogout();
    }
  };

  const renderCurrentView = () => {
    switch (activeRoute) {
      case 'home':
        return <Home userProfile={userProfile} />;
      case 'registrar-usuario':
        return (
          <div className="page-placeholder">
            <h2>Registrar Usuario</h2>
            <p>Esta página estará disponible próximamente.</p>
          </div>
        );
      case 'area-sociales':
        return (
          <div className="page-placeholder">
            <h2>Áreas Sociales</h2>
            <p>Esta página estará disponible próximamente.</p>
          </div>
        );
      case 'quejas':
        return (
          <div className="page-placeholder">
            <h2>Quejas</h2>
            <p>Esta página estará disponible próximamente.</p>
          </div>
        );
      default:
        return <Home userProfile={userProfile} />;
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleLogout} className="error-button">
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar 
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={userProfile?.user?.first_name || userProfile?.user?.username}
      />
      <main className="dashboard-content">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Dashboard;