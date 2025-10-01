import React, { useState, useEffect } from 'react';
import './UserRegistration.css';
import { createUserComplete, validateEmail, validatePassword, getPropietarios, getUnidadesHabitacionales, createPropietarioUnidad } from '../utils/auth';

const UserRegistration = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    telefono: '',
    direccion: '',
    sexo: 'M',
    tipo_usuario: '',
    // Campos específicos para GUARDIA
    turno: 'NOCHE',
    fecha_contratacion: '',
    informacion_adicional: '',
    // Campos específicos para PROPIETARIO
    codigo_propietario: '',
    // Campos específicos para HABITACIONES (propietarios-unidades)
    is_principal: true,
    propietario: '',
    unidad_habitacional: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [propietarios, setPropietarios] = useState([]);
  const [unidadesHabitacionales, setUnidadesHabitacionales] = useState([]);

  // Cargar datos cuando se selecciona HABITACIONES
  useEffect(() => {
    if (userType === 'HABITACIONES') {
      loadPropietariosYUnidades();
    }
  }, [userType]);

  const loadPropietariosYUnidades = async () => {
    try {
      const [propietariosResult, unidadesResult] = await Promise.all([
        getPropietarios(),
        getUnidadesHabitacionales()
      ]);

      if (propietariosResult.success) {
        setPropietarios(propietariosResult.data);
      }

      if (unidadesResult.success) {
        setUnidadesHabitacionales(unidadesResult.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      tipo_usuario: type,
      // Limpiar campos específicos al cambiar tipo
      turno: type === 'GUARDIA' ? 'NOCHE' : '',
      fecha_contratacion: '',
      informacion_adicional: '',
      codigo_propietario: '',
      is_principal: type === 'HABITACIONES' ? true : false,
      propietario: '',
      unidad_habitacional: ''
    }));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error específico al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones comunes
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
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
    if (!userType) {
      newErrors.tipo_usuario = 'Debe seleccionar un tipo de usuario';
    }

    // Validaciones específicas por tipo de usuario
    if (userType === 'GUARDIA') {
      if (!formData.fecha_contratacion) {
        newErrors.fecha_contratacion = 'La fecha de contratación es requerida';
      }
      if (!formData.informacion_adicional.trim()) {
        newErrors.informacion_adicional = 'La información adicional es requerida';
      }
    }

    if (userType === 'PROPIETARIO') {
      if (!formData.codigo_propietario.trim()) {
        newErrors.codigo_propietario = 'El código de propietario es requerido';
      }
    }

    if (userType === 'HABITACIONES') {
      if (!formData.propietario) {
        newErrors.propietario = 'Debe seleccionar un propietario';
      }
      if (!formData.unidad_habitacional) {
        newErrors.unidad_habitacional = 'Debe seleccionar una unidad habitacional';
      }
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
      if (userType === 'HABITACIONES') {
        // Para HABITACIONES, crear la asignación propietario-unidad
        const propietarioUnidadData = {
          is_principal: formData.is_principal,
          propietario: parseInt(formData.propietario),
          unidad_habitacional: parseInt(formData.unidad_habitacional)
        };

        console.log('Datos a enviar:', propietarioUnidadData);
        const result = await createPropietarioUnidad(propietarioUnidadData);
        console.log('Resultado del API:', result);
        
        if (result.success) {
          alert('¡Propietario asignado a unidad habitacional exitosamente!');
          // Limpiar formulario
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            first_name: '',
            last_name: '',
            telefono: '',
            direccion: '',
            sexo: 'M',
            tipo_usuario: '',
            turno: 'NOCHE',
            fecha_contratacion: '',
            informacion_adicional: '',
            codigo_propietario: '',
            is_principal: true,
            propietario: '',
            unidad_habitacional: ''
          });
          setUserType('');
        } else {
          setErrors({ general: result.error });
        }
      } else {
        // Para GUARDIA y PROPIETARIO, crear usuario
        const { confirmPassword, is_principal, propietario, unidad_habitacional, ...dataToSend } = formData;
      
        // Eliminar campos vacíos según el tipo de usuario
        if (userType === 'GUARDIA') {
          delete dataToSend.codigo_propietario;
        } else if (userType === 'PROPIETARIO') {
          delete dataToSend.turno;
          delete dataToSend.fecha_contratacion;
          delete dataToSend.informacion_adicional;
        }

        const result = await createUserComplete(dataToSend);
        
        if (result.success) {
          alert(`¡Usuario ${userType.toLowerCase()} creado exitosamente!`);
          // Limpiar formulario
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            first_name: '',
            last_name: '',
            telefono: '',
            direccion: '',
            sexo: 'M',
            tipo_usuario: '',
            turno: 'NOCHE',
            fecha_contratacion: '',
            informacion_adicional: '',
            codigo_propietario: '',
            is_principal: true,
            propietario: '',
            unidad_habitacional: ''
          });
          setUserType('');
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-registration-container">
      <div className="registration-header">
        <h1>Registrar Nuevo Usuario</h1>
        <p>Selecciona el tipo de usuario y completa los datos correspondientes</p>
      </div>

      {/* Selector de tipo de usuario */}
      <div className="user-type-selector">
        <h2>Tipo de Usuario</h2>
        <div className="type-options">
          <div 
            className={`type-option ${userType === 'GUARDIA' ? 'selected' : ''}`}
            onClick={() => handleUserTypeChange('GUARDIA')}
          >
            <div className="type-icon">🛡️</div>
            <h3>Guardia</h3>
            <p>Personal de seguridad del condominio</p>
          </div>
          <div 
            className={`type-option ${userType === 'PROPIETARIO' ? 'selected' : ''}`}
            onClick={() => handleUserTypeChange('PROPIETARIO')}
          >
            <div className="type-icon">🏠</div>
            <h3>Propietario</h3>
            <p>Propietario de una unidad en el condominio</p>
          </div>
          <div 
            className={`type-option ${userType === 'HABITACIONES' ? 'selected' : ''}`}
            onClick={() => handleUserTypeChange('HABITACIONES')}
          >
            <div className="type-icon">🏢</div>
            <h3>Asignar Habitaciones</h3>
            <p>Gestión y asignación de habitaciones</p>
          </div>
        </div>
        {errors.tipo_usuario && (
          <span className="error-text">{errors.tipo_usuario}</span>
        )}
      </div>

      {/* Formulario */}
      {userType && (
        <form onSubmit={handleSubmit} className="registration-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {(userType === 'GUARDIA' || userType === 'PROPIETARIO') && (
            <div className="form-section">
              <h3>Información Personal</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Nombre de Usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  placeholder={`Ej: ${userType === 'GUARDIA' ? 'miguel_guardia' : userType === 'PROPIETARIO' ? 'ana_propietaria' : 'admin_habitaciones'}`}
                />
                {errors.username && (
                  <span className="error-text">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder={`Ej: ${userType === 'GUARDIA' ? 'miguel@condominio.com' : userType === 'PROPIETARIO' ? 'ana@gmail.com' : 'admin@condominio.com'}`}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Repite la contraseña"
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">Nombre</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={errors.first_name ? 'error' : ''}
                  placeholder={`Ej: ${userType === 'GUARDIA' ? 'Miguel' : userType === 'PROPIETARIO' ? 'Ana' : 'Carlos'}`}
                />
                {errors.first_name && (
                  <span className="error-text">{errors.first_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Apellido</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={errors.last_name ? 'error' : ''}
                  placeholder={`Ej: ${userType === 'GUARDIA' ? 'García' : userType === 'PROPIETARIO' ? 'López' : 'Mendoza'}`}
                />
                {errors.last_name && (
                  <span className="error-text">{errors.last_name}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={errors.telefono ? 'error' : ''}
                  placeholder={`Ej: ${userType === 'GUARDIA' ? '+591 65432100' : userType === 'PROPIETARIO' ? '+591 70987654' : '+591 72345678'}`}
                />
                {errors.telefono && (
                  <span className="error-text">{errors.telefono}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="sexo">Sexo</label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className={errors.direccion ? 'error' : ''}
                placeholder={`Ej: ${userType === 'GUARDIA' ? 'Calle Secundaria 456, La Paz' : userType === 'PROPIETARIO' ? 'Av. Principal 789, La Paz' : 'Zona Central 123, La Paz'}`}
              />
              {errors.direccion && (
                <span className="error-text">{errors.direccion}</span>
              )}
            </div>
            </div>
          )}

          {/* Campos específicos por tipo de usuario */}
          {userType === 'GUARDIA' && (
            <div className="form-section">
              <h3>Información de Guardia</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="turno">Turno</label>
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

                <div className="form-group">
                  <label htmlFor="fecha_contratacion">Fecha de Contratación</label>
                  <input
                    type="date"
                    id="fecha_contratacion"
                    name="fecha_contratacion"
                    value={formData.fecha_contratacion}
                    onChange={handleChange}
                    className={errors.fecha_contratacion ? 'error' : ''}
                  />
                  {errors.fecha_contratacion && (
                    <span className="error-text">{errors.fecha_contratacion}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="informacion_adicional">Información Adicional</label>
                <textarea
                  id="informacion_adicional"
                  name="informacion_adicional"
                  value={formData.informacion_adicional}
                  onChange={handleChange}
                  className={errors.informacion_adicional ? 'error' : ''}
                  placeholder="Ej: Experiencia en seguridad de 5 años"
                  rows="3"
                />
                {errors.informacion_adicional && (
                  <span className="error-text">{errors.informacion_adicional}</span>
                )}
              </div>
            </div>
          )}

          {userType === 'PROPIETARIO' && (
            <div className="form-section">
              <h3>Información de Propietario</h3>
              <div className="form-group">
                <label htmlFor="codigo_propietario">Código de Propietario</label>
                <input
                  type="text"
                  id="codigo_propietario"
                  name="codigo_propietario"
                  value={formData.codigo_propietario}
                  onChange={handleChange}
                  className={errors.codigo_propietario ? 'error' : ''}
                  placeholder="Ej: PROP001"
                />
                {errors.codigo_propietario && (
                  <span className="error-text">{errors.codigo_propietario}</span>
                )}
              </div>
            </div>
          )}

          {userType === 'HABITACIONES' && (
            <div className="form-section">
              <h3>Asignar Propietario a Unidad Habitacional</h3>
              <div className="form-group">
                <label htmlFor="propietario">Seleccionar Propietario</label>
                <select
                  id="propietario"
                  name="propietario"
                  value={formData.propietario}
                  onChange={handleChange}
                  className={errors.propietario ? 'error' : ''}
                >
                  <option value="">-- Seleccionar Propietario --</option>
                  {propietarios.map(prop => (
                    <option key={prop.id} value={prop.id}>
                      {prop.codigo_propietario} - {prop.user?.first_name} {prop.user?.last_name}
                    </option>
                  ))}
                </select>
                {errors.propietario && (
                  <span className="error-text">{errors.propietario}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="unidad_habitacional">Seleccionar Unidad Habitacional</label>
                <select
                  id="unidad_habitacional"
                  name="unidad_habitacional"
                  value={formData.unidad_habitacional}
                  onChange={handleChange}
                  className={errors.unidad_habitacional ? 'error' : ''}
                >
                  <option value="">-- Seleccionar Unidad --</option>
                  {unidadesHabitacionales.map(unidad => (
                    <option key={unidad.id} value={unidad.id}>
                      {unidad.Descripcion}
                    </option>
                  ))}
                </select>
                {errors.unidad_habitacional && (
                  <span className="error-text">{errors.unidad_habitacional}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="is_principal">
                  <input
                    type="checkbox"
                    id="is_principal"
                    name="is_principal"
                    checked={formData.is_principal}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      is_principal: e.target.checked
                    }))}
                  />
                  ¿Es propietario principal?
                </label>
                <p className="help-text">
                  Marque esta opción si este propietario será el principal de la unidad habitacional.
                </p>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 
              (userType === 'HABITACIONES' ? 'Asignando...' : 'Creando usuario...') : 
              (userType === 'HABITACIONES' ? 'Asignar Propietario a Unidad' : `Crear ${userType.toLowerCase()}`)
            }
          </button>
        </form>
      )}
    </div>
  );
};

export default UserRegistration;