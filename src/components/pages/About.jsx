import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-container">
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-content">
          <img 
            src="/assets/logo-llanta-sv.png" 
            alt="LLANTA-SV Logo" 
            className="about-logo"
          />
          <h1>LLANTA-SV</h1>
          <p className="about-tagline">Tu tienda de llantas de confianza en El Salvador</p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="about-section historia-section">
        <div className="section-content">
          <h2>📖 Nuestra Historia</h2>
          <p>
            Desde hace más de 10 años, LLANTA-SV ha sido el punto de referencia para conductores, 
            talleres y empresas en El Salvador que buscan llantas de calidad. 
            Nuestro compromiso ha sido siempre ofrecer productos confiables, con precios competitivos 
            y un servicio que supera expectativas.
          </p>
          <p>
            Comenzamos como una pequeña distribuidora local y hoy contamos con un amplio catálogo 
            de marcas reconocidas a nivel mundial, atendiendo a miles de clientes satisfechos en todo el territorio.
          </p>
          <p>
            Con la era digital, implementamos nuestra plataforma de e-commerce para que puedas 
            cotizar y comprar llantas desde cualquier lugar, con seguridad, facilidad y rapidez.
          </p>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="about-section porque-section">
        <h2>🎯 ¿Por Qué Elegirnos?</h2>
        <div className="reasons-grid">
          <div className="reason-card">
            <div className="reason-icon">✓</div>
            <h3>Calidad Garantizada</h3>
            <p>
              Trabajamos solo con marcas certificadas y reconocidas. 
              Cada llanta pasa por controles de calidad rigurosos.
            </p>
          </div>

          <div className="reason-card">
            <div className="reason-icon">💰</div>
            <h3>Precios Competitivos</h3>
            <p>
              Ofrecemos los mejores precios del mercado sin comprometer la calidad. 
              Consulta nuestras promociones especiales.
            </p>
          </div>

          <div className="reason-card">
            <div className="reason-icon">⚡</div>
            <h3>Atención Rápida</h3>
            <p>
              Cotizaciones inmediatas, entrega ágil y soporte al cliente disponible 
              para resolver tus dudas en tiempo real.
            </p>
          </div>

          <div className="reason-card">
            <div className="reason-icon">🤝</div>
            <h3>Confianza y Experiencia</h3>
            <p>
              Más de una década de experiencia en el mercado salvadoreño. 
              Miles de clientes satisfechos nos recomiendan.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="about-section contacto-section">
        <h2>📞 Contacta con Nosotros</h2>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">📱 Teléfono:</span>
            <a href="tel:+50372345678">+503 7234-5678</a>
          </div>
          <div className="contact-item">
            <span className="contact-label">📧 Email:</span>
            <a href="mailto:ventas@llanteria-sv.com">ventas@llanteria-sv.com</a>
          </div>
          <div className="contact-item">
            <span className="contact-label">📍 Ubicación:</span>
            <p>San Salvador, El Salvador</p>
          </div>
          <div className="contact-item">
            <span className="contact-label">⏰ Horario:</span>
            <p>Lunes a Viernes: 8:00 AM - 6:00 PM<br/>Sábados: 9:00 AM - 4:00 PM</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>¿Listo para encontrar las llantas perfectas?</h2>
        <p>Explora nuestro catálogo y solicita tu cotización hoy</p>
        <div className="cta-buttons">
          <a href="/llantas" className="cta-btn primary">
            🛞 Ver Catálogo
          </a>
          <a href="/cotizaciones" className="cta-btn secondary">
            📋 Mis Cotizaciones
          </a>
        </div>
      </section>
    </div>
  );
}
