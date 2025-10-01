import React, { useState } from 'react';
import './Home.css';

const Home = ({ userProfile, onProfileUpdate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente virtual del condominio. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!userProfile) {
    return (
      <div className="home-container">
        <div className="loading">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const { user, perfil } = userProfile;

  // Función para obtener el nombre completo
  const getFullName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  // Función para obtener las iniciales
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  // Función para enviar mensaje (aquí conectarás con la IA)
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular respuesta de IA (aquí conectarás con tu IA real)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: 'Gracias por tu mensaje. Esta función se conectará pronto con nuestro sistema de IA para brindarte respuestas personalizadas sobre el condominio.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="home-container" data-testid="main-content">
      <div className="home-content">
        <div className="horizontal-layout">
          {/* Panel Izquierdo - Información del Usuario */}
          <div className="left-panel">
            <div className="user-info-card">
              <div className="profile-header">
                <div className="profile-photo-container" data-testid="profile-photo">
                  {perfil.imagen_perfil_url ? (
                    <img 
                      src={perfil.imagen_perfil_url} 
                      alt="Foto de perfil"
                      className="profile-photo"
                    />
                  ) : (
                    <div className="profile-photo-placeholder">
                      <span className="initials">
                        {getInitials()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h1 className="user-name" data-testid="user-name">
                    {getFullName()}
                  </h1>
                  <p className="user-role" data-testid="user-role">
                    {perfil.tipo_usuario_display}
                  </p>
                  <p className="welcome-message">
                    Bienvenido a My Home
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="user-info-details">
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div className="info-content">
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">{perfil.telefono}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-content">
                    <span className="info-label">Dirección</span>
                    <span className="info-value">{perfil.direccion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Chat de IA */}
          <div className="right-panel">
            <div className="ai-chat-container">
              <div className="chat-header">
                <div className="ai-avatar">🤖</div>
                <div className="chat-title">
                  <h3>Asistente Virtual</h3>
                  <p>Tu ayudante del condominio</p>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai">
                    <div className="message-content typing">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input-container">
                <div className="chat-input">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta sobre el condominio..."
                    rows="1"
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="send-button"
                  >
                    <span>📤</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;