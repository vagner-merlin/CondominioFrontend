import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ activeRoute, onNavigate, onLogout, userName, userProfile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug: ver la estructura del userProfile
  console.log('UserProfile en Navbar:', userProfile);

  // Determinar si es administrador o secretaria
  // Probar diferentes estructuras posibles
  const isAdmin = userProfile?.is_superuser || userProfile?.user?.is_superuser || false;
  const isStaff = userProfile?.is_staff || userProfile?.user?.is_staff || false;
  const isSecretaria = isStaff && !isAdmin;

  console.log('isAdmin:', isAdmin, 'isStaff:', isStaff, 'isSecretaria:', isSecretaria);

  // Menú completo - vamos a mostrar todo por ahora para debug
  const menuItems = [
    { key: 'home', label: 'Inicio', route: '/' },
    { key: 'registrar-usuario', label: 'Crear Usuario', route: '/registrar-usuario' },
    { key: 'propietarios', label: 'Propietarios', route: '/propietarios' },
    { key: 'personal', label: 'Personal', route: '/personal' },
    { key: 'areas-sociales', label: 'Áreas Sociales', route: '/areas-sociales' },
    { key: 'quejas', label: 'Quejas', route: '/quejas' },
    { key: 'pago-despensas', label: 'Pago Despensas', route: '/pago-despensas' }
  ];

  const handleNavClick = (route, key) => {
    onNavigate(route, key);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>My Home</h2>
        </div>

        {/* Botón de menú móvil */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Menú de navegación"
        >
          ☰
        </button>

        {/* Menu items */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="navbar-nav">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`nav-item ${activeRoute === item.key ? 'active' : ''}`}
                onClick={() => handleNavClick(item.route, item.key)}
                data-testid={`nav-item-${item.key}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="navbar-actions">
            <button 
              className="logout-btn"
              onClick={handleLogout}
              data-testid="logout-btn"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;