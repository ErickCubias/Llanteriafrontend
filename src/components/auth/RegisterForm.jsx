import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login as apiLogin } from './authService';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import './RegisterForm.css';

export default function RegisterForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    NOMBRES: '',
    APELLIDOS: '',
    CORREO: '',
    DUI: '',
    TELEFONO: '',
    DIRECCION: '',
    PASSWORD: '',
    PASSWORD_confirmation: '',
    ROL: 'cliente',
    VEHICULO: {
      MARCA_ID: '',
      MODELO_ID: '',
      ANIO: '',
      MEDIDA_RIN: '',
      MEDIDA_LLANTA: '',
      MARCA_LLANTA: ''
    }
  });

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const cacheTimestamp = localStorage.getItem('cacheTimestamp');
    const ahora = Date.now();
    const unaHora = 60 * 60 * 1000;
    const cacheValido = cacheTimestamp && (ahora - cacheTimestamp < unaHora);

    if (cacheValido) {
      setMarcas(JSON.parse(localStorage.getItem('marcas')));
      setModelos(JSON.parse(localStorage.getItem('modelos')));
      setCargandoDatos(false);
    }

    Promise.all([
      axios.get('https://llanteriabackend-production.up.railway.app/api/marcas'),
      axios.get('https://llanteriabackend-production.up.railway.app/api/modelos')
    ])
    
      .then(([resMarcas, resModelos]) => {
        setMarcas(resMarcas.data);
        setModelos(resModelos.data);
        localStorage.setItem('marcas', JSON.stringify(resMarcas.data));
        localStorage.setItem('modelos', JSON.stringify(resModelos.data));
        localStorage.setItem('cacheTimestamp', Date.now());
      })
      .catch(() => setError('Error al cargar datos del vehículo'))
      .finally(() => setCargandoDatos(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.VEHICULO) {
      setForm({ ...form, VEHICULO: { ...form.VEHICULO, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones básicas
      if (!form.NOMBRES || !form.APELLIDOS || !form.CORREO || !form.PASSWORD || !form.PASSWORD_confirmation) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      if (form.PASSWORD !== form.PASSWORD_confirmation) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (form.PASSWORD.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Registrar
      await register(form);
      
      // Mostrar mensaje de éxito
      setSuccess('✅ ¡Registrado con éxito! Iniciando sesión...');
      
      // Iniciar sesión automáticamente
      const { token, usuario } = await apiLogin({ 
        CORREO: form.CORREO.toLowerCase(), 
        PASSWORD: form.PASSWORD 
      });
      
      await login(token, usuario);
      setTimeout(() => navigate('/perfil'), 1500);
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.response?.data?.message || err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const marcaId = parseInt(form.VEHICULO.MARCA_ID);
  const modelosFiltrados = isNaN(marcaId)
    ? []
    : modelos.filter(m => m.MARCA_ID === marcaId);

  if (cargandoDatos) {
    return (
      <div className="register-container">
        <div className="register-card-wrapper">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid var(--bg-light-secondary)',
              borderTop: '4px solid var(--color-cyan)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Cargando datos de vehículos...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const _passwordChecks = {
    minLength: form.PASSWORD.length >= 8,
    hasUpperCase: /[A-Z]/.test(form.PASSWORD),
    hasLowerCase: /[a-z]/.test(form.PASSWORD),
    hasNumber: /[0-9]/.test(form.PASSWORD),
    match: form.PASSWORD === form.PASSWORD_confirmation && form.PASSWORD.length > 0
  };

  return (
    <div className="register-container">
      <div className="register-card-wrapper">
        <div className="register-card">
          <div className="register-card-body">
            <div className="register-header">
              <h1 className="register-title">🚀 Crear Cuenta</h1>
              <p className="register-subtitle">Únete a LLANTA-SV y gestiona tus vehículos fácilmente</p>
            </div>

            {error && (
              <div className="alert-message alert-danger">
                <span>❌ {error}</span>
                <button 
                  className="alert-close-btn"
                  onClick={() => setError('')}
                >
                  ✕
                </button>
              </div>
            )}

            {success && (
              <div className="alert-message alert-success">
                <span>{success}</span>
                <button 
                  className="alert-close-btn"
                  onClick={() => setSuccess('')}
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleRegister} className="register-form">
              {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <i>👤</i> Información Personal
                </h3>

                <div className="form-row">
                  <div className="form-group-register">
                    <label htmlFor="nombres">Nombres *</label>
                    <input
                      type="text"
                      id="nombres"
                      name="NOMBRES"
                      placeholder="Tu nombre completo"
                      value={form.NOMBRES}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="form-group-register">
                    <label htmlFor="apellidos">Apellidos *</label>
                    <input
                      type="text"
                      id="apellidos"
                      name="APELLIDOS"
                      placeholder="Tus apellidos"
                      value={form.APELLIDOS}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group-register">
                    <label htmlFor="correo">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="correo"
                      name="CORREO"
                      placeholder="tu@email.com"
                      value={form.CORREO}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <span className="help-text">Usarás este correo para iniciar sesión</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-register">
                    <label htmlFor="dui">DUI *</label>
                    <input
                      type="text"
                      id="dui"
                      name="DUI"
                      placeholder="00000000-0"
                      value={form.DUI}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="form-group-register">
                    <label htmlFor="telefono">Teléfono *</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="TELEFONO"
                      placeholder="0000-0000"
                      value={form.TELEFONO}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group-register">
                    <label htmlFor="direccion">Dirección *</label>
                    <input
                      type="text"
                      id="direccion"
                      name="DIRECCION"
                      placeholder="Calle Principal 123, San Salvador"
                      value={form.DIRECCION}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: SEGURIDAD */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <i>🔐</i> Contraseña
                </h3>

                <div className="form-row">
                  <div className="form-group-register">
                    <label htmlFor="password">Contraseña *</label>
                    <input
                      type="password"
                      id="password"
                      name="PASSWORD"
                      placeholder="Mínimo 8 caracteres"
                      value={form.PASSWORD}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="form-group-register">
                    <label htmlFor="password_conf">Confirmar Contraseña *</label>
                    <input
                      type="password"
                      id="password_conf"
                      name="PASSWORD_confirmation"
                      placeholder="Repite tu contraseña"
                      value={form.PASSWORD_confirmation}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: DATOS DEL VEHÍCULO */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <i>🚗</i> Datos del Vehículo
                </h3>

                <div className="form-row">
                  <div className="form-group-register">
                    <label htmlFor="marca">Marca del Vehículo</label>
                    <select
                      id="marca"
                      name="MARCA_ID"
                      value={form.VEHICULO.MARCA_ID}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Selecciona una marca</option>
                      {marcas.map(m => (
                        <option key={m.id} value={m.id}>{m.NOMBRE}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group-register">
                    <label htmlFor="modelo">Modelo del Vehículo</label>
                    <select
                      id="modelo"
                      name="MODELO_ID"
                      value={form.VEHICULO.MODELO_ID}
                      onChange={handleChange}
                      disabled={!form.VEHICULO.MARCA_ID || loading}
                    >
                      <option value="">Selecciona un modelo</option>
                      {modelosFiltrados.map(m => (
                        <option key={m.id} value={m.id}>{m.MODELO}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-register">
                    <label htmlFor="anio">Año</label>
                    <input
                      type="number"
                      id="anio"
                      name="ANIO"
                      placeholder="2020"
                      value={form.VEHICULO.ANIO}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group-register">
                    <label htmlFor="medida-rin">Medida Rin</label>
                    <input
                      type="text"
                      id="medida-rin"
                      name="MEDIDA_RIN"
                      placeholder="15"
                      value={form.VEHICULO.MEDIDA_RIN}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-register">
                    <label htmlFor="medida-llanta">Medida Llanta</label>
                    <input
                      type="text"
                      id="medida-llanta"
                      name="MEDIDA_LLANTA"
                      placeholder="195/65R15"
                      value={form.VEHICULO.MEDIDA_LLANTA}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group-register">
                    <label htmlFor="marca-llanta">Marca Llanta Actual</label>
                    <input
                      type="text"
                      id="marca-llanta"
                      name="MARCA_LLANTA"
                      placeholder="Michelin"
                      value={form.VEHICULO.MARCA_LLANTA}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="register-form-buttons">
                <Link to="/login" className="btn-back">
                  ← Volver
                </Link>
                <button
                  type="submit"
                  className="btn-register"
                  disabled={loading}
                >
                  {loading ? '⏳ Registrando...' : '✓ Crear Cuenta'}
                </button>
              </div>

              {/* LOGIN LINK */}
              <div className="login-link">
                ¿Ya tienes cuenta? 
                <Link to="/login"> Inicia sesión aquí</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
