// Configuración de la API
export const API_BASE_URL = 'http://localhost:3000'; // Cambia esta URL por tu API

// Funciones de utilidad para autenticación
export const authUtils = {
  // Función para hacer login (conectarás tu API aquí)
  login: async (email, password) => {
    try {
      // Aquí harás la conexión real con tu API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      // Guardar token si lo hay
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Función para logout
  logout: () => {
    localStorage.removeItem('token');
    // Redirigir al login o limpiar estado
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

// Funciones de utilidad generales
export const utils = {
  // Validar email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validar password (mínimo 6 caracteres)
  validatePassword: (password) => {
    return password.length >= 6;
  }
};