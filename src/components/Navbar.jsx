import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ activeRoute, onNavigate, onLogout, userName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: 'home', label: 'Inicio', route: '/' },
    { key: 'registrar-usuario', label: 'Registrar Usuario', route: '/registrar-usuario' },
    { key: 'area-sociales', label: 'Áreas Sociales', route: '/area-sociales' },
    { key: 'quejas', label: 'Quejas', route: '/quejas' }
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