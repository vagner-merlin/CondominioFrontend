import { useState } from 'react';
import './Register.css';
import { registerSecretaria, validateEmail, validatePassword } from '../utils/auth';

const Register = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    telefono: '',
    direccion: '',
    sexo: 'F',
    turno: 'TARDE',
    velocidad_teclado: 65
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
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
    
    if (formData.velocidad_teclado < 1 || formData.velocidad_teclado > 200) {
      newErrors.velocidad_teclado = 'La velocidad debe estar entre 1 y 200 palabras por minuto';
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
      // Preparar datos para enviar (sin confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;
      
      const result = await registerSecretaria(dataToSend);
      
      if (result.success) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');
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

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <img 
              src="/img/administradora.jpeg" 
              alt="Administradora" 
              className="register-image"
            />
            <div>
              <h1>Registrar Administradora</h1>
              <p className="subtitle">Completa todos los campos para crear tu cuenta</p>
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
                placeholder="ej: ana_secretaria"
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
                placeholder="ej: ana@condominio.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Nombre *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="ej: Ana"
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
                placeholder="ej: López"
                className={errors.last_name ? 'input-error' : ''}
              />
              {errors.last_name && (
                <span className="field-error">{errors.last_name}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="ej: +591 65432100"
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
              placeholder="ej: Calle Principal 456, La Paz"
              className={errors.direccion ? 'input-error' : ''}
            />
            {errors.direccion && (
              <span className="field-error">{errors.direccion}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
              >
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="turno">Turno de Trabajo</label>
              <select
                id="turno"
                name="turno"
                value={formData.turno}
                onChange={handleChange}
              >
                <option value="MAÑANA">Mañana</option>
                <option value="TARDE">Tarde</option>
                <option value="NOCHE">Noche</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="velocidad_teclado">Velocidad de Teclado (palabras por minuto)</label>
            <input
              type="number"
              id="velocidad_teclado"
              name="velocidad_teclado"
              value={formData.velocidad_teclado}
              onChange={handleChange}
              min="1"
              max="200"
              placeholder="ej: 60"
              className={errors.velocidad_teclado ? 'input-error' : ''}
            />
            {errors.velocidad_teclado && (
              <span className="field-error">{errors.velocidad_teclado}</span>
            )}
          </div>

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
              'Registrar Administradora'
            )}
          </button>

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

export default Register;