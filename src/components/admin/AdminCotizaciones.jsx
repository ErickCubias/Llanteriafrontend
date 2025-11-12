import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import './AdminCotizaciones.css';

export default function AdminCotizaciones() {
  const { token, user } = useAuth();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filteredCotizaciones, setFilteredCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState('');
  const [selectedCot, setSelectedCot] = useState(null);
  const [notas, setNotas] = useState('');
  const [editingCotId, setEditingCotId] = useState(null);

  // Verificar que es admin
  useEffect(() => {
    if (user && user.ROL !== 'ADMIN') {
      window.location.href = '/';
    }
  }, [user]);

  // Cargar cotizaciones
  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:3000/api/cotizaciones/admin/todas',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCotizaciones(response.data);
      setFilteredCotizaciones(response.data);
    } catch (error) {
      console.error('Error fetching cotizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por estado
  useEffect(() => {
    if (!filterEstado) {
      setFilteredCotizaciones(cotizaciones);
    } else {
      setFilteredCotizaciones(
        cotizaciones.filter((cot) => cot.ESTADO === filterEstado)
      );
    }
  }, [filterEstado, cotizaciones]);

  // Actualizar cotización
  const handleUpdateCotizacion = async (id, estado) => {
    try {
      const notasText = notas || '';
      await axios.patch(
        `http://localhost:3000/api/cotizaciones/${id}`,
        {
          ESTADO: estado,
          NOTAS: notasText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar estado local
      const updated = cotizaciones.map((cot) =>
        cot.id === id ? { ...cot, ESTADO: estado, NOTAS: notasText } : cot
      );
      setCotizaciones(updated);
      setSelectedCot(null);
      setNotas('');
      setEditingCotId(null);
    } catch (error) {
      console.error('Error actualizando cotización:', error);
    }
  };

  // Eliminar cotización
  const handleDeleteCotizacion = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      try {
        await axios.delete(
          `http://localhost:3000/api/cotizaciones/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCotizaciones(cotizaciones.filter((cot) => cot.id !== id));
        setSelectedCot(null);
      } catch (error) {
        console.error('Error eliminando cotización:', error);
      }
    }
  };

  // Abrir modal de detalle
  const openDetail = (cot) => {
    setSelectedCot(cot);
    setNotas(cot.NOTAS || '');
    setEditingCotId(null);
  };

  const getEstadoColor = (estado) => {
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
  };

  return (
    <div className="admin-cotizaciones">
      <div className="admin-header">
        <h1>📊 Dashboard de Cotizaciones</h1>
        <p>Administra todas las cotizaciones de los clientes</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Filtrar por Estado:</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONTACTADO">Contactado</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{cotizaciones.length}</span>
          </div>
          <div className="stat-card pendiente">
            <span className="stat-label">Pendientes:</span>
            <span className="stat-value">
              {cotizaciones.filter((c) => c.ESTADO === 'PENDIENTE').length}
            </span>
          </div>
          <div className="stat-card contactado">
            <span className="stat-label">Contactadas:</span>
            <span className="stat-value">
              {cotizaciones.filter((c) => c.ESTADO === 'CONTACTADO').length}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando cotizaciones...</div>
      ) : filteredCotizaciones.length > 0 ? (
        <div className="cotizaciones-table-container">
          <table className="cotizaciones-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Llanta</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCotizaciones.map((cot) => (
                <tr key={cot.id} className="cot-row">
                  <td className="cot-id">#{cot.id}</td>
                  <td className="cot-cliente">
                    {cot.usuario?.NOMBRE} {cot.usuario?.APELLIDO}
                  </td>
                  <td className="cot-email">{cot.usuario?.email}</td>
                  <td className="cot-llanta">
                    <strong>{cot.llanta?.MARCA}</strong>
                    <br />
                    <small>{cot.llanta?.MODELO_LLANTA}</small>
                  </td>
                  <td className="cot-cantidad">{cot.CANTIDAD}</td>
                  <td className="cot-subtotal">
                    ${cot.SUBTOTAL.toFixed(2)}
                  </td>
                  <td className="cot-estado">
                    <span className={`status-badge ${getEstadoColor(cot.ESTADO)}`}>
                      {cot.ESTADO}
                    </span>
                  </td>
                  <td className="cot-fecha">
                    {new Date(cot.created_at).toLocaleDateString()}
                  </td>
                  <td className="cot-acciones">
                    <button
                      className="btn-detail"
                      onClick={() => openDetail(cot)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCotizacion(cot.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-results">
          No hay cotizaciones que coincidan con los filtros seleccionados
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedCot && (
        <div className="modal-overlay" onClick={() => setSelectedCot(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Cotización #{selectedCot.id}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedCot(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-section">
              <h3>📋 Información del Cliente</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre:</label>
                  <p>
                    {selectedCot.usuario?.NOMBRE} {selectedCot.usuario?.APELLIDO}
                  </p>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <p>{selectedCot.usuario?.email}</p>
                </div>
                <div className="info-item">
                  <label>Teléfono:</label>
                  <p>{selectedCot.usuario?.TELEFONO || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Fecha Cotización:</label>
                  <p>{new Date(selectedCot.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>🛞 Detalles de la Llanta</h3>
              <div className="llanta-box">
                <div className="llanta-brand">{selectedCot.llanta?.MARCA}</div>
                <div className="llanta-specs">
                  <div className="spec-item">
                    <label>Modelo:</label>
                    <span>{selectedCot.llanta?.MODELO_LLANTA}</span>
                  </div>
                  <div className="spec-item">
                    <label>Medida Llanta:</label>
                    <span>{selectedCot.llanta?.MEDIDA_LLANTA}</span>
                  </div>
                  <div className="spec-item">
                    <label>Medida Rin:</label>
                    <span>{selectedCot.llanta?.MEDIDA_RIN}</span>
                  </div>
                  <div className="spec-item">
                    <label>Tipo Vehículo:</label>
                    <span>{selectedCot.llanta?.TIPO_VEHICULO}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>💰 Resumen</h3>
              <div className="summary-table">
                <div className="summary-row">
                  <span>Cantidad:</span>
                  <strong>{selectedCot.CANTIDAD}</strong>
                </div>
                <div className="summary-row">
                  <span>Precio Unitario:</span>
                  <strong>${selectedCot.PRECIO_UNITARIO.toFixed(2)}</strong>
                </div>
                <div className="summary-row total">
                  <span>Subtotal:</span>
                  <strong>${selectedCot.SUBTOTAL.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>📝 Notas del Administrador</h3>
              {editingCotId === selectedCot.id ? (
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agregar notas sobre esta cotización..."
                  className="notes-textarea"
                ></textarea>
              ) : (
                <div className="notes-display">
                  {selectedCot.NOTAS ? (
                    <p>{selectedCot.NOTAS}</p>
                  ) : (
                    <p className="no-notes">Sin notas</p>
                  )}
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3>🔄 Cambiar Estado</h3>
              <div className="estado-buttons">
                <button
                  className={`estado-btn ${
                    selectedCot.ESTADO === 'PENDIENTE' ? 'active' : ''
                  } pendiente`}
                  onClick={() => {
                    setEditingCotId(selectedCot.id);
                    handleUpdateCotizacion(selectedCot.id, 'PENDIENTE');
                  }}
                >
                  Pendiente
                </button>
                <button
                  className={`estado-btn ${
                    selectedCot.ESTADO === 'CONTACTADO' ? 'active' : ''
                  } contactado`}
                  onClick={() => {
                    setEditingCotId(selectedCot.id);
                    handleUpdateCotizacion(selectedCot.id, 'CONTACTADO');
                  }}
                >
                  Contactado
                </button>
                <button
                  className={`estado-btn ${
                    selectedCot.ESTADO === 'CANCELADA' ? 'active' : ''
                  } cancelada`}
                  onClick={() => {
                    setEditingCotId(selectedCot.id);
                    handleUpdateCotizacion(selectedCot.id, 'CANCELADA');
                  }}
                >
                  Cancelada
                </button>
              </div>
            </div>

            <div className="modal-actions">
              {editingCotId === selectedCot.id ? (
                <>
                  <button
                    className="btn-save"
                    onClick={() => {
                      handleUpdateCotizacion(selectedCot.id, selectedCot.ESTADO);
                    }}
                  >
                    💾 Guardar Cambios
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setEditingCotId(null);
                      setNotas(selectedCot.NOTAS || '');
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-edit"
                    onClick={() => setEditingCotId(selectedCot.id)}
                  >
                    ✏️ Editar Notas
                  </button>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedCot(null)}
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
