import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import './LlantaDetallModal.css';

export default function LlantaDetallModal({ llanta, onClose }) {
  const { token } = useAuth();
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleCotizar = async () => {
    if (!token) {
      setMessageType('warning');
      setMessage('Debes iniciar sesión para cotizar');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://localhost:3000/api/cotizaciones',
        {
          LLANTA_ID: llanta.id,
          CANTIDAD: cantidad,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessageType('success');
      setMessage('✅ Cotización solicitada exitosamente. El admin se pondrá en contacto pronto.');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 3000);
    } catch (err) {
      setMessageType('error');
      setMessage('❌ Error al procesar la cotización: ' + (err.response?.data?.mensaje || err.message));
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-content">
          {/* IMAGEN */}
          <div className="modal-image-section">
            {llanta.IMAGEN ? (
              <img
                src={llanta.IMAGEN}
                alt={llanta.MARCA}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="modal-placeholder">
                <i className="fas fa-tire"></i>
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="modal-info-section">
            <h2 className="modal-title">{llanta.MARCA}</h2>
            {llanta.MODELO_LLANTA && (
              <p className="modal-modelo">{llanta.MODELO_LLANTA}</p>
            )}

            {/* ESPECIFICACIONES */}
            <div className="modal-specs">
              <div className="spec-item">
                <span className="spec-label">Medida Llanta:</span>
                <span className="spec-value">{llanta.MEDIDA_LLANTA || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Medida Rin:</span>
                <span className="spec-value">{llanta.MEDIDA_RIN || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Tipo Vehículo:</span>
                <span className="spec-value">{llanta.TIPO_VEHICULO || 'General'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Condición:</span>
                <span className={`spec-value condicion ${llanta.CONDICION}`}>
                  {llanta.CONDICION === 'nueva' ? '✨ Nueva' : '♻️ Reacondicionada'}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Stock Disponible:</span>
                <span
                  className={`spec-value stock ${
                    llanta.STOCK > 0 ? 'disponible' : 'agotado'
                  }`}
                >
                  {llanta.STOCK} unidades
                </span>
              </div>
            </div>

            {/* PRECIO Y ACCIONES */}
            <div className="modal-actions">
              <div className="price-section">
                <span className="price-label">Precio Unitario:</span>
                <span className="price-value">
                  ${parseFloat(llanta.PRECIO).toFixed(2)}
                </span>
              </div>

              {/* CANTIDAD */}
              {llanta.STOCK > 0 && (
                <div className="cantidad-section">
                  <label htmlFor="cantidad">Cantidad:</label>
                  <div className="cantidad-controls">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={cantidad <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input
                      id="cantidad"
                      type="number"
                      min="1"
                      max={llanta.STOCK}
                      value={cantidad}
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                    />
                    <button
                      onClick={() => setCantidad(Math.min(llanta.STOCK, cantidad + 1))}
                      disabled={cantidad >= llanta.STOCK}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* SUBTOTAL */}
              <div className="subtotal-section">
                <span>Subtotal:</span>
                <span className="subtotal-value">
                  ${(parseFloat(llanta.PRECIO) * cantidad).toFixed(2)}
                </span>
              </div>

              {/* BOTÓN COTIZAR */}
              <button
                className="btn-cotizar"
                onClick={handleCotizar}
                disabled={loading || llanta.STOCK === 0}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Procesando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Enviar Cotización
                  </>
                )}
              </button>

              {/* MENSAJE */}
              {message && (
                <div className={`message-box ${messageType}`}>
                  {message}
                </div>
              )}

              {/* INFO ADICIONAL */}
              {!token && (
                <p className="info-text">
                  <i className="fas fa-info-circle"></i> Inicia sesión para enviar una cotización
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
