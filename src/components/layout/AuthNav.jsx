import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

export default function AuthNav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center gap-3">
      {user ? (
        <>
          <span className="text-light fw-bold">
            👋 {user.NOMBRES} {user.APELLIDOS}
          </span>
          <button
            type="button"
            className="btn btn-light btn-sm"
            data-mdb-ripple-init
            data-mdb-ripple-color="dark"
            onClick={() => navigate('/perfil')}
          >
            Perfil
          </button>
          {user.ROL === 'ADMIN' && (
            <button
              type="button"
              className="btn btn-info btn-sm"
              data-mdb-ripple-init
              onClick={() => navigate('/admin/llantas')}
            >
              Admin
            </button>
          )}
          <button
            type="button"
            className="btn btn-danger btn-sm"
            data-mdb-ripple-init
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            Salir
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-mdb-ripple-init
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            type="button"
            className="btn btn-success btn-sm"
            data-mdb-ripple-init
            onClick={() => navigate('/register')}
          >
            Registro
          </button>
        </>
      )}
    </div>
  );
}
