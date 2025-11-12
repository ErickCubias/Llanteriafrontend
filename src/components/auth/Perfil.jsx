import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import AddVehiculoModal from './AddVehiculoModal';
import './Perfil.css';

export default function Perfil() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [vehiculos, setVehiculos] = useState(user?.vehiculos || []);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  // Verificar autenticación y cargar datos del perfil
  useEffect(() => {
    if (!user) {
      setMessage('Debe iniciar sesión para acceder a su perfil');
      setMessageType('warning');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setMessage('✅ Sesión activa');
      setMessageType('success');
      // Cargar datos del perfil del backend
      axios.get('http://localhost:3000/api/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data.usuario?.vehiculos) {
            setVehiculos(res.data.usuario.vehiculos);
          }
        })
        .catch(err => console.error('Error cargando perfil:', err));
    }
  }, [user, navigate, token]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/marcas').then(res => setMarcas(res.data));
    axios.get('http://localhost:3000/api/modelos').then(res => setModelos(res.data));
  }, []);

  const getMarca = (id) => marcas.find(m => m.id === id)?.NOMBRE || id;
  const getModelo = (id) => modelos.find(m => m.id === id)?.MODELO || id;

  const handleAddVehiculo = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/vehiculos', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehiculos([...vehiculos, response.data]);
      setShowModal(false);
      setMessage('✅ Vehículo agregado exitosamente');
      setMessageType('success');
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      setMessage('❌ Error al agregar vehículo: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('👋 ¡Has salido de sesión con éxito!');
      setMessageType('info');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      logout();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="perfil-container">
        <div className={`alert alert-warning`} role="alert">
          ⚠️ Debe iniciar sesión...
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      {/* Mensaje de sesión */}
      {message && (
        <div className={`alert alert-${messageType === 'success' ? 'success' : messageType === 'error' ? 'danger' : messageType === 'warning' ? 'warning' : 'info'} alert-dismissible fade show mb-4`} role="alert">
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      <h2 className="text-center text-primary mb-4">👤 Mi Perfil</h2>

      {/* Tarjeta de información personal */}
      <div className="card p-4 shadow mb-4">
        <h4 className="card-title text-primary mb-3">📋 Información Personal</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <p><strong>Nombres:</strong> {user.NOMBRES || 'N/A'}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>Apellidos:</strong> {user.APELLIDOS || 'N/A'}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>Correo:</strong> {user.CORREO || 'N/A'}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>Teléfono:</strong> {user.TELEFONO || 'No registrado'}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>DUI:</strong> {user.DUI || 'N/A'}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>Rol:</strong> <span className="badge bg-info">{user.ROL || 'Cliente'}</span></p>
          </div>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-outline-primary btn-sm" disabled>
            ✏️ Editar perfil (próximamente)
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tarjeta de vehículos */}
      <div className="card p-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-success mb-0">🚗 Mis Vehículos</h4>
          <button 
            className="btn btn-success btn-sm" 
            onClick={() => setShowModal(true)}
          >
            ➕ Agregar Vehículo
          </button>
        </div>

        {vehiculos && vehiculos.length > 0 ? (
          <div className="list-group list-group-flush">
            {vehiculos.map((v, i) => (
              <div key={v.id || i} className="list-group-item">
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Marca:</strong> {getMarca(v.MARCA_ID)} 
                      <strong className="ms-3">Modelo:</strong> {getModelo(v.MODELO_ID)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Año:</strong> {v.ANIO}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted">
                      <strong>Medida Rin:</strong> {v.MEDIDA_RIN}
                    </small>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted">
                      <strong>Medida Llanta:</strong> {v.MEDIDA_LLANTA} | <strong>Marca:</strong> {v.MARCA_LLANTA}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info mb-0">
            📭 No tienes vehículos registrados. <button className="btn btn-link btn-sm" onClick={() => setShowModal(true)}>Agregar uno</button>
          </div>
        )}
      </div>

      <AddVehiculoModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onAdd={handleAddVehiculo}
        marcas={marcas}
        modelos={modelos}
      />
    </div>
  );
}
