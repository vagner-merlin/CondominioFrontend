// URL base de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';
const PROFILES_API_URL = 'http://127.0.0.1:8000/api/perfiles';
const USERS_API_URL = 'http://127.0.0.1:8000/api/users';

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

export const createUserComplete = async (userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/create-user-complete/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear usuario');
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

// API de usuarios
export const getAllUsers = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${USERS_API_URL}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuarios');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserById = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${USERS_API_URL}/${userId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuario');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${USERS_API_URL}/${userId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${USERS_API_URL}/${userId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar usuario');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerAdministrador = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register-administrador/`, {
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

export const getAllPerfiles = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('Haciendo petición a:', 'http://127.0.0.1:8000/api/perfiles/');
    const response = await fetch('http://127.0.0.1:8000/api/perfiles/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Data recibida de perfiles:', data);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error en getAllPerfiles:', error);
    return { success: false, error: error.message };
  }
};

export const getPerfilById = async (perfilId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://127.0.0.1:8000/api/perfiles/${perfilId}/`, {
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

export const updatePerfil = async (perfilId, perfilData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://127.0.0.1:8000/api/perfiles/${perfilId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(perfilData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar perfil');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deletePerfil = async (perfilId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://127.0.0.1:8000/api/perfiles/${perfilId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar perfil');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// APIs de Áreas Sociales
const AREAS_SOCIALES_API_URL = 'http://127.0.0.1:8000/api/areas-sociales';
const REGISTROS_AREAS_API_URL = 'http://127.0.0.1:8000/api/registros-areas-sociales';

// Obtener todas las áreas sociales
export const getAllAreasSociales = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${AREAS_SOCIALES_API_URL}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener áreas sociales');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener registros de áreas sociales
export const getAllRegistrosAreasSociales = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${REGISTROS_AREAS_API_URL}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener registros de áreas sociales');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener registros por área social específica
export const getRegistrosByAreaSocial = async (areaSocialId) => {
  try {
    const token = getToken();
    const response = await fetch(`${REGISTROS_AREAS_API_URL}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener registros del área social');
    }

    const allData = await response.json();
    
    // Filtrar solo los registros que pertenecen al área social específica
    const filteredData = allData.filter(registro => 
      registro.AreaSocial === parseInt(areaSocialId)
    );
    
    return { success: true, data: filteredData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// APIs de Quejas
const QUEJAS_API_URL = 'http://127.0.0.1:8000/api/quejas';

// Obtener todas las quejas
export const getAllQuejas = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${QUEJAS_API_URL}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener quejas');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear una nueva queja
export const createQueja = async (quejaData) => {
  try {
    const token = getToken();
    const response = await fetch(`${QUEJAS_API_URL}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quejaData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al crear la queja');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtener queja por ID
export const getQuejaById = async (quejaId) => {
  try {
    const token = getToken();
    const response = await fetch(`${QUEJAS_API_URL}/${quejaId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener la queja');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar queja (cambiar estado)
export const updateQueja = async (quejaId, quejaData) => {
  try {
    const token = getToken();
    const response = await fetch(`${QUEJAS_API_URL}/${quejaId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quejaData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al actualizar la queja');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Eliminar queja
export const deleteQueja = async (quejaId) => {
  try {
    const token = getToken();
    const response = await fetch(`${QUEJAS_API_URL}/${quejaId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar la queja');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// URL para pagos despensa
const PAGOS_DESPENSA_API_URL = 'http://127.0.0.1:8000/api/pagos-despensa';

// Obtener todos los pagos de despensa
export const getAllPagosDespensa = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${PAGOS_DESPENSA_API_URL}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener pagos de despensa');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// API para propietarios-unidades
export const getPropietarios = async () => {
  try {
    const token = getToken();
    const response = await fetch('http://127.0.0.1:8000/api/propietarios/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener propietarios');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUnidadesHabitacionales = async () => {
  try {
    const token = getToken();
    const response = await fetch('http://127.0.0.1:8000/api/unidades-habitacionales/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener unidades habitacionales');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createPropietarioUnidad = async (propietarioUnidadData) => {
  try {
    const token = getToken();
    const response = await fetch('http://127.0.0.1:8000/api/propietarios-unidades/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propietarioUnidadData),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Error del backend:', data);
      throw new Error(data.message || data.detail || 'Error al asignar propietario a unidad');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error en createPropietarioUnidad:', error);
    return { success: false, error: error.message };
  }
};