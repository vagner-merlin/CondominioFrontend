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
    <>
      <style>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
      <div 
        className="home-container" 
        data-testid="main-content"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
          minHeight: 'calc(100vh - 64px)',
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
          color: '#334155',
          width: '100%',
          boxSizing: 'border-box',
          margin: 0
        }}
      >
      <div 
        className="home-content"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          gap: '30px',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <div 
          className="horizontal-layout"
          style={{
            display: 'flex',
            gap: '30px',
            width: '100%',
            maxWidth: '1400px',
            alignItems: 'flex-start'
          }}
        >
          {/* Panel Izquierdo - Información del Usuario */}
          <div 
            className="left-panel"
            style={{
              flex: '1',
              minWidth: '350px',
              maxWidth: '450px'
            }}
          >
            <div 
              className="user-info-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 15px 35px rgba(99, 102, 241, 0.1), 0 5px 15px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                backdropFilter: 'blur(10px)',
                borderLeft: '4px solid #6366f1',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                className="profile-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '25px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid rgba(99, 102, 241, 0.1)'
                }}
              >
                <div 
                  className="profile-photo-container" 
                  data-testid="profile-photo"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #6366f1',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  }}
                >
                  {perfil.imagen_perfil_url ? (
                    <img 
                      src={perfil.imagen_perfil_url} 
                      alt="Foto de perfil"
                      className="profile-photo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div 
                      className="profile-photo-placeholder"
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      <span className="initials">
                        {getInitials()}
                      </span>
                    </div>
                  )}
                </div>
                <div 
                  className="user-details"
                  style={{
                    flex: 1
                  }}
                >
                  <h1 
                    className="user-name" 
                    data-testid="user-name"
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#1e293b',
                      lineHeight: '1.2'
                    }}
                  >
                    {getFullName()}
                  </h1>
                  <p 
                    className="user-role" 
                    data-testid="user-role"
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#6366f1',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {perfil.tipo_usuario_display}
                  </p>
                  <p 
                    className="welcome-message"
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#64748b',
                      fontStyle: 'italic'
                    }}
                  >
                    Bienvenido a My Home
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              <div 
                className="user-info-details"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}
              >
                <div 
                  className="info-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div 
                    className="info-icon"
                    style={{
                      fontSize: '20px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#6366f1',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}
                  >📧</div>
                  <div 
                    className="info-content"
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <span 
                      className="info-label"
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >Email</span>
                    <span 
                      className="info-value"
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1e293b'
                      }}
                    >{user.email}</span>
                  </div>
                </div>
                <div 
                  className="info-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div 
                    className="info-icon"
                    style={{
                      fontSize: '20px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#6366f1',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}
                  >📞</div>
                  <div 
                    className="info-content"
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <span 
                      className="info-label"
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >Teléfono</span>
                    <span 
                      className="info-value"
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1e293b'
                      }}
                    >{perfil.telefono}</span>
                  </div>
                </div>
                <div 
                  className="info-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div 
                    className="info-icon"
                    style={{
                      fontSize: '20px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#6366f1',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}
                  >📍</div>
                  <div 
                    className="info-content"
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <span 
                      className="info-label"
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >Dirección</span>
                    <span 
                      className="info-value"
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1e293b'
                      }}
                    >{perfil.direccion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Chat de IA */}
          <div 
            className="right-panel"
            style={{
              flex: '2',
              minWidth: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div 
              className="ai-chat-container"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '0',
                boxShadow: '0 15px 35px rgba(99, 102, 241, 0.1), 0 5px 15px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                backdropFilter: 'blur(10px)',
                borderLeft: '4px solid #6366f1',
                display: 'flex',
                flexDirection: 'column',
                height: '600px',
                overflow: 'hidden'
              }}
            >
              <div 
                className="chat-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '25px 30px',
                  borderBottom: '2px solid rgba(99, 102, 241, 0.1)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
                  borderRadius: '20px 20px 0 0'
                }}
              >
                <div 
                  className="ai-avatar"
                  style={{
                    fontSize: '28px',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '15px',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                  }}
                >🤖</div>
                <div 
                  className="chat-title"
                  style={{
                    flex: 1
                  }}
                >
                  <h3 
                    style={{
                      margin: '0 0 5px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}
                  >Asistente Virtual</h3>
                  <p 
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#64748b'
                    }}
                  >Tu ayudante del condominio</p>
                </div>
              </div>

              <div 
                className="chat-messages"
                style={{
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  scrollBehavior: 'smooth'
                }}
              >
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message ${message.type}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div 
                      className="message-content"
                      style={{
                        padding: '12px 18px',
                        borderRadius: message.type === 'user' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
                        backgroundColor: message.type === 'user' 
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                          : 'rgba(241, 245, 249, 0.8)',
                        color: message.type === 'user' ? 'white' : '#1e293b',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: message.type === 'user' 
                          ? '0 4px 15px rgba(99, 102, 241, 0.3)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        background: message.type === 'user' 
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                          : 'rgba(241, 245, 249, 0.8)',
                        border: message.type === 'ai' ? '1px solid rgba(99, 102, 241, 0.1)' : 'none'
                      }}
                    >
                      {message.content}
                    </div>
                    <div 
                      className="message-time"
                      style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginTop: '4px',
                        padding: '0 5px'
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div 
                    className="message ai"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      maxWidth: '85%',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <div 
                      className="message-content typing"
                      style={{
                        padding: '12px 18px',
                        borderRadius: '18px 18px 18px 5px',
                        backgroundColor: 'rgba(241, 245, 249, 0.8)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div 
                        className="typing-dots"
                        style={{
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center'
                        }}
                      >
                        <span 
                          style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#6366f1',
                            borderRadius: '50%',
                            animation: 'typing 1.4s infinite ease-in-out',
                            animationDelay: '0s'
                          }}
                        ></span>
                        <span 
                          style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#6366f1',
                            borderRadius: '50%',
                            animation: 'typing 1.4s infinite ease-in-out',
                            animationDelay: '0.2s'
                          }}
                        ></span>
                        <span 
                          style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#6366f1',
                            borderRadius: '50%',
                            animation: 'typing 1.4s infinite ease-in-out',
                            animationDelay: '0.4s'
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="chat-input-container"
                style={{
                  padding: '25px 30px',
                  borderTop: '2px solid rgba(99, 102, 241, 0.1)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02), rgba(139, 92, 246, 0.02))',
                  borderRadius: '0 0 20px 20px'
                }}
              >
                <div 
                  className="chat-input"
                  style={{
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'flex-end',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      flex: 1,
                      position: 'relative'
                    }}
                  >
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu pregunta sobre el condominio..."
                      rows="1"
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        minHeight: '50px',
                        maxHeight: '120px',
                        padding: '15px 20px',
                        border: '2px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                        resize: 'none',
                        outline: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#1e293b',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.1)',
                        backdropFilter: 'blur(10px)',
                        '::placeholder': {
                          color: '#94a3b8'
                        }
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.2), 0 0 0 3px rgba(99, 102, 241, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                        e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="send-button"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      border: 'none',
                      background: !inputMessage.trim() || isLoading 
                        ? 'linear-gradient(135deg, #94a3b8, #cbd5e1)' 
                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: 'white',
                      fontSize: '18px',
                      cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: !inputMessage.trim() || isLoading 
                        ? '0 4px 15px rgba(148, 163, 184, 0.3)' 
                        : '0 8px 25px rgba(99, 102, 241, 0.4)',
                      transform: 'scale(1)',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (!(!inputMessage.trim() || isLoading)) {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(!inputMessage.trim() || isLoading)) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
                      }
                    }}
                    onMouseDown={(e) => {
                      if (!(!inputMessage.trim() || isLoading)) {
                        e.target.style.transform = 'scale(0.95)';
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!(!inputMessage.trim() || isLoading)) {
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
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
    </>
  );
};

export default Home;