import {AlertTriangle, Clock} from "lucide-react";
import StatCard from "../components/StatCard";
import {useBovinos} from "../context/BovinosContext";
import BovinoIcon from "../assets/bovino.png";
import GraficaPeso from "../assets/ejemplo-grafica-peso.png";
import GraficaHato from "../assets/ejemplo-grafica-hato.png";
import GraficaRaza from "../assets/ejemplo-grafica-raza.png";
import "./Inicio.css";

const estadoVariant = {
  "En Observación": {variant: "warning", dotColor: "#b45309"},
  Enfermo: {variant: "danger", dotColor: "#e11d48"},
};

const proximasVacunasRaw = [
  {id: 1, idBovino: "B-001", detalle: "Brucelosis", fecha: "28 jun"},
  {id: 2, idBovino: "B-002", detalle: "Aftosa", fecha: "02 jul"},
  {id: 3, idBovino: "B-005", detalle: "Rabia", fecha: "10 jul"},
];

const actividadRecienteRaw = [
  {
    id: 1,
    idBovino: "B-004",
    accion: "recibió tratamiento antibiótico",
    tiempo: "Hace 2 h",
    variant: "danger",
  },
  {
    id: 2,
    idBovino: "B-005",
    accion: "registró pesaje — 680 kg",
    tiempo: "Hace 5 h",
    variant: "success",
  },
  {
    id: 3,
    idBovino: "B-003",
    accion: "puesto en observación por cojera",
    tiempo: "Ayer 14:30",
    variant: "warning",
  },
  {
    id: 4,
    idBovino: "B-001",
    accion: "registrado en bitácora ganadera",
    tiempo: "Ayer 09:00",
    variant: "success",
  },
];

const Inicio = () => {
  const {bovinos, getBovinoByCodigo} = useBovinos();

  const stats = [
    {label: "Total Bovinos", value: bovinos.length, variant: "neutral"},
    {
      label: "Saludables",
      value: bovinos.filter((b) => b.estado === "Saludable").length,
      variant: "info",
    },
    {
      label: "En Observación",
      value: bovinos.filter((b) => b.estado === "En Observación").length,
      variant: "warning",
    },
    {
      label: "Enfermos",
      value: bovinos.filter((b) => b.estado === "Enfermo").length,
      variant: "danger",
    },
  ];

  const alertas = bovinos
    .filter((b) => b.estado !== "Saludable")
    .map((b) => ({
      id: b.id,
      nombre: b.nombre,
      codigo: b.codigo,
      raza: b.tipoRaza,
      estado: b.estado,
      ...(estadoVariant[b.estado] || {variant: "neutral", dotColor: "#999"}),
    }));

  const proximasVacunas = proximasVacunasRaw.map((v) => ({
    ...v,
    nombre: getBovinoByCodigo(v.idBovino).nombre,
  }));

  const actividadReciente = actividadRecienteRaw.map((a) => ({
    ...a,
    texto: `${getBovinoByCodigo(a.idBovino).nombre} ${a.accion}`,
  }));

  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="inicio-banner">
        <div className="inicio-banner-date">
          {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
        </div>
        <h1>Buenos días, Pedro Pablo 👋</h1>
        <p>Aquí está el resumen de tu rancho al día de hoy.</p>
        <div className="inicio-banner-tags">
          <span className="inicio-tag">👑 Dueño</span>
          <span className="inicio-tag">Rancho "El 4 P"</span>
        </div>
      </div>

      <div className="stats-grid" style={{marginTop: "1.5rem"}}>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            variant={stat.variant}
          />
        ))}
      </div>

      <div className="inicio-charts-row">
        <div className="chart-card chart-image-wrapper">
          <div className="chart-card-header">
            <div>
              <h3>Evolución del peso del hato</h3>
              <p className="chart-subtitle">
                Peso total acumulado en kg — 2026
              </p>
            </div>
          </div>
          <img src={GraficaPeso} alt="Evolución del peso del hato" />
        </div>

        <div className="chart-card chart-image-wrapper">
          <div className="chart-card-header">
            <div>
              <h3>Estado del hato</h3>
              <p className="chart-subtitle">Distribución actual</p>
            </div>
          </div>
          <img src={GraficaHato} alt="Estado del hato" />
        </div>
      </div>

      <div className="inicio-bottom-row">
        <div className="info-card">
          <div className="info-card-header">
            <AlertTriangle size={18} color="#e11d48" />
            <h3>Alertas activas</h3>
            <span className="info-card-count">{alertas.length}</span>
          </div>

          {alertas.map((a) => (
            <div key={a.id} className={`alert-item ${a.variant}`}>
              <span className="alert-avatar">
                <img
                  src={BovinoIcon}
                  alt="Bovino"
                  style={{width: 16, height: 16}}
                />
              </span>
              <div>
                <div className="alert-item-name">{a.nombre}</div>
                <div className="alert-item-meta">
                  {a.codigo} · {a.raza}
                </div>
                <div className="alert-item-meta">
                  <span
                    className="alert-status-dot"
                    style={{backgroundColor: a.dotColor}}
                  />
                  {a.estado}
                </div>
              </div>
            </div>
          ))}

          <div className="info-list-title">Próximas vacunaciones</div>
          {proximasVacunas.map((v) => (
            <div key={v.id} className="info-list-item">
              <div>
                <div className="info-list-name">{v.nombre}</div>
                <div className="info-list-sub">{v.detalle}</div>
              </div>
              <span className="info-list-date">{v.fecha}</span>
            </div>
          ))}
        </div>

        <div className="info-card chart-image-wrapper">
          <div className="chart-card-header">
            <div>
              <h3>Peso promedio por raza</h3>
              <p className="chart-subtitle">Kilogramos</p>
            </div>
          </div>
          <img src={GraficaRaza} alt="Peso promedio por raza" />

          <div className="info-list-title">Resumen financiero — Jun</div>
          <div className="finance-row">
            <span className="finance-label">Ventas registradas</span>
            <span className="finance-value positive">$0 MXN</span>
          </div>
          <div className="finance-row">
            <span className="finance-label">Rentas activas</span>
            <span className="finance-value">0</span>
          </div>
          <div className="finance-row">
            <span className="finance-label">Costo dieta aprox.</span>
            <span className="finance-value warning">~$4,200 MXN</span>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <Clock size={18} color="var(--brand-green)" />
            <h3>Actividad reciente</h3>
          </div>

          {actividadReciente.map((item) => (
            <div key={item.id} className="activity-item">
              <span className={`activity-icon ${item.variant}`}>
                <img
                  src={BovinoIcon}
                  alt="Bovino"
                  style={{width: 16, height: 16}}
                />
              </span>
              <div>
                <div className="activity-text">{item.texto}</div>
                <div className="activity-time">{item.tiempo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;
