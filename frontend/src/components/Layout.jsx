import { NavLink, Outlet } from "react-router-dom";
import { logout } from "../services/authService";
import "./Layout.css";

import VacaCubicaLogo from "../assets/vaca-cubica-icon.png";
import CerrarSesionIcon from "../assets/cerrar-sesion.png";
import BovinoIcon from "../assets/bovino.png";
import BitacoraIcon from "../assets/bitacora.png";
import CatalogoIcon from "../assets/catalogo.png";
import InicioIcon from "../assets/inicio.png";
import AnaliticoIcon from "../assets/analitico.png";
import VentasIcon from "../assets/ventas.png";

const Layout = () => {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <NavLink to="/">
            <img src={VacaCubicaLogo} alt="Vaca Cubica" />
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {}
          <NavLink to="/" className="nav-item">
            <span className="icon">
              <img src={InicioIcon} alt="Inicio" />
            </span>
            Inicio
          </NavLink>
          <NavLink to="/bovinos" className="nav-item">
            <span className="icon">
              <img src={BovinoIcon} alt="Bovinos" />
            </span>
            Bovinos
          </NavLink>
          <NavLink to="/bitacora" className="nav-item">
            <span className="icon">
              <img src={BitacoraIcon} alt="Bitácora" />
            </span>
            Bitácora Ganadera
          </NavLink>
          <NavLink to="/catalogo" className="nav-item">
            <span className="icon">
              <img src={CatalogoIcon} alt="Catálogo" />
            </span>
            Catálogo
          </NavLink>
          <NavLink to="/ventas" className="nav-item">
            <span className="icon">
              <img src={VentasIcon} alt="Ventas" />
            </span>
            Ventas & Clientes
          </NavLink>
          <NavLink to="/estadisticas" className="nav-item">
            <span className="icon">
              <img src={AnaliticoIcon} alt="Analítico" />
            </span>
            Analítico & Estadístico
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="icon">
              <img src={CerrarSesionIcon} alt="Cerrar sesión" />
            </span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {}
      <main className="main-content">
        <div className="content-wrapper">
          {}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
