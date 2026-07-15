import EjemploGrafica from "../assets/ejemplo-grafica.png";
import "./Estadisticas.css";

const Estadisticas = () => {
  return (
    <div>
      <h1>Estadísticas</h1>
      <p>Resumen de datos y métricas</p>

      {/* Imagen temporal mientras se maqueta esta pantalla según el diseño de Figma */}
      <div className="estadisticas-card">
        <img src={EjemploGrafica} alt="Ejemplo de gráfica (temporal)" />
      </div>
    </div>
  );
};

export default Estadisticas;
