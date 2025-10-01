import React from 'react';
import Register from '../components/Register';

const RegisterPage = ({ onNavigateToLogin, onNavigateToAdminRegister, onRegisterSuccess }) => {
  return (
    <Register 
      onNavigateToLogin={onNavigateToLogin}
      onNavigateToAdminRegister={onNavigateToAdminRegister}
      onSuccess={onRegisterSuccess}
      onBackToLogin={onNavigateToLogin}
    />
  );
};

export default RegisterPage;