import { useState } from 'react';
import { authUtils, utils } from '../utils/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!utils.validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!utils.validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Aquí se conectará con tu API cuando esté lista
      console.log('Login attempt:', { email, password });
      
      // Por ahora simulamos la llamada
      setTimeout(() => {
        setIsLoading(false);
        alert('¡Login exitoso! Pronto se conectará con tu API.');
      }, 1000);
      
      // Cuando tengas tu API lista, descomenta esto:
      // const result = await authUtils.login(email, password);
      // console.log('Login successful:', result);
      
    } catch (error) {
      setIsLoading(false);
      setErrors({ general: 'Login failed. Please try again.' });
      console.error('Login error:', error);
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
          <p className="welcome-text">Welcome to My Home</p>
          <p className="subtitle">Sign in to access your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="login-footer">
            <a href="#" className="forgot-password">
              Forgot your password?
            </a>
            <p className="signup-link">
              Don't have an account? 
              <a href="#"> Sign up here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;