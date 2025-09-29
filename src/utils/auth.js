// URL base de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';

// Funciones de validación
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

// Gestión de token
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// API de autenticación
export const registerSecretaria = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register-secretaria/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en el login');
    }

    // Guardar el token
    if (data.token) {
      setToken(data.token);
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener perfil');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Independientemente de la respuesta, removemos el token local
    removeToken();

    if (!response.ok) {
      // Si hay error en logout del servidor, igual continuamos
      console.warn('Error en logout del servidor, pero token local removido');
    }

    return { success: true };
  } catch (error) {
    // Asegurar que el token se remueva aunque haya error
    removeToken();
    return { success: false, error: error.message };
  }
};