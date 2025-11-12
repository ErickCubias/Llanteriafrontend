import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LlantaDetallModal from '../../components/llantas/LlantaDetallModal';
import './Llantas.css';

// Datos mock para demostración cuando el API no está disponible
const mockLlantas = [
  {
    id: 1,
    MARCA: 'Michelin',
    MODELO_LLANTA: 'Pilot Sport 4',
    MEDIDA_LLANTA: '205/55R16',
    MEDIDA_RIN: '16"',
    TIPO_VEHICULO: 'Sedán',
    CONDICION: 'nueva',
    PRECIO: 450.00,
    STOCK: 12,
    IMAGEN: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=400',
  },
  {
    id: 2,
    MARCA: 'Bridgestone',
    MODELO_LLANTA: 'Turanza EL400',
    MEDIDA_LLANTA: '185/65R15',
    MEDIDA_RIN: '15"',
    TIPO_VEHICULO: 'Sedán',
    CONDICION: 'nueva',
    PRECIO: 380.00,
    STOCK: 8,
    IMAGEN: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=400',
  },
  {
    id: 3,
    MARCA: 'Continental',
    MODELO_LLANTA: 'ContiProContact TX',
    MEDIDA_LLANTA: '215/60R17',
    MEDIDA_RIN: '17"',
    TIPO_VEHICULO: 'SUV',
    CONDICION: 'nueva',
    PRECIO: 520.00,
    STOCK: 5,
    IMAGEN: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=400',
  },
  {
    id: 4,
    MARCA: 'Goodyear',
    MODELO_LLANTA: 'Assurance MaxLife',
    MEDIDA_LLANTA: '205/60R16',
    MEDIDA_RIN: '16"',
    TIPO_VEHICULO: 'Sedán',
    CONDICION: 'reacondicionada',
    PRECIO: 280.00,
    STOCK: 15,
    IMAGEN: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=400',
  },
  {
    id: 5,
    MARCA: 'Pirelli',
    MODELO_LLANTA: 'Cinturato P7',
    MEDIDA_LLANTA: '225/45R18',
    MEDIDA_RIN: '18"',
    TIPO_VEHICULO: 'Deportivo',
    CONDICION: 'nueva',
    PRECIO: 680.00,
    STOCK: 6,
    IMAGEN: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=400',
  },
  {
    id: 6,
    MARCA: 'Dunlop',
    MODELO_LLANTA: 'Sport Maxx',
    MEDIDA_LLANTA: '195/65R15',
    MEDIDA_RIN: '15"',
    TIPO_VEHICULO: 'Sedán',
    CONDICION: 'nueva',
    PRECIO: 320.00,
    STOCK: 10,
    IMAGEN: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=400',
  },
];

