import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LlantaDetallModal from '../../components/llantas/LlantaDetallModal';
import './Home.css';

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

const testimonios = [
  {
    id: 1,
    nombre: 'Carlos Mendoza',
    cargo: 'Cliente Premium',
    texto: 'Excelente servicio y llantas de muy buena calidad. Muy recomendado.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    nombre: 'María García',
    cargo: 'Transportista',
    texto: 'Las mejores llantas del mercado. Durabilidad garantizada.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    nombre: 'Juan López',
    cargo: 'Gerente de Flota',
    texto: 'Servicio profesional y atención al cliente de primera categoría.',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
];

export default function Home() {
  const [llantas, setLlantas] = useState([]);
  const [filteredLlantas, setFilteredLlantas] = useState([]);
  const [selectedLlanta, setSelectedLlanta] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrusel de imágenes hero - imágenes de carros y llantas
  const heroImages = [
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600',
    'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=1600',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1600',
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    fetchLlantas();
  }, []);

  // Carrusel hero automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

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
      // Si falla, usar datos mock para demostración
      console.log('Usando datos mock para demostración...');
      setLlantas(mockLlantas);
      setFilteredLlantas(mockLlantas);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* BANNER CARRUSEL HERO */}
      <section className="banner-carousel">
        <div
          className="carousel-slide"
          style={{
            backgroundImage: `url(${heroImages[currentHero]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '480px',
            width: '100vw',
            position: 'relative',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            transition: 'background-image 0.8s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div
            className="carousel-content"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea88 0%, #764ba288 50%, #f093fb88 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              zIndex: 2,
            }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>🛞 Ofertas Exclusivas</h2>
            <p style={{ fontSize: '1rem' }}>Descubre nuestras mejores promociones en llantas premium</p>
          </div>
          {/* Indicadores carrusel */}
          <div
            style={{
              position: 'absolute',
              bottom: 18,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              zIndex: 3,
            }}
          >
            {heroImages.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: idx === currentHero ? '#fff' : '#888',
                  opacity: idx === currentHero ? 1 : 0.5,
                  border: '2px solid #fff',
                  margin: '0 2px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onClick={() => setCurrentHero(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Llantas de Primera Calidad</h1>
          <p className="hero-subtitle">
            Encuentra la llanta perfecta para tu vehículo
          </p>
          <p className="hero-description">
            Con más de 10 años en el mercado, ofrecemos las mejores opciones
            en llantas con precios competitivos y garantía de satisfacción.
          </p>
        </div>
      </section>

      {/* PROMOCIONES NAVIDAD */}
      <section style={{
        background: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)',
        padding: '32px 16px',
        textAlign: 'center',
        color: '#fff',
        margin: '24px 0',
        borderRadius: '12px',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          🎄 ¡Próximamente Navidad! 🎁
        </h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
          Prepárate para nuestras ofertas especiales de fin de año
        </p>
      </section>

      {/* TESTIMONIOS ANIMADOS EN DOS FILAS */}
      <section className="testimonios-section" style={{ marginTop: 32, marginBottom: 48 }}>
        <h2 className="testimonios-title">Lo que dicen nuestros clientes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden', width: '100%' }}>
          {/* Fila 1: izquierda a derecha */}
          <div style={{ display: 'flex', gap: 24, animation: 'marquee-left 18s linear infinite' }}>
            {testimonios.map((t) => (
              <div
                key={t.id + '-fila1'}
                className="testimonio-card"
                style={{
                  minWidth: 280,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #0002',
                  padding: 18,
                  margin: '8px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={t.avatar} alt={t.nombre} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{t.nombre}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{t.cargo}</p>
                  </div>
                </div>
                <p style={{ fontStyle: 'italic', color: '#333', margin: 0, fontSize: '0.95rem' }}>
                  "{t.texto}"
                </p>
              </div>
            ))}
          </div>
          {/* Fila 2: derecha a izquierda */}
          <div style={{ display: 'flex', gap: 24, animation: 'marquee-right 22s linear infinite' }}>
            {[...testimonios].reverse().map((t) => (
              <div
                key={t.id + '-fila2'}
                className="testimonio-card"
                style={{
                  minWidth: 280,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #0002',
                  padding: 18,
                  margin: '8px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={t.avatar} alt={t.nombre} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{t.nombre}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{t.cargo}</p>
                  </div>
                </div>
                <p style={{ fontStyle: 'italic', color: '#333', margin: 0, fontSize: '0.95rem' }}>
                  "{t.texto}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-section">
        {loading ? (
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Cargando llantas...</p>
          </div>
        ) : (
          <>
            {filteredLlantas.length > 0 ? (
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

                  {/* imagen se muestra arriba; no mostrar ruta en UI */}

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
                      <i className="fas fa-check-circle"></i>{' '}
                      {llanta.CONDICION}
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
                      disabled={!llanta.PRECIO || llanta.PRECIO === 'N/A'}
                    >
                      {llanta.PRECIO && llanta.PRECIO !== 'N/A' ? 'Comprar' : 'Comprar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <p>No se encontraron llantas que coincidan con tu búsqueda</p>
          </div>
        )}
        </>
      )}
      </section>

      <section className="info-section">
        <div className="info-card">
          <i className="fas fa-shipping-fast"></i>
          <h3>Envío Rápido</h3>
          <p>Entrega en 24-48 horas en toda la región</p>
        </div>
        <div className="info-card">
          <i className="fas fa-shield-alt"></i>
          <h3>Garantía</h3>
          <p>Todas nuestras llantas con garantía oficial</p>
        </div>
        <div className="info-card">
          <i className="fas fa-headset"></i>
          <h3>Soporte 24/7</h3>
          <p>Atención al cliente disponible todos los días</p>
        </div>
        <div className="info-card">
          <i className="fas fa-tag"></i>
          <h3>Mejores Precios</h3>
          <p>Precios competitivos y ofertas especiales</p>
        </div>
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
