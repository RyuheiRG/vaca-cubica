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

  // Estado del bovino (Bovinos y Sementales)
  Activo: {bg: "#e8f5e9", color: "#2e7d32"},
  Vendido: {bg: "#e0f2fe", color: "#0369a1"},
  Cuarentena: {bg: "#fef9c3", color: "#a16207"},

  // Estado de salud de la cría
  Excelente: {bg: "#e8f5e9", color: "#2e7d32"},
  Bueno: {bg: "#e0f2fe", color: "#0369a1"},
  Observacion: {bg: "#fff4e5", color: "#b45309"},
  Critico: {bg: "#fde8ec", color: "#e11d48"},
  Fallecido: {bg: "#e5e7eb", color: "#475569"},

  // Categoría de movimiento comercial (Ventas)
  Venta: {bg: "#e8f5e9", color: "#2e7d32"},
  Renta: {bg: "#e0f2fe", color: "#0369a1"},
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