export default function Llantas() {
  const [llantas, setLlantas] = useState([]);
  const [filteredLlantas, setFilteredLlantas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLlanta, setSelectedLlanta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMarca, setFilterMarca] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  useEffect(() => {
    fetchLlantas();
  }, []);

  const fetchLlantas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/llantas');
      // La API puede devolver un array plano o un objeto paginado { data: [...] }
      let items = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) items = response.data;
        else if (Array.isArray(response.data.data)) items = response.data.data;
        else items = [];
      }
      setLlantas(items);
      setFilteredLlantas(items);
    } catch (error) {
      console.error('Error fetching llantas:', error);
      setLlantas(mockLlantas);
      setFilteredLlantas(mockLlantas);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = llantas;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter((llanta) => {
          const marca = (llanta.MARCA || '').toLowerCase();
          const modelo = (llanta.MODELO_LLANTA || '').toLowerCase();
          const medida = (llanta.MEDIDA_LLANTA || '').toLowerCase();
          return marca.includes(term) || modelo.includes(term) || medida.includes(term);
        });
      }

      if (filterMarca) {
        filtered = filtered.filter((llanta) => llanta.MARCA === filterMarca);
      }

      if (filterTipo) {
        filtered = filtered.filter((llanta) => llanta.TIPO_VEHICULO === filterTipo);
      }

      setFilteredLlantas(filtered);
    };

    applyFilters();
  }, [searchTerm, filterMarca, filterTipo, llantas]);

  const marcas = [...new Set(llantas.map((l) => l.MARCA))].sort();
  const tipos = [...new Set(llantas.map((l) => l.TIPO_VEHICULO))].sort();

  return (
    <div className="llantas-page">
      {/* Hero Header Moderno */}
      <section className="catalog-hero" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        color: '#fff',
        borderRadius: '0 0 24px 24px',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Catálogo de Llantas</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>Encuentra la llanta perfecta para tu vehículo</p>
      </section>

      <section className="catalog-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Barra de búsqueda y filtros mejorada */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '2rem',
        }}>
          {/* Búsqueda principal */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              border: '2px solid transparent',
              transition: 'all 0.3s',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              <i className="fas fa-search" style={{ color: '#667eea', fontSize: '1.2rem', marginRight: '1rem' }}></i>
              <input
                type="text"
                placeholder="Buscar por marca, modelo, medida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#333',
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* Filtros en fila */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label htmlFor="marca" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#667eea', marginBottom: '0.5rem' }}>
                MARCA:
              </label>
              <select
                id="marca"
                value={filterMarca}
                onChange={(e) => setFilterMarca(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  background: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <option value="">Todas las marcas</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label htmlFor="tipo" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#667eea', marginBottom: '0.5rem' }}>
                TIPO DE VEHÍCULO:
              </label>
              <select
                id="tipo"
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  background: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <option value="">Todos los tipos</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMarca('');
                setFilterTipo('');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <i className="fas fa-redo"></i> Limpiar
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <p style={{ fontSize: '1rem', color: '#6c757d', fontWeight: 500 }}>
            <strong style={{ color: '#667eea' }}>{filteredLlantas.length}</strong> {filteredLlantas.length === 1 ? 'llanta encontrada' : 'llantas encontradas'}
          </p>
        </div>

        {/* Grid de llantas */}
        {loading ? (
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Cargando catálogo...</p>
          </div>
        ) : filteredLlantas.length > 0 ? (
          <div className="llantas-grid">
              {filteredLlantas.map((llanta) => (
                <div key={llanta.id} className="llanta-card">
                  <div className="llanta-image">
                    {llanta.IMAGEN ? (
                      <img src={llanta.IMAGEN} alt={llanta.MARCA} />
                    ) : (
                      <div className="image-placeholder">
                        <i className="fas fa-tire"></i>
                      </div>
                    )}
                  </div>
                  <div className="llanta-info">
                    <h3 className="llanta-marca">{llanta.MARCA}</h3>
                    <p className="llanta-modelo">{llanta.MODELO_LLANTA}</p>

                    <div className="spec-badges">
                      <span className="spec-badge">
                        <i className="fas fa-ruler"></i> {llanta.MEDIDA_LLANTA}
                      </span>
                      <span className="spec-badge">
                        <i className="fas fa-ring"></i> {llanta.MEDIDA_RIN}
                      </span>
                    </div>

                    <div className="llanta-details">
                      <span className="detail-item">
                        <i className="fas fa-car"></i> {llanta.TIPO_VEHICULO}
                      </span>
                      <span className="detail-item">
                        <i className="fas fa-check-circle"></i> {llanta.CONDICION}
                      </span>
                    </div>

                    <div className="llanta-footer">
                      <div className="price-section">
                        <span className="price">
                          ${typeof llanta.PRECIO === 'number' ? llanta.PRECIO.toFixed(2) : 'N/A'}
                        </span>
                      </div>
                      <button
                        className="btn-detalles"
                        onClick={() => setSelectedLlanta(llanta)}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p>No se encontraron llantas que coincidan con los filtros seleccionados</p>
            </div>
          )}
      </section>

      {selectedLlanta && (
        <LlantaDetallModal
          llanta={selectedLlanta}
          onClose={() => setSelectedLlanta(null)}
        />
      )}
    </div>
  );
}
