import {AlertTriangle, Clock} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import StatCard from "../components/StatCard";
import {useBovinos} from "../context/BovinosContext";
import useEstadisticas, {CHART_COLORS} from "../hooks/useEstadisticas";
import BovinoIcon from "../assets/bovino.png";
import "./Inicio.css";
import "../components/ChartPlaceholder.css"; // aporta la clase .chart-card usada abajo

const estadoVariant = {
  cuarentena: {label: "Cuarentena", variant: "warning", dotColor: "#b45309"},
  fallecido: {label: "Fallecido", variant: "danger", dotColor: "#e11d48"},
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

const formatoMXN = (valor) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(valor);

const Inicio = () => {
  const {bovinos, getBovinoByCodigo} = useBovinos();
  const {bovinosPorEstado, pesoPorRaza, evolucionPeso, kpis} =
    useEstadisticas();

  const stats = [
    {label: "Total Bovinos", value: bovinos.length, variant: "neutral"},
    {
      label: "Activos",
      value: bovinos.filter((b) => b.estado === "activo").length,
      variant: "success",
    },
    {
      label: "En Cuarentena",
      value: bovinos.filter((b) => b.estado === "cuarentena").length,
      variant: "warning",
    },
    {
      label: "Fallecidos",
      value: bovinos.filter((b) => b.estado === "fallecido").length,
      variant: "danger",
    },
  ];

  const alertas = bovinos
    .filter((b) => estadoVariant[b.estado])
    .map((b) => ({
      id: b.id,
      nombre: b.nombre || b.arete,
      codigo: b.arete,
      ...estadoVariant[b.estado],
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
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3>Evolución del peso del hato</h3>
              <p className="chart-subtitle">
                Peso promedio registrado (kg), por mes
              </p>
            </div>
          </div>
          {evolucionPeso.length === 0 ? (
            <p className="chart-empty-inline">
              Aún no hay pesajes registrados.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={evolucionPeso}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{fontSize: 12}} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={{r: 3}}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3>Estado del hato</h3>
              <p className="chart-subtitle">Distribución actual</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={bovinosPorEstado}
                dataKey="cantidad"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={75}
                label={({cantidad}) => cantidad}
              >
                {bovinosPorEstado.map((entry, index) => (
                  <Cell
                    key={entry.nombre}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
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
                <div className="alert-item-meta">{a.codigo}</div>
                <div className="alert-item-meta">
                  <span
                    className="alert-status-dot"
                    style={{backgroundColor: a.dotColor}}
                  />
                  {a.label}
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

        <div className="info-card">
          <div className="chart-card-header">
            <div>
              <h3>Peso promedio por raza</h3>
              <p className="chart-subtitle">Kilogramos de ingreso</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={pesoPorRaza}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="raza" tick={{fontSize: 11}} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="pesoIngresoPromedio"
                fill={CHART_COLORS[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="info-list-title">Resumen financiero</div>
          <div className="finance-row">
            <span className="finance-label">Ventas registradas</span>
            <span className="finance-value positive">
              {formatoMXN(kpis?.ingresoTotalVentas ?? 0)}
            </span>
          </div>
          <div className="finance-row">
            <span className="finance-label">Total de ventas</span>
            <span className="finance-value">{kpis?.totalVentas ?? 0}</span>
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
