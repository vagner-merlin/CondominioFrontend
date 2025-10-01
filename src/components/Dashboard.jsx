import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import UserRegistration from './UserRegistration';
import UsersList from './UsersList';
import PropietariosList from './PropietariosList';
import PersonalList from './PersonalList';
import AreasSocialesMain from './AreasSocialesMain';
import Quejas from './Quejas';
import PagosDespensa from './PagosDespensa';
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

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
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
        return (
          <Home 
            userProfile={userProfile} 
            onProfileUpdate={handleProfileUpdate}
          />
        );
      case 'registrar-usuario':
        return (
          <div className="page-content">
            <UserRegistration />
          </div>
        );
      case 'propietarios':
        return (
          <div className="page-content">
            <PropietariosList 
              userProfile={userProfile}
              isAdmin={userProfile?.is_superuser || userProfile?.user?.is_superuser}
            />
          </div>
        );
      case 'areas-sociales':
        return (
          <div className="page-content">
            <AreasSocialesMain />
          </div>
        );
      case 'quejas':
        return (
          <div className="page-content">
            <Quejas />
          </div>
        );
      case 'pago-despensas':
        return (
          <div className="page-content">
            <PagosDespensa />
          </div>
        );
      case 'personal':
        return (
          <div className="page-content">
            <PersonalList 
              userProfile={userProfile}
              isAdmin={userProfile?.is_superuser || userProfile?.user?.is_superuser}
            />
          </div>
        );
      default:
        return (
          <div style={{width: '100%', minHeight: '100vh', padding: 0, margin: 0}}>
            <Home 
              userProfile={userProfile} 
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        );
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
        userName={userProfile?.first_name || userProfile?.username || userProfile?.user?.first_name || userProfile?.user?.username}
        userProfile={userProfile}
      />
      <main className={activeRoute === 'home' ? '' : 'dashboard-content'}>
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Dashboard;