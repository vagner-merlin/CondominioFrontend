import React, { useState } from 'react';
import './Register.css';
import { registerAdministrador } from '../utils/auth';

const AdminRegister = ({ onNavigateToLogin, onBack }) => {
  const [step, setStep] = useState('password'); // 'password' o 'form'
  const [systemPassword, setSystemPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    telefono: '',
    direccion: '',
    sexo: 'M'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const SYSTEM_PASSWORD = 'adminn'; // Contraseña del sistema

  const handlePasswordVerification = (e) => {
    e.preventDefault();
    if (systemPassword === SYSTEM_PASSWORD) {
      setStep('form');
      setPasswordError('');
    } else {
      setPasswordError('Lo siento, no puedes crear usuario administrador');
      setSystemPassword('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await registerAdministrador(formData);

      if (result.success) {
        alert('¡Administrador registrado exitosamente! Ahora puedes iniciar sesión.');
        onNavigateToLogin();
      } else {
        setErrors({ general: result.error });
      }
      
    } catch (error) {
      setErrors({ general: 'Error de conexión. Por favor intenta de nuevo.' });
      console.error('Error de registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 1: Verificación de contraseña del sistema
  if (step === 'password') {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="logo-container">
              <img 
                src="/img/administradora.jpeg" 
                alt="Administrador" 
                className="register-image"
              />
              <div>
                <h1>Crear Administrador</h1>
                <p className="subtitle">Ingresa la contraseña del sistema</p>
              </div>
            </div>
          </div>

          <form className="register-form" onSubmit={handlePasswordVerification}>
            <div className="system-password-info">
              <div className="info-box">
                <h3>🔐 Contraseña del Sistema</h3>
                <p>Es una contraseña que te permite crear usuarios administrador</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="systemPassword">Contraseña del Sistema *</label>
              <input
                type="password"
                id="systemPassword"
                value={systemPassword}
                onChange={(e) => setSystemPassword(e.target.value)}
                placeholder="Ingresa la contraseña del sistema"
                className={passwordError ? 'input-error' : ''}
                autoFocus
              />
              {passwordError && (
                <span className="field-error">{passwordError}</span>
              )}
            </div>

            <div className="form-buttons">
              <button 
                type="button" 
                onClick={onBack}
                className="secondary-button"
              >
                Volver
              </button>
              <button 
                type="submit" 
                className="register-button"
              >
                Verificar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Paso 2: Formulario de registro
  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <img 
              src="/img/administradora.jpeg" 
              alt="Administrador" 
              className="register-image"
            />
            <div>
              <h1>Registrar Administrador</h1>
              <p className="subtitle">Completa todos los campos para crear la cuenta</p>
            </div>
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="ej: admin_carlos"
                className={errors.username ? 'input-error' : ''}
              />
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ej: carlos@condominio.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Nombre *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="ej: Carlos"
                className={errors.first_name ? 'input-error' : ''}
              />
              {errors.first_name && (
                <span className="field-error">{errors.first_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Apellido *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="ej: Mendoza"
                className={errors.last_name ? 'input-error' : ''}
              />
              {errors.last_name && (
                <span className="field-error">{errors.last_name}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="ej: +591 70555444"
              className={errors.telefono ? 'input-error' : ''}
            />
            {errors.telefono && (
              <span className="field-error">{errors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección *</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="ej: Av. Administración 100, La Paz"
              className={errors.direccion ? 'input-error' : ''}
            />
            {errors.direccion && (
              <span className="field-error">{errors.direccion}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="sexo">Sexo *</label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className={errors.sexo ? 'input-error' : ''}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            {errors.sexo && (
              <span className="field-error">{errors.sexo}</span>
            )}
          </div>

          <div className="form-buttons">
            <button 
              type="button" 
              onClick={() => setStep('password')}
              className="secondary-button"
            >
              Volver
            </button>
            <button 
              type="submit" 
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Registrando...
                </>
              ) : (
                'Registrar Administrador'
              )}
            </button>
          </div>

          <div className="register-footer">
            <p className="login-link">
              ¿Ya tienes cuenta? 
              <button 
                type="button" 
                onClick={onNavigateToLogin} 
                className="link-button"
              >
                Iniciar sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;