import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from './authService';
import { AuthContext } from '../../context/AuthProvider';
import './LoginForm.css';

export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!correo || !password) {
        throw new Error('Por favor completa todos los campos');
      }

      setSuccess('✅ Iniciando sesión...');
      const { token, usuario } = await apiLogin({ 
        CORREO: correo.toLowerCase(), 
        PASSWORD: password 
      });
      
      await login(token, usuario);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', correo);
      }
      
      setSuccess('✅ ¡Sesión iniciada exitosamente!');
      setTimeout(() => navigate('/perfil'), 1500);
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.response?.data?.message || err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-card-body">
            {/* PANEL IZQUIERDO - FORMULARIO */}
            <div className="login-form-panel">
              <h1 className="login-form-title">Iniciar Sesión</h1>
              <p className="login-form-subtitle">Accede a tu cuenta de LLANTA-SV</p>

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

              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group-login">
                  <label htmlFor="correo">Correo Electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    placeholder="tu@email.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group-login">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="remember-forgot">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    Recuérdame
                  </label>
                  <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </div>

                <button
                  type="submit"
                  className="btn-login"
                  disabled={loading}
                >
                  {loading ? '⏳ Entrando...' : 'Entrar'}
                </button>

                <div className="signup-link">
                  ¿No tienes cuenta? 
                  <Link to="/register"> Regístrate aquí</Link>
                </div>
              </form>
            </div>

            {/* PANEL DERECHO - DECORATIVO */}
            <div className="login-banner-panel">
              <div className="login-banner-content">
                <div className="login-banner-icon">🔐</div>
                <h2 className="login-banner-title">Bienvenido</h2>
                <p className="login-banner-text">
                  Accede a tu cuenta y gestiona tus vehículos y cotizaciones de llantas.
                </p>
                
                <div className="banner-features">
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Gestión de vehículos</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Cotizaciones personalizadas</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Historial de compras</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">✓</div>
                    <div className="feature-text">Soporte dedicado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
