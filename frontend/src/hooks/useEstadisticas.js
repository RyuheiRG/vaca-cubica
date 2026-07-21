import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useBovinos } from "../context/BovinosContext";
import { useRazas } from "../context/RazasContext";

// Paleta reutilizando las variables definidas en index.css
export const CHART_COLORS = [
  "#5eb053", // --brand-green
  "#0ea5e9", // info
  "#f59e0b", // --warning-yellow
  "#e11d48", // --danger-red
  "#1a2e1a", // --bg-sidebar
  "#8b5cf6", // morado de apoyo
];

const ESTADO_LABELS = {
  activo: "Activo",
  vendido: "Vendido",
  cuarentena: "Cuarentena",
  fallecido: "Fallecido",
};

const SEXO_LABELS = {
  macho: "Macho",
  hembra: "Hembra",
};

const TIPO_PARTO_LABELS = {
  normal: "Normal",
  distocico: "Distócico",
  cesarea: "Cesárea",
};

const TIPO_BAJA_LABELS = {
  vendido: "Vendido",
  fallecido: "Fallecido",
};

const mesLabel = (fechaISO) => {
  const d = new Date(fechaISO);
  const label = d.toLocaleDateString("es-MX", {
    month: "short",
    year: "2-digit",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const agruparPorMes = (items, fechaKey, valorKey, modo = "suma") => {
  const grupos = new Map();

  items.forEach((item) => {
    const fecha = item[fechaKey];
    if (!fecha) return;
    const clave = fecha.slice(0, 7);
    const valor = Number(item[valorKey]);

    if (!grupos.has(clave)) {
      grupos.set(clave, { total: 0, cantidad: 0, fecha });
    }
    const g = grupos.get(clave);
    g.total += valor;
    g.cantidad += 1;
  });

  return Array.from(grupos.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([clave, g]) => ({
      mes: mesLabel(g.fecha),
      valor:
        modo === "promedio"
          ? Number((g.total / g.cantidad).toFixed(1))
          : Number(g.total.toFixed(2)),
    }));
};

const contarPor = (items, campo, labels = {}) => {
  const conteo = new Map();
  items.forEach((item) => {
    const clave = item[campo];
    conteo.set(clave, (conteo.get(clave) || 0) + 1);
  });
  return Array.from(conteo.entries()).map(([clave, cantidad]) => ({
    nombre: labels[clave] || clave,
    cantidad,
  }));
};

export const useEstadisticas = () => {
  const { bovinos, loading: loadingBovinos } = useBovinos();
  const { razas, loading: loadingRazas } = useRazas();

  const [ventas, setVentas] = useState([]);
  const [partos, setPartos] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [pesajes, setPesajes] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExtra = async () => {
      setLoadingExtra(true);
      setError(null);
      try {
        const [ventasRes, partosRes, bajasRes, pesajesRes] = await Promise.all([
          api.get("/api/ventas/"),
          api.get("/api/partos/"),
          api.get("/api/bajas/"),
          api.get("/api/pesajes/"),
        ]);
        setVentas(ventasRes.data);
        setPartos(partosRes.data);
        setBajas(bajasRes.data);
        setPesajes(pesajesRes.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingExtra(false);
      }
    };

    fetchExtra();
  }, []);

  const data = useMemo(() => {
    const razaById = new Map(razas.map((r) => [r.id, r]));

    // --- Bovinos por raza ---
    const bovinosPorRaza = contarPor(
      bovinos.map((b) => ({
        ...b,
        raza: razaById.get(b.raza_id)?.nombre || `Raza #${b.raza_id}`,
      })),
      "raza",
    ).map((item) => ({ nombre: item.nombre, cantidad: item.cantidad }));

    // --- Bovinos por estado (activo/vendido/cuarentena/fallecido) ---
    const bovinosPorEstado = contarPor(bovinos, "estado", ESTADO_LABELS);

    // --- Bovinos por sexo ---
    const bovinosPorSexo = contarPor(bovinos, "sexo", SEXO_LABELS);

    // --- Peso promedio de ingreso por raza, vs peso adulto de referencia ---
    const pesoPorRaza = razas
      .map((raza) => {
        const deLaRaza = bovinos.filter((b) => b.raza_id === raza.id);
        const promedioIngreso = deLaRaza.length
          ? deLaRaza.reduce((acc, b) => acc + Number(b.peso_ingreso), 0) /
            deLaRaza.length
          : 0;
        return {
          raza: raza.nombre,
          pesoIngresoPromedio: Number(promedioIngreso.toFixed(1)),
          pesoAdultoReferencia: Number(raza.peso_promedio_adulto),
        };
      })
      .filter((r) => r.pesoIngresoPromedio > 0);

    // --- Ventas por mes e ingreso total ---
    const ventasPorMes = agruparPorMes(
      ventas,
      "fecha_venta",
      "precio_final",
      "suma",
    );
    const ingresoTotalVentas = ventas.reduce(
      (acc, v) => acc + Number(v.precio_final),
      0,
    );

    // --- Partos por tipo ---
    const partosPorTipo = contarPor(partos, "tipo_parto", TIPO_PARTO_LABELS);

    // --- Bajas por tipo ---
    const bajasPorTipo = contarPor(bajas, "tipo", TIPO_BAJA_LABELS);

    // --- Evolución del peso promedio del hato, mes a mes ---
    const evolucionPeso = agruparPorMes(
      pesajes,
      "fecha",
      "peso_kg",
      "promedio",
    );

    // --- KPIs generales ---
    const totalBovinos = bovinos.length;
    const bovinosActivos = bovinos.filter((b) => b.estado === "activo").length;
    const pesoPromedioIngreso = totalBovinos
      ? Number(
          (
            bovinos.reduce((acc, b) => acc + Number(b.peso_ingreso), 0) /
            totalBovinos
          ).toFixed(1),
        )
      : 0;

    return {
      bovinosPorRaza,
      bovinosPorEstado,
      bovinosPorSexo,
      pesoPorRaza,
      ventasPorMes,
      ingresoTotalVentas,
      partosPorTipo,
      bajasPorTipo,
      evolucionPeso,
      kpis: {
        totalBovinos,
        bovinosActivos,
        pesoPromedioIngreso,
        ingresoTotalVentas,
        totalVentas: ventas.length,
      },
    };
  }, [bovinos, razas, ventas, partos, bajas, pesajes]);

  return {
    ...data,
    loading: loadingBovinos || loadingRazas || loadingExtra,
    error,
  };
};

export default useEstadisticas;
