import React, { useState, useEffect } from 'react';
import { getAllPagosDespensa } from '../utils/auth';
import './PagosDespensa.css';

const PagosDespensa = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistorial, setShowHistorial] = useState(false);
  const [datosGrafico, setDatosGrafico] = useState({
    meses: [],
    montos: [],
    totalAnual: 0,
    promedioMensual: 0
  });

  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getAllPagosDespensa();
      
      if (result.success && result.data) {
        setPagos(result.data);
        procesarDatosGrafico(result.data);
      } else {
        setError(result.error || 'Error al cargar los pagos');
        // Datos de prueba para mostrar el dashboard
        const pagosPrueba = [
          { id: 1, fechade_pago: "2025-01-15", monto: 75.0, descripcion: "Pago de expensas Enero 2025" },
          { id: 2, fechade_pago: "2025-02-15", monto: 80.0, descripcion: "Pago de expensas Febrero 2025" },
          { id: 3, fechade_pago: "2025-03-15", monto: 85.0, descripcion: "Pago de expensas Marzo 2025" },
          { id: 4, fechade_pago: "2025-04-15", monto: 90.0, descripcion: "Pago de expensas Abril 2025" },
          { id: 5, fechade_pago: "2025-05-15", monto: 78.0, descripcion: "Pago de expensas Mayo 2025" },
          { id: 6, fechade_pago: "2025-06-15", monto: 82.0, descripcion: "Pago de expensas Junio 2025" }
        ];
        setPagos(pagosPrueba);
        procesarDatosGrafico(pagosPrueba);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const procesarDatosGrafico = (pagosData) => {
    // Agrupar pagos por mes
    const pagosPorMes = {};
    let totalAnual = 0;

    // Inicializar todos los meses con 0
    for (let i = 0; i < 12; i++) {
      pagosPorMes[i] = 0;
    }

    pagosData.forEach(pago => {
      const fecha = new Date(pago.fechade_pago);
      const mes = fecha.getMonth(); // 0-11
      pagosPorMes[mes] += parseFloat(pago.monto);
      totalAnual += parseFloat(pago.monto);
    });

    const montos = Object.values(pagosPorMes);
    const promedioMensual = totalAnual / 12;

    setDatosGrafico({
      meses: mesesNombres,
      montos: montos,
      totalAnual: totalAnual,
      promedioMensual: promedioMensual
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMaxMonto = () => {
    return 2500; // Máximo fijo de $2,500
  };

  if (loading) {
    return (
      <div className="pagos-loading">
        <h2>Cargando datos de pagos...</h2>
      </div>
    );
  }

  return (
    <div className="pagos-despensa-container">
      <div className="pagos-header">
        <h2>Dashboard de Pagos - Despensas</h2>
        <button 
          className="historial-btn"
          onClick={() => setShowHistorial(!showHistorial)}
        >
          {showHistorial ? 'Ver Dashboard' : 'Ver Historial'}
        </button>
      </div>

      {!showHistorial ? (
        <>
          {/* Dashboard con estadísticas */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Anual</h3>
              <p className="stat-value">{formatCurrency(datosGrafico.totalAnual)}</p>
            </div>
            <div className="stat-card">
              <h3>Promedio Mensual</h3>
              <p className="stat-value">{formatCurrency(datosGrafico.promedioMensual)}</p>
            </div>
            <div className="stat-card">
              <h3>Total Pagos</h3>
              <p className="stat-value">{pagos.length}</p>
            </div>
          </div>

          {/* Gráfico de líneas */}
          <div className="chart-container">
            <h3>Evolución de Pagos Mensuales</h3>
            <div className="chart-wrapper">
              <div className="chart-y-axis">
                <div className="y-label">{formatCurrency(getMaxMonto())}</div>
                <div className="y-label">{formatCurrency(getMaxMonto() * 0.75)}</div>
                <div className="y-label">{formatCurrency(getMaxMonto() * 0.5)}</div>
                <div className="y-label">{formatCurrency(getMaxMonto() * 0.25)}</div>
                <div className="y-label">$0</div>
              </div>
              
              <div className="chart-area">
                <svg viewBox="0 0 800 400" className="line-chart">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line 
                      key={i}
                      x1="0" 
                      y1={i * 80} 
                      x2="800" 
                      y2={i * 80} 
                      stroke="#e5e7eb" 
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Line chart */}
                  <polyline
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    points={datosGrafico.montos.map((monto, index) => {
                      const x = (index * 800) / 11;
                      const y = 400 - (monto / getMaxMonto()) * 400;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Data points */}
                  {datosGrafico.montos.map((monto, index) => {
                    const x = (index * 800) / 11;
                    const y = 400 - (monto / getMaxMonto()) * 400;
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#8b5cf6"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
                
                <div className="chart-x-axis">
                  {mesesNombres.map((mes, index) => (
                    <div key={index} className="x-label">{mes.slice(0, 3)}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Historial de pagos */
        <div className="historial-container">
          <h3>Historial de Pagos</h3>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadPagos} className="retry-button">
                Reintentar
              </button>
            </div>
          )}

          <div className="pagos-list">
            {pagos.map((pago) => (
              <div key={pago.id} className="pago-card">
                <div className="pago-header">
                  <h4>Pago #{pago.id}</h4>
                  <span className="pago-monto">{formatCurrency(pago.monto)}</span>
                </div>
                <div className="pago-details">
                  <p><strong>Fecha:</strong> {formatDate(pago.fechade_pago)}</p>
                  <p><strong>Descripción:</strong> {pago.descripcion}</p>
                  {pago.UnidadH && <p><strong>Unidad:</strong> {pago.UnidadH}</p>}
                  {pago.propietario && <p><strong>Propietario:</strong> {pago.propietario}</p>}
                  {pago.is_principal && (
                    <span className="principal-badge">Principal</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PagosDespensa;