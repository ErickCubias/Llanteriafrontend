export default function Footer() {
  return (
    <footer
      className="pt-5 pb-4 mt-5"
      style={{
        background: 'rgba(8,10,14,0.94)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        color: '#c7cdd6'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-start gap-3">
              <img
                src="/assets/logo-llanta-sv.png"
                alt="LLANTA-SV"
                style={{ width: '200px', height: '97px', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.7))', borderRadius: 6, background: 'rgba(255,255,255,0.03)', padding: 4 }}
              />
              <div>
                <p className="mb-0" style={{ color: '#9aa3ad' }}>Stack de llantas local — servicio, venta y montaje.</p>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="text-muted">Products</h6>
            <ul className="list-unstyled mt-2">
              <li><a href="#" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Llantas</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Servicios</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-muted">Company</h6>
            <ul className="list-unstyled mt-2">
              <li><a href="#" className="text-muted text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Blog</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Contact</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-muted">Legal</h6>
            <ul className="list-unstyled mt-2">
              <li><a href="#" className="text-muted text-decoration-none">Terms & Conditions</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-top pt-3 mt-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small style={{ color: '#8f97a0' }}>© {new Date().getFullYear()} LLANTA-SV. Todos los derechos reservados.</small>
          <div className="mt-2 mt-md-0">
            <a href="#" className="text-muted me-3" style={{ color: '#9aa3ad' }}><i className="fab fa-discord"></i></a>
            <a href="#" className="text-muted me-3" style={{ color: '#9aa3ad' }}><i className="fab fa-linkedin"></i></a>
            <a href="#" className="text-muted" style={{ color: '#9aa3ad' }}><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
