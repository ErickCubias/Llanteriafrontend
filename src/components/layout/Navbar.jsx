import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import AuthNav from './AuthNav';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function AppNavbar() {
  return (
    <BsNavbar expand="lg" className="app-navbar">
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/" className="navbar-brand">
          <img
            src="/assets/logo-llanta-sv.png"
            alt="LLANTA-SV"
            className="d-inline-block"
            style={{ width: '200px', height: '97px' }}
          />
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-navbar" />

        <BsNavbar.Collapse id="main-navbar">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link as={Link} to="/" className="nav-link">
              <i className="fas fa-home"></i> Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/llantas" className="nav-link">
              <i className="fas fa-tire"></i> Catálogo
            </Nav.Link>
            <Nav.Link as={Link} to="/cotizaciones" className="nav-link">
              <i className="fas fa-calculator"></i> Cotización
            </Nav.Link>
            <Nav.Link as={Link} to="/nosotros" className="nav-link">
              <i className="fas fa-info-circle"></i> Nosotros
            </Nav.Link>
          </Nav>

          <div className="navbar-nav-auth">
            <div className="navbar-divider"></div>
            <AuthNav />
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
