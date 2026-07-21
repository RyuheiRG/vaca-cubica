import { useState, useMemo } from "react";
import { User, ArrowRight } from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import FilterBar from "../components/FilterBar";
import VentaForm from "../components/VentaForm";
import ClienteForm from "../components/ClienteForm";
import { useBovinos } from "../context/BovinosContext";
import { useClientes } from "../context/ClientesContext";
import { useVentas } from "../context/VentasContext";
import { getFormErrorMessage } from "../utils/errorMessage";
import "./Ventas.css";

const formatMoney = (value) =>
  `$${Number(value).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`;

const movimientoColumns = (getBovinoById, getClienteById) => [
  { key: "idLabel", label: "ID" },
  {
    key: "bovino",
    label: "Bovino",
    render: (row) => {
      const b = getBovinoById(row.bovino_id);
      return `${b.arete} — ${b.nombre || "sin nombre"}`;
    },
  },
  {
    key: "cliente",
    label: "Cliente",
    render: (row) => getClienteById(row.cliente_id).nombre,
  },
  { key: "categoria", label: "Categoría", badge: true },
  { key: "costoLabel", label: "Costo" },
  { key: "fechaLabel", label: "Fecha" },
];

const clienteColumns = [
  { key: "id", label: "ID" },
  { key: "nombre", label: "Nombre / Empresa" },
  { key: "telefono", label: "Teléfono" },
];

const emptyVenta = {
  categoria: "Venta",
  bovino_id: "",
  cliente_id: "",
  fecha_venta: "",
  precio_final: "",
  fecha_inicio: "",
  fecha_fin: "",
  costo_total: "",
};

const emptyCliente = {
  nombre: "",
  telefono: "",
};

const filterConfig = {
  movimientos: {
    placeholder: "Buscar por cliente, bovino...",
    filters: [
      {
        key: "categoria",
        placeholder: "Categoría",
        options: ["Venta", "Renta"],
      },
    ],
  },
  clientes: {
    placeholder: "Buscar por nombre, teléfono...",
    filters: [],
  },
};

