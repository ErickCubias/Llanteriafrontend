import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddVehiculoModal({ show, onClose, onAdd }) {
  const [form, setForm] = useState({
    MARCA_ID: '',
    MODELO_ID: '',
    ANIO: '',
    MEDIDA_RIN: '',
    MEDIDA_LLANTA: '',
    MARCA_LLANTA: ''
  });
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/marcas').then(res => setMarcas(res.data));
    axios.get('http://localhost:3000/api/modelos').then(res => setModelos(res.data));
  }, []);

  const modelosFiltrados = form.MARCA_ID ? modelos.filter(m => m.MARCA_ID === parseInt(form.MARCA_ID)) : [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onAdd(form);
      onClose();
    } catch (err) {
      setError('Error al agregar vehículo');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Vehículo</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <select name="MARCA_ID" className="form-select mb-2" value={form.MARCA_ID} onChange={handleChange} required>
                <option value="">Marca</option>
                {marcas.map(m => <option key={m.id} value={m.id}>{m.NOMBRE}</option>)}
              </select>
              <select name="MODELO_ID" className="form-select mb-2" value={form.MODELO_ID} onChange={handleChange} required disabled={!form.MARCA_ID}>
                <option value="">Modelo</option>
                {modelosFiltrados.map(m => <option key={m.id} value={m.id}>{m.MODELO}</option>)}
              </select>
              <input type="text" name="ANIO" className="form-control mb-2" placeholder="Año" value={form.ANIO} onChange={handleChange} required />
              <input type="text" name="MEDIDA_RIN" className="form-control mb-2" placeholder="Medida Rin" value={form.MEDIDA_RIN} onChange={handleChange} />
              <input type="text" name="MEDIDA_LLANTA" className="form-control mb-2" placeholder="Medida Llanta" value={form.MEDIDA_LLANTA} onChange={handleChange} />
              <input type="text" name="MARCA_LLANTA" className="form-control mb-2" placeholder="Marca Llanta" value={form.MARCA_LLANTA} onChange={handleChange} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-success" disabled={loading}>{loading ? 'Guardando...' : 'Agregar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
