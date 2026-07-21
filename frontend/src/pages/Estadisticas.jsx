import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import StatCard from "../components/StatCard";
import AsyncState from "../components/AsyncState";
import useEstadisticas, {CHART_COLORS} from "../hooks/useEstadisticas";
import "./Estadisticas.css";

const formatoMXN = (valor) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(valor);

const Estadisticas = () => {
  const {
    loading,
    error,
    kpis,
    bovinosPorRaza,
    bovinosPorEstado,
    bovinosPorSexo,
    pesoPorRaza,
    ventasPorMes,
    partosPorTipo,
    bajasPorTipo,
    evolucionPeso,
  } = useEstadisticas();

  return (
    <div>
      <h1>Estadísticas</h1>
      <p>
        Resumen de datos y métricas del hato, calculado en vivo desde la base de
        datos
      </p>

      <AsyncState
        loading={loading}
        error={
          error
            ? "No se pudieron cargar las estadísticas. Verifica tu conexión con la API."
            : null
        }
      >
        <div className="stats-grid" style={{marginTop: "1.5rem"}}>
          <StatCard
            label="Total de bovinos"
            value={kpis?.totalBovinos ?? 0}
            variant="neutral"
          />
          <StatCard
            label="Bovinos activos"
            value={kpis?.bovinosActivos ?? 0}
            variant="success"
          />
          <StatCard
            label="Peso promedio de ingreso"
            value={`${kpis?.pesoPromedioIngreso ?? 0} kg`}
            variant="info"
          />
          <StatCard
            label="Ingresos por ventas"
            value={formatoMXN(kpis?.ingresoTotalVentas ?? 0)}
            variant="warning"
          />
        </div>

        <div className="estadisticas-grid">
          {/* Bovinos por raza */}
          <div className="estadisticas-card">
            <h3>Bovinos por raza</h3>
            <p className="chart-subtitle">
              Cantidad de animales registrados por raza
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bovinosPorRaza}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nombre" tick={{fontSize: 12}} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="cantidad"
                  fill={CHART_COLORS[0]}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Estado del hato */}
          <div className="estadisticas-card">
            <h3>Estado del hato</h3>
            <p className="chart-subtitle">Distribución actual por estado</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={bovinosPorEstado}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({nombre, cantidad}) => `${nombre}: ${cantidad}`}
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

          {/* Bovinos por sexo */}
          <div className="estadisticas-card">
            <h3>Distribución por sexo</h3>
            <p className="chart-subtitle">Machos vs. hembras en el hato</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={bovinosPorSexo}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({nombre, cantidad}) => `${nombre}: ${cantidad}`}
                >
                  {bovinosPorSexo.map((entry, index) => (
                    <Cell
                      key={entry.nombre}
                      fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Peso promedio de ingreso vs peso adulto de referencia, por raza */}
          <div className="estadisticas-card">
            <h3>Peso por raza</h3>
            <p className="chart-subtitle">
              Peso promedio de ingreso vs. peso adulto de referencia (kg)
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pesoPorRaza}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="raza" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="pesoIngresoPromedio"
                  name="Ingreso (prom.)"
                  fill={CHART_COLORS[0]}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="pesoAdultoReferencia"
                  name="Adulto (referencia)"
                  fill={CHART_COLORS[4]}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Evolución del peso del hato */}
          <div className="estadisticas-card">
            <h3>Evolución del peso del hato</h3>
            <p className="chart-subtitle">
              Peso promedio registrado en bitácora, por mes (kg)
            </p>
            {evolucionPeso.length === 0 ? (
              <p className="chart-empty">
                Aún no hay pesajes registrados en la bitácora.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={evolucionPeso}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{fontSize: 12}} />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    name="Peso promedio"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    dot={{r: 3}}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Ventas por mes */}
          <div className="estadisticas-card">
            <h3>Ingresos por ventas</h3>
            <p className="chart-subtitle">Total vendido por mes (MXN)</p>
            {ventasPorMes.length === 0 ? (
              <p className="chart-empty">Aún no hay ventas registradas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ventasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{fontSize: 12}} />
                  <YAxis />
                  <Tooltip formatter={(valor) => formatoMXN(valor)} />
                  <Bar
                    dataKey="valor"
                    name="Ventas"
                    fill={CHART_COLORS[2]}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Partos por tipo */}
          <div className="estadisticas-card">
            <h3>Partos por tipo</h3>
            <p className="chart-subtitle">Normal, distócico o cesárea</p>
            {partosPorTipo.length === 0 ? (
              <p className="chart-empty">Aún no hay partos registrados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={partosPorTipo}
                    dataKey="cantidad"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={({nombre, cantidad}) => `${nombre}: ${cantidad}`}
                  >
                    {partosPorTipo.map((entry, index) => (
                      <Cell
                        key={entry.nombre}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bajas por tipo */}
          <div className="estadisticas-card">
            <h3>Bajas del hato</h3>
            <p className="chart-subtitle">Ventas vs. fallecimientos</p>
            {bajasPorTipo.length === 0 ? (
              <p className="chart-empty">Aún no hay bajas registradas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={bajasPorTipo} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="nombre" type="category" width={90} />
                  <Tooltip />
                  <Bar
                    dataKey="cantidad"
                    fill={CHART_COLORS[3]}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </AsyncState>
    </div>
  );
};

export default Estadisticas;
