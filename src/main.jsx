import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
// MDB UI Kit: importar CSS y JS desde el paquete para asegurar orden correcto
import 'mdb-ui-kit/css/mdb.min.css';
import 'mdb-ui-kit/js/mdb.min.js';
import './theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
