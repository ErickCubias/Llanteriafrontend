import { createContext, useState, useEffect, useRef } from 'react';
import { getPerfil, logout as apiLogout } from '../components/auth/authService';
import { useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const hasChecked = useRef(false); // ✅ bandera para evitar repeticiones

useEffect(() => {
  const token = localStorage.getItem('token');
  const isPublicRoute = ['/login', '/register'].includes(location.pathname);

  if (token && !user && !isPublicRoute && !hasChecked.current) {
    hasChecked.current = true; // ✅ solo una vez
    getPerfil(token)
      .then(data => {
        if (data?.CORREO) {
          setUser(data);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }
}, [location.pathname, user]);

const login = async (token, usuario) => {
  localStorage.setItem('token', token);
  setUser(usuario);
};

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) await apiLogout(token);
    localStorage.removeItem('token');
    setUser(null);
  };

  const token = localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}