const Ventas = () => {
  const { bovinos, getBovinoById } = useBovinos();
  const { clientes, createCliente, getClienteById } = useClientes();
  const { ventas, rentas, createVenta, createRenta } = useVentas();

  const [activeTab, setActiveTab] = useState("movimientos");

  const [toast, setToast] = useState(null);

  const [showVentaModal, setShowVentaModal] = useState(false);
  const [newVenta, setNewVenta] = useState(emptyVenta);
  const [savingVenta, setSavingVenta] = useState(false);

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [newCliente, setNewCliente] = useState(emptyCliente);
  const [savingCliente, setSavingCliente] = useState(false);

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});

  const bovinosParaVenta = useMemo(
    () => bovinos.filter((b) => b.estado === "activo"),
    [bovinos],
  );
  const bovinosParaRenta = useMemo(
    () =>
      bovinos.filter(
        (b) => b.es_semental && b.sexo === "macho" && b.estado === "activo",
      ),
    [bovinos],
  );
  const bovinosDisponibles =
    newVenta.categoria === "Renta" ? bovinosParaRenta : bovinosParaVenta;

  const movimientos = useMemo(() => {
    const ventasMapeadas = ventas.map((v) => ({
      id: `V-${v.id}`,
      idLabel: `VTA-${String(v.id).padStart(3, "0")}`,
      bovino_id: v.bovino_id,
      cliente_id: v.cliente_id,
      categoria: "Venta",
      costoLabel: formatMoney(v.precio_final),
      fechaLabel: v.fecha_venta,
      fechaOrden: v.fecha_venta,
    }));
    const rentasMapeadas = rentas.map((r) => ({
      id: `R-${r.id}`,
      idLabel: `RTA-${String(r.id).padStart(3, "0")}`,
      bovino_id: r.bovino_id,
      cliente_id: r.cliente_id,
      categoria: "Renta",
      costoLabel: formatMoney(r.costo_total),
      fechaLabel: r.fecha_fin
        ? `${r.fecha_inicio} – ${r.fecha_fin}`
        : `Desde ${r.fecha_inicio}`,
      fechaOrden: r.fecha_inicio,
    }));
    return [...ventasMapeadas, ...rentasMapeadas].sort((a, b) =>
      b.fechaOrden.localeCompare(a.fechaOrden),
    );
  }, [ventas, rentas]);

  const tabs = [
    { key: "movimientos", label: "Movimientos", count: movimientos.length },
    { key: "clientes", label: "Clientes", count: clientes.length },
  ];

  const filteredMovimientos = useMemo(() => {
    let result = movimientos;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (row) =>
          getBovinoById(row.bovino_id).arete?.toLowerCase().includes(term) ||
          getBovinoById(row.bovino_id).nombre?.toLowerCase().includes(term) ||
          getClienteById(row.cliente_id).nombre.toLowerCase().includes(term),
      );
    }
    if (filterValues.categoria) {
      result = result.filter((row) => row.categoria === filterValues.categoria);
    }
    return result;
  }, [movimientos, search, filterValues, getBovinoById, getClienteById]);

  const filteredClientes = useMemo(() => {
    let result = clientes;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(term),
        ),
      );
    }
    return result;
  }, [clientes, search]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearch("");
    setFilterValues({});
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenVentaModal = () => {
    setNewVenta(emptyVenta);
    setShowVentaModal(true);
  };

  const handleNewVentaChange = (field, value) => {
    setNewVenta((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateVenta = async () => {
    setSavingVenta(true);
    try {
      if (newVenta.categoria === "Renta") {
        await createRenta({
          bovino_id: Number(newVenta.bovino_id),
          cliente_id: Number(newVenta.cliente_id),
          fecha_inicio: newVenta.fecha_inicio,
          fecha_fin: newVenta.fecha_fin || null,
          costo_total: Number(newVenta.costo_total),
        });
      } else {
        await createVenta({
          bovino_id: Number(newVenta.bovino_id),
          cliente_id: Number(newVenta.cliente_id),
          fecha_venta: newVenta.fecha_venta,
          precio_final: Number(newVenta.precio_final),
        });
      }
      setShowVentaModal(false);
      setToast({
        message: `${newVenta.categoria} registrada correctamente`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message: getFormErrorMessage(err, "No se pudo registrar el movimiento"),
        type: "error",
      });
    } finally {
      setSavingVenta(false);
    }
  };

  const handleOpenClienteModal = () => {
    setNewCliente(emptyCliente);
    setShowClienteModal(true);
  };

  const handleNewClienteChange = (field, value) => {
    setNewCliente((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateCliente = async () => {
    setSavingCliente(true);
    try {
      await createCliente(newCliente);
      setShowClienteModal(false);
      setToast({
        message: "Cliente registrado correctamente",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: getFormErrorMessage(err, "No se pudo registrar el cliente"),
        type: "error",
      });
    } finally {
      setSavingCliente(false);
    }
  };

  return (
    <div>
      <div className="ventas-header-top">
        <div>
          <h1>Ventas</h1>
          <p>Registro de ventas y transacciones</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <Button icon="+" onClick={handleOpenVentaModal}>
          Registrar Venta o Renta de Bovino
        </Button>
        <Button icon="+" onClick={handleOpenClienteModal}>
          Registrar Catálogo de Clientes
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={filterConfig[activeTab].placeholder}
        filters={filterConfig[activeTab].filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      {activeTab === "movimientos" && (
        <div className="ventas-card">
          <div className="ventas-card-header">
            <h3>
              Listado General de Movimientos{" "}
              <span>— {filteredMovimientos.length} registros</span>
            </h3>
          </div>
          <DataTable
            columns={movimientoColumns(getBovinoById, getClienteById)}
            data={filteredMovimientos}
          />
        </div>
      )}

      {activeTab === "clientes" && (
        <div className="ventas-card">
          <div className="ventas-card-header">
            <h3>
              Catálogo de Clientes{" "}
              <span>— {filteredClientes.length} registros</span>
            </h3>
          </div>
          <DataTable columns={clienteColumns} data={filteredClientes} />
        </div>
      )}

      <Modal
        isOpen={showVentaModal}
        onClose={() => setShowVentaModal(false)}
        title="Registrar Venta o Renta de Bovino"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowVentaModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateVenta}
              disabled={savingVenta}
              iconRight={<ArrowRight size={16} />}
            >
              {savingVenta ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <VentaForm
          values={newVenta}
          onChange={handleNewVentaChange}
          bovinos={bovinosDisponibles}
          clientes={clientes}
        />
      </Modal>

      <Modal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        title="Añadir Nuevo Cliente al Catálogo"
        subtitle="Complete los datos del cliente o empresa"
        icon={<User size={16} />}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowClienteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCliente}
              disabled={savingCliente}
              icon={<User size={16} />}
              iconRight={<ArrowRight size={16} />}
            >
              {savingCliente ? "Guardando..." : "Crear"}
            </Button>
          </>
        }
      >
        <ClienteForm values={newCliente} onChange={handleNewClienteChange} />
      </Modal>

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Ventas;
