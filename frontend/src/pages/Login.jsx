import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Button from "../components/Button";
import VacaCubicaLogo from "../assets/vaca-cubica-icon-sesion.png";
import CowFieldImg from "../assets/vaca.png";
import { login } from "../services/authService";
import { useBovinos } from "../context/BovinosContext";
import { useRazas } from "../context/RazasContext";
import { useClientes } from "../context/ClientesContext";
import { useCrias } from "../context/CriasContext";
import { useAlimentos } from "../context/AlimentosContext";
import { useVacunas } from "../context/VacunasContext";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { refetch: refetchBovinos } = useBovinos();
  const { refetch: refetchRazas } = useRazas();
  const { refetch: refetchClientes } = useClientes();
  const { refetch: refetchCrias } = useCrias();
  const { refetch: refetchAlimentos } = useAlimentos();
  const { refetch: refetchVacunas } = useVacunas();
  const { refetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña para continuar.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);

      const resultados = await Promise.allSettled([
        refetchBovinos(),
        refetchRazas(),
        refetchClientes(),
        refetchCrias(),
        refetchAlimentos(),
        refetchVacunas(),
        refetchUser(),
      ]);

      resultados.forEach((r) => {
        if (r.status === "rejected")
          console.error("Error cargando datos iniciales:", r.reason);
      });

      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else if (err.response?.status === 403) {
        setError("Esta cuenta ha sido desactivada.");
      } else if (err.code === "ERR_NETWORK") {
        setError(
          "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
        );
      } else {
        setError("Ocurrió un error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="login-page">
      <div
        className="login-image-side"
        style={{ backgroundImage: `url(${CowFieldImg})` }}
      >
        <div className="login-brand">
          <img src={VacaCubicaLogo} alt="Vaca Cúbica" />
          <h1>VACA CUBICA</h1>
          <p>Gestión Bovina</p>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrapper">
          <h2>¡Bienvenido!</h2>
          <p className="login-subtitle">Ingresa tu contraseña de usuario</p>

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label>Correo de usuario:</label>
            <div className="login-input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="login-field">
            <label>Contraseña:</label>
            <div className="login-input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <Button
            className="login-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
