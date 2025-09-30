import { useState } from 'react';
import { login, logout, validateEmail, validatePassword } from '../utils/auth';
import './Login.css';

const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Verificar que solo ADMINISTRADORA o SECRETARIA puedan acceder
        const userType = result.data.perfil?.tipo_usuario;
        
        if (userType === 'ADMINISTRADORA' || userType === 'SECRETARIA') {
          onLoginSuccess(result.data);
        } else {
          setErrors({ 
            general: 'Acceso denegado. Esta aplicación es solo para administradoras y secretarias.' 
          });
          // Hacer logout automático
          await logout();
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Por favor intenta de nuevo.' });
      console.error('Error de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">🏠</div>
            <h1>My Home</h1>
          </div>
          <p className="welcome-text">Bienvenido a My Home</p>
          <p className="subtitle">Inicia sesión para acceder a tu cuenta</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="login-footer">
            <a href="#" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
            <p className="signup-link">
              ¿No tienes cuenta? 
              <button 
                type="button" 
                onClick={onNavigateToRegister} 
                className="link-button"
              >
                Registrarse aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;