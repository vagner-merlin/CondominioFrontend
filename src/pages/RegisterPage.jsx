import React from 'react';
import Register from '../components/Register';

const RegisterPage = ({ onNavigateToLogin, onRegisterSuccess }) => {
  return (
    <Register 
      onNavigateToLogin={onNavigateToLogin}
      onSuccess={onRegisterSuccess}
      onBackToLogin={onNavigateToLogin}
    />
  );
};

export default RegisterPage;