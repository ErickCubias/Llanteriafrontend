import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Accept: 'application/json'
  }
});

export const login = async (data) => {
  const res = await API.post('/login', data);
  return res.data; // ← incluye token y usuario
};

export const register = async (data) => {
  const res = await API.post('/register', data);
  return res.data; // ← incluye token y usuario
};


export const getPerfil = async (token) => {
  const res = await API.get('/perfil', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data.usuario;
};


export const logout = async (token) => {
  await API.post('/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  localStorage.removeItem('token');
};
