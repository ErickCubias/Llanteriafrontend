import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Si hay usuario, renderiza el contenido protegido
  if (user) return children;

  // Si no hay sesión, redirige al login
  return <Navigate to="/login" />;
}
