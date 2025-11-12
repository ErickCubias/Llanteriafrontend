import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import './AdminLlantas.css';
import { invalidateCache } from '../../hooks/useCachedFetch';

const AdminLlantas = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [llantas, setLlantas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isServerPaginated, setIsServerPaginated] = useState(false);

  // Verificar que sea ADMIN
  useEffect(() => {
    if (user && user.ROL !== 'ADMIN') {
      setError('❌ No tienes permisos para acceder a esta sección. Solo ADMIN.');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    MARCA: '',
    MODELO_LLANTA: '',
    MEDIDA_RIN: '',
    MEDIDA_LLANTA: '',
    PRECIO: '',
    IMAGEN: '',
    CONDICION: 'nueva',
    TIPO_VEHICULO: '',
    STOCK: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchLlantas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/llantas?page=' + currentPage + '&per_page=' + perPage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Si el response es paginado (tiene data y last_page), usarlo; si no, asumir response plano
      if (response.data && response.data.data && response.data.last_page !== undefined) {
        // API devolvió paginación (estructura tipo Laravel)
        setLlantas(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
        setTotalRecords(response.data.total || (response.data.data ? response.data.data.length : 0));
        setIsServerPaginated(true);
      } else if (Array.isArray(response.data)) {
        // Fallback: array plano del servidor (no paginado)
        setLlantas(response.data);
        setTotalRecords(response.data.length);
        setTotalPages(Math.max(1, Math.ceil(response.data.length / perPage)));
        setIsServerPaginated(false);
      } else if (response.data && Array.isArray(response.data.data)) {
        // Caso genérico donde data es array pero no hay last_page
        setLlantas(response.data.data);
        setTotalRecords(response.data.data.length);
        setTotalPages(Math.max(1, Math.ceil(response.data.data.length / perPage)));
        setIsServerPaginated(false);
      } else {
        setLlantas([]);
        setTotalRecords(0);
        setTotalPages(1);
        setIsServerPaginated(false);
      }
      setError('');
    } catch (err) {
      setError('Error cargando llantas: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, perPage]);

  // Cargar llantas al montar
  useEffect(() => {
    fetchLlantas();
  }, [fetchLlantas]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePerPageChange = (e) => {
    const v = parseInt(e.target.value, 10) || 10;
    setPerPage(v);
    setCurrentPage(1);
  };

  const handleGoToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  // Devuelve un arreglo con las páginas a mostrar en la UI, con ventana máxima de 6
  const getPageRange = () => {
    const maxButtons = 6;
    const total = Math.max(1, totalPages);
    if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + maxButtons - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxButtons + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // si el campo IMAGEN se edita como URL, actualizar preview
    if (name === 'IMAGEN') {
      setPreviewUrl(value);
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Clear the IMAGEN text field to avoid confusion
      setFormData({ ...formData, IMAGEN: '' });
    } else {
      setPreviewUrl(formData.IMAGEN || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedFile) {
        const fd = new FormData();
        Object.keys(formData).forEach((key) => {
          // agregar solo campos no vacíos (PRECIO/STOCK pueden ser 0)
          if (formData[key] !== undefined && formData[key] !== null) {
            fd.append(key, formData[key]);
          }
        });
        fd.append('IMAGEN', selectedFile);

        // DEBUG: listar contenido FormData en consola para verificar envio
        try {
          for (let pair of fd.entries()) {
            console.log('FormData entry:', pair[0], pair[1]);
          }
        } catch (e) {
          console.log('No se pudo listar FormData entries', e);
        }

        if (editingId) {
          // Para actualizar con multipart en algunos servidores, usar POST + _method=PATCH
          fd.append('_method', 'PATCH');
          await axios.post(`http://localhost:3000/api/llantas/${editingId}`, fd, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSuccess('Llanta actualizada exitosamente');
          setEditingId(null);
        } else {
          // Crear nueva llanta con archivo
          await axios.post('http://localhost:3000/api/llantas', fd, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSuccess('Llanta creada exitosamente');
        }
      } else {
        // No file: enviar JSON (IMAGEN puede ser URL o vacío)
        if (editingId) {
          await axios.patch(
            `http://localhost:3000/api/llantas/${editingId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSuccess('Llanta actualizada exitosamente');
          setEditingId(null);
        } else {
          await axios.post('http://localhost:3000/api/llantas', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSuccess('Llanta creada exitosamente');
        }
      }

      // Limpiar formulario
      setFormData({
        MARCA: '',
        MODELO_LLANTA: '',
        MEDIDA_RIN: '',
        MEDIDA_LLANTA: '',
        PRECIO: '',
        IMAGEN: '',
        CONDICION: 'nueva',
        TIPO_VEHICULO: '',
        STOCK: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
      setShowForm(false);

      // Invalidate shared cache for llantas so other components using useCachedFetch
      // will refetch when needed, then reload the admin list.
      try {
        invalidateCache('/api/llantas');
      } catch (e) {
        // non-fatal: don't block UI on cache helper errors
        console.warn('invalidateCache failed', e);
      }
      // Recargar llantas
      fetchLlantas();
    } catch (err) {
      setError('Error guardando llanta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (llanta) => {
    setFormData(llanta);
    setEditingId(llanta.id);
    setShowForm(true);
  };

  // abrir el formulario en modo "crear" y limpiar estados
  const handleAddNew = () => {
    setFormData({
      MARCA: '',
      MODELO_LLANTA: '',
      MEDIDA_RIN: '',
      MEDIDA_LLANTA: '',
      PRECIO: '',
      IMAGEN: '',
      CONDICION: 'nueva',
      TIPO_VEHICULO: '',
      STOCK: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta llanta?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/llantas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Llanta eliminada exitosamente');
      try {
        invalidateCache('/api/llantas');
      } catch (e) {
        console.warn('invalidateCache failed', e);
      }
      fetchLlantas();
    } catch (err) {
      setError('Error eliminando llanta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      MARCA: '',
      MODELO_LLANTA: '',
      MEDIDA_RIN: '',
      MEDIDA_LLANTA: '',
      PRECIO: '',
      IMAGEN: '',
      CONDICION: 'nueva',
      TIPO_VEHICULO: '',
      STOCK: '',
    });
  };

  return (
    <div className="admin-llantas-container">
      <div className="row">
        <div className="col-12">
          <div className="admin-header">
            <h1 className="admin-title">
              <i className="fas fa-tire"></i> Gestión de Llantas
            </h1>
            {!showForm && (
              <button
                className="btn-agregar-nueva"
                onClick={handleAddNew}
              >
                <i className="fas fa-plus"></i> Agregar Nueva Llanta
              </button>
            )}
          </div>

          {error && (
            <div className="alert-custom alert-danger">
              <i className="fas fa-exclamation-circle alert-icon"></i>
              <div className="alert-content">{error}</div>
              <button
                className="alert-close"
                onClick={() => setError('')}
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="alert-custom alert-success">
              <i className="fas fa-check-circle alert-icon"></i>
              <div className="alert-content">{success}</div>
              <button
                className="alert-close"
                onClick={() => setSuccess('')}
              >
                ×
              </button>
            </div>
          )}

          {!showForm ? (
            <div>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p className="loading-text">Cargando llantas...</p>
                </div>
              ) : (
                <div>
                  {llantas.length > 0 ? (
                    <>
                      <div className="table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Marca</th>
                              <th>Modelo</th>
                              <th>Medida Rin</th>
                              <th>Medida Llanta</th>
                              <th>Precio</th>
                              <th>Condición</th>
                              <th>Tipo Vehículo</th>
                              <th>Stock</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(
                              // Si la API ya paginó en servidor, `llantas` contiene solo la página actual.
                              // Si no, aplicamos slice para paginar en cliente.
                              (isServerPaginated ? llantas : llantas.slice((currentPage - 1) * perPage, currentPage * perPage))
                            ).map((llanta) => (
                              <tr key={llanta.id}>
                                <td><strong>{llanta.MARCA}</strong></td>
                                <td>{llanta.MODELO_LLANTA}</td>
                                <td>{llanta.MEDIDA_RIN}</td>
                                <td>{llanta.MEDIDA_LLANTA}</td>
                                <td><strong>${parseFloat(llanta.PRECIO).toFixed(2)}</strong></td>
                                <td>
                                  <span className={llanta.CONDICION === 'nueva' ? 'badge-nueva' : 'badge-reacondicionada'}>
                                    {llanta.CONDICION}
                                  </span>
                                </td>
                                <td>{llanta.TIPO_VEHICULO}</td>
                                <td>{llanta.STOCK}</td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      className="btn-action btn-edit"
                                      onClick={() => handleEdit(llanta)}
                                      title="Editar"
                                    >
                                      {/* Pencil / editar SVG */}
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
                                        <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor" />
                                      </svg>
                                    </button>
                                    <button
                                      className="btn-action btn-delete"
                                      onClick={() => handleDelete(llanta.id)}
                                      title="Eliminar"
                                    >
                                      {/* Trash / eliminar SVG */}
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z" fill="currentColor" />
                                        <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Paginación */}
                      {totalPages > 1 && (
                        <div className="pagination-container">
                          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            Mostrar
                            <select value={perPage} onChange={handlePerPageChange} style={{padding: '6px 8px', borderRadius: '6px', border: '1px solid #e5e7eb'}}>
                              <option value={5}>5</option>
                              <option value={9}>9</option>
                              <option value={25}>25</option>
                              <option value={50}>50</option>
                            </select>
                            por página
                          </label>

                          <button
                            className="btn-pagination"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                          >
                            ‹ Anterior
                          </button>

                          {/* Page numbers (si son muchas páginas, mostrar un subset) */}
                          <div className="page-numbers">
                            {(() => {
                              const pages = getPageRange();
                              const first = pages[0];
                              const last = pages[pages.length - 1];
                              const elems = [];

                              // Si el primer visible no es 1, mostrar 1 y posible ellipsis
                              if (first > 1) {
                                elems.push(
                                  <button key={1} className={`page-number ${1 === currentPage ? 'active' : ''}`} onClick={() => handleGoToPage(1)}>1</button>
                                );
                                if (first > 2) elems.push(<span key="start-ellipsis" className="page-ellipsis">…</span>);
                              }

                              pages.forEach((p) => {
                                elems.push(
                                  <button key={p} className={`page-number ${p === currentPage ? 'active' : ''}`} onClick={() => handleGoToPage(p)} aria-current={p === currentPage}>{p}</button>
                                );
                              });

                              // Si el último visible no es totalPages, mostrar ellipsis y último
                              if (last < totalPages) {
                                if (last < totalPages - 1) elems.push(<span key="end-ellipsis" className="page-ellipsis">…</span>);
                                elems.push(<button key={totalPages} className={`page-number ${totalPages === currentPage ? 'active' : ''}`} onClick={() => handleGoToPage(totalPages)}>{totalPages}</button>);
                              }

                              return elems;
                            })()}
                          </div>

                          <span className="pagination-info">
                            Página {currentPage} de {totalPages} · Total: {totalRecords} registros
                          </span>

                          <button
                            className="btn-pagination"
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages}
                          >
                            Siguiente ›
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-state-admin">
                      <i className="fas fa-inbox"></i>
                      <p>No hay llantas registradas. ¡Comienza agregando una nueva!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  {editingId ? 'Editar Llanta' : 'Agregar Nueva Llanta'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MARCA" className="form-label">
                        Marca *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MARCA"
                        name="MARCA"
                        value={formData.MARCA}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MODELO_LLANTA" className="form-label">
                        Modelo Llanta
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MODELO_LLANTA"
                        name="MODELO_LLANTA"
                        value={formData.MODELO_LLANTA}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MEDIDA_RIN" className="form-label">
                        Medida Rin
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MEDIDA_RIN"
                        name="MEDIDA_RIN"
                        value={formData.MEDIDA_RIN}
                        onChange={handleInputChange}
                        placeholder="ej: 16, 17, 18"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="MEDIDA_LLANTA" className="form-label">
                        Medida Llanta
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MEDIDA_LLANTA"
                        name="MEDIDA_LLANTA"
                        value={formData.MEDIDA_LLANTA}
                        onChange={handleInputChange}
                        placeholder="ej: 195/65R15"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="PRECIO" className="form-label">
                        Precio *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="PRECIO"
                        name="PRECIO"
                        step="0.01"
                        value={formData.PRECIO}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="STOCK" className="form-label">
                        Stock *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="STOCK"
                        name="STOCK"
                        value={formData.STOCK}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="CONDICION" className="form-label">
                        Condición
                      </label>
                      <select
                        className="form-select"
                        id="CONDICION"
                        name="CONDICION"
                        value={formData.CONDICION}
                        onChange={handleInputChange}
                      >
                        <option value="nueva">Nueva</option>
                        <option value="reacondicionada">Reacondicionada</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="TIPO_VEHICULO" className="form-label">
                        Tipo de Vehículo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="TIPO_VEHICULO"
                        name="TIPO_VEHICULO"
                        value={formData.TIPO_VEHICULO}
                        onChange={handleInputChange}
                        placeholder="ej: Auto, Camión, Moto"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="IMAGEN" className="form-label">
                      Adjuntar imagen (archivo) o URL
                    </label>

                    <div className="mb-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="IMAGEN_FILE"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="mb-2">
                      <input
                        type="url"
                        className="form-control"
                        id="IMAGEN"
                        name="IMAGEN"
                        value={formData.IMAGEN}
                        onChange={handleInputChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                      <small className="form-text text-muted">Si adjuntas un archivo, la URL será ignorada.</small>
                    </div>

                    {previewUrl ? (
                      <div className="mt-2">
                        <img src={previewUrl} alt="preview" style={{maxWidth: '240px', maxHeight: '160px', borderRadius: '8px', border: '1px solid #e9ecef'}} />
                      </div>
                    ) : null}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLlantas;
