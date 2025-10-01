import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminRegister from './components/AdminRegister'
import Dashboard from './components/Dashboard'
import { isAuthenticated, removeToken } from './utils/auth'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'admin-register', 'dashboard'
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar la app
    if (isAuthenticated()) {
      setCurrentPage('dashboard');
    }
    setIsAuthChecked(true);
  }, []);

  const handleNavigateToRegister = () => {
    setCurrentPage('register');
  };

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
  };

  const handleNavigateToAdminRegister = () => {
    setCurrentPage('admin-register');
  };

  const handleBackToRegister = () => {
    setCurrentPage('register');
  };

  const handleLoginSuccess = (loginData) => {
    console.log('Login exitoso:', loginData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    removeToken();
    setCurrentPage('login');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
  };

  // Mostrar loading mientras verificamos autenticación
  if (!isAuthChecked) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {currentPage === 'login' && (
        <LoginPage 
          onNavigateToRegister={handleNavigateToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToAdminRegister={handleNavigateToAdminRegister}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      {currentPage === 'admin-register' && (
        <AdminRegister 
          onNavigateToLogin={handleNavigateToLogin}
          onBack={handleBackToRegister}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
