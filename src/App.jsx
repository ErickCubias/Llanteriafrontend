import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './modules/core/Home';
import Llantas from './modules/llantas/Llantas';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import Perfil from './components/auth/Perfil';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLlantas from './components/admin/AdminLlantas';
import AdminCotizaciones from './components/admin/AdminCotizaciones';
import MisCotizaciones from './components/user/MisCotizaciones';
import About from './components/pages/About';

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas con layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/llantas"
        element={
          <Layout>
            <Llantas />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterForm />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <LoginForm />
          </Layout>
        }
      />
      <Route
        path="/nosotros"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />

      {/* Rutas protegidas con layout */}
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Layout>
              <Perfil />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/llantas"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminLlantas />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cotizaciones"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminCotizaciones />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cotizaciones"
        element={
          <ProtectedRoute>
            <Layout>
              <MisCotizaciones />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
