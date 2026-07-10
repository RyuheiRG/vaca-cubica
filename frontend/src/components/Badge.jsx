import "./Badge.css";

const badgeStyles = {
  Cárnica: {bg: "#fff4e5", color: "#b45309"},
  Lechera: {bg: "#e0f2fe", color: "#0369a1"},
  "Doble Propósito": {bg: "#f3e8ff", color: "#7e22ce"},
  Activa: {bg: "#e8f5e9", color: "#2e7d32"},
  Inactiva: {bg: "#fde8ec", color: "#e11d48"},
  Alta: {bg: "transparent", color: "#2e7d32"},
  Media: {bg: "transparent", color: "#b45309"},
  Baja: {bg: "transparent", color: "#e11d48"},
  Macho: {bg: "#e0f2fe", color: "#0369a1"},
  Hembra: {bg: "#fce7f3", color: "#be185d"},
  Lactante: {bg: "#fff4e5", color: "#b45309"},
  Destete: {bg: "#fef9c3", color: "#a16207"},
  Desarrollo: {bg: "#f3e8ff", color: "#7e22ce"},
  Vacuna: {bg: "#e0f2fe", color: "#0369a1"},
  Tratamiento: {bg: "#fff4e5", color: "#b45309"},
  Desparasitación: {bg: "#f3e8ff", color: "#7e22ce"},
  Revisión: {bg: "#e0f2fe", color: "#0369a1"},
  Completado: {bg: "#e8f5e9", color: "#2e7d32"},
  "En seguimiento": {bg: "#e0f2fe", color: "#0369a1"},
  Pendiente: {bg: "#fde8ec", color: "#e11d48"},

  // NUEVO: estado de salud de Bovinos
  Saludable: {bg: "#e8f5e9", color: "#2e7d32"},
  "En Observación": {bg: "#fff4e5", color: "#b45309"},
  Enfermo: {bg: "#fde8ec", color: "#e11d48"},
};

const Badge = ({value}) => {
  if (!value) return null;
  const style = badgeStyles[value] || {bg: "#f1f3f5", color: "#333"};
  return (
    <span
      className="badge"
      style={{backgroundColor: style.bg, color: style.color}}
    >
      {value}
    </span>
  );
};

export default Badge;
