import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Mail, Lock} from "lucide-react";
import Button from "../components/Button";
import VacaCubicaLogo from "../assets/vaca-cubica-icon-sesion.png";
import CowFieldImg from "../assets/vaca.png";
import "./Login.css";

// Credenciales temporales mientras se conecta la autenticación real (JWT).
// TODO: eliminar esto cuando exista el backend de login.
const TEMP_EMAIL = "admin@pedro.com";
const TEMP_PASSWORD = "vaca_segura_123";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña para continuar.");
      return;
    }

    if (email.trim() !== TEMP_EMAIL || password !== TEMP_PASSWORD) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    setError("");
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="login-page">
      <div
        className="login-image-side"
        style={{backgroundImage: `url(${CowFieldImg})`}}
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

          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordarme
          </label>

          <Button className="login-submit" onClick={handleSubmit}>
            Iniciar Sesión
          </Button>

          <p className="login-forgot">
            ¿Olvidaste tu contraseña? <a href="#">Recuperar acceso</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
