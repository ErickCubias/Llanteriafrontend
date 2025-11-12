import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import './MisCotizaciones.css';

// Componente tarjeta memoizado - NO se re-renderiza innecesariamente
const CotizacionCard = React.memo(({ cot, onDelete, onSelect, formatPrice, getEstadoColor, getEstadoIcon }) => {
  const handleDelete = useCallback(() => {
    onDelete(cot.id);
  }, [cot.id, onDelete]);

  const handleSelect = useCallback(() => {
    onSelect(cot);
  }, [cot, onSelect]);

  return (
    <div className="cot-card">
      <div className="card-header">
        <span className="cot-number">Cot #{cot.id}</span>
        <span className={`status-badge ${getEstadoColor(cot.ESTADO)}`}>
          {getEstadoIcon(cot.ESTADO)} {cot.ESTADO}
        </span>
      </div>

      <div className="card-body">
        <div className="card-section">
          <h3>🛞 Llanta</h3>
          <div className="llanta-info">
            <div className="brand-model">
              <strong className="brand">{cot.llanta?.MARCA || 'N/A'}</strong>
              <span className="model">{cot.llanta?.MODELO_LLANTA || ''}</span>
            </div>
            <div className="specs">
              <span className="spec">{cot.llanta?.MEDIDA_LLANTA}</span>
              <span className="spec">{cot.llanta?.MEDIDA_RIN}</span>
            </div>
          </div>
        </div>

        <div className="card-section">
          <h3>💰 Precio</h3>
          <div className="details-grid">
            <div className="detail">
              <label>Cantidad:</label>
              <span>{cot.CANTIDAD}</span>
            </div>
            <div className="detail">
              <label>Unit:</label>
              <span>${formatPrice(cot.PRECIO_UNITARIO)}</span>
            </div>
            <div className="detail">
              <label>Subtotal:</label>
              <strong>${formatPrice(cot.SUBTOTAL)}</strong>
            </div>
            <div className="detail">
              <label>Fecha:</label>
              <span>{new Date(cot.created_at).toLocaleDateString('es-SV')}</span>
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button className="btn-view" onClick={handleSelect}>
            👁️ Ver
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
});

CotizacionCard.displayName = 'CotizacionCard';

export default function MisCotizaciones() {
  const { token, user } = useAuth();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCot, setSelectedCot] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  // Funciones helper - memoizadas para no recrearse en cada render
  const formatPrice = useCallback((value) => {
    if (!value) return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }, []);

  const getEstadoColor = useCallback((estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'status-pendiente';
      case 'CONTACTADO':
        return 'status-contactado';
      case 'CANCELADA':
        return 'status-cancelada';
      default:
        return '';
    }
  }, []);

  const getEstadoIcon = useCallback((estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return '⏳';
      case 'CONTACTADO':
        return '✅';
      case 'CANCELADA':
        return '❌';
      default:
        return '';
    }
  }, []);

  // Cargar cotizaciones - una sola vez
  useEffect(() => {
    if (!token) return;

    const fetchCotizaciones = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:3000/api/cotizaciones',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCotizaciones(response.data || []);
      } catch (error) {
        console.error('Error:', error);
        setCotizaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCotizaciones();
  }, [token]);

  // Manejo de eventos - memoizados
  const handleDeleteCotizacion = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar cotización?')) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/cotizaciones/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCotizaciones(prev => prev.filter(cot => cot.id !== id));
      setSelectedCot(null);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [token]);

  const handleSelectCotizacion = useCallback((cot) => {
    setSelectedCot(cot);
  }, []);

  // Memoizar el JSX de las tarjetas
  const cotizacionesCards = useMemo(() => {
    return cotizaciones.map(cot => (
      <CotizacionCard
        key={cot.id}
        cot={cot}
        onDelete={handleDeleteCotizacion}
        onSelect={handleSelectCotizacion}
        formatPrice={formatPrice}
        getEstadoColor={getEstadoColor}
        getEstadoIcon={getEstadoIcon}
      />
    ));
  }, [cotizaciones, handleDeleteCotizacion, handleSelectCotizacion, formatPrice, getEstadoColor, getEstadoIcon]);

  return (
    <div className="mis-cotizaciones">
      <div className="page-header">
        <h1>📋 Mis Cotizaciones</h1>
        <p>Aquí puedes ver todas tus solicitudes de cotización y su estado</p>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : cotizaciones.length > 0 ? (
        <div className="cotizaciones-grid">
          {cotizacionesCards}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No tienes cotizaciones</h2>
          <p>Comienza a cotizar llantas desde nuestro catálogo</p>
          <a href="/llantas" className="btn-browse">
            Explorar Llantas
          </a>
        </div>
      )}

      {/* Modal Detalle - Simple y rápido */}
      {selectedCot && (
        <div className="modal-overlay" onClick={() => setSelectedCot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cotización #{selectedCot.id}</h2>
              <button className="modal-close" onClick={() => setSelectedCot(null)}>
                ✕
              </button>
            </div>

            <div className="detail-content">
              <div className="detail-section">
                <h3>🛞 Llanta</h3>
                <div className="llanta-details">
                  <div className="brand-section">{selectedCot.llanta?.MARCA}</div>
                  <div className="specs-grid">
                    <div className="spec-box">
                      <label>Modelo</label>
                      <span>{selectedCot.llanta?.MODELO_LLANTA}</span>
                    </div>
                    <div className="spec-box">
                      <label>Medida</label>
                      <span>{selectedCot.llanta?.MEDIDA_LLANTA}</span>
                    </div>
                    <div className="spec-box">
                      <label>Rin</label>
                      <span>{selectedCot.llanta?.MEDIDA_RIN}</span>
                    </div>
                    <div className="spec-box">
                      <label>Vehículo</label>
                      <span>{selectedCot.llanta?.TIPO_VEHICULO}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>💰 Resumen</h3>
                <div className="summary">
                  <div className="summary-item">
                    <span>Cantidad:</span>
                    <strong>{selectedCot.CANTIDAD}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Precio Unit:</span>
                    <strong>${formatPrice(selectedCot.PRECIO_UNITARIO)}</strong>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <strong>${formatPrice(selectedCot.SUBTOTAL)}</strong>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>🔔 Estado</h3>
                <div className="status-info">
                  <div className={`status-indicator ${getEstadoColor(selectedCot.ESTADO)}`}>
                    {getEstadoIcon(selectedCot.ESTADO)}
                  </div>
                  <div>
                    <p className="status-text">{selectedCot.ESTADO}</p>
                  </div>
                </div>
              </div>

              {selectedCot.NOTAS && (
                <div className="detail-section">
                  <h3>📝 Notas</h3>
                  <div className="notes-panel">
                    {selectedCot.NOTAS}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-contact">📞 Contactar</button>
                <button className="btn-close-modal" onClick={() => setSelectedCot(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
