import {useState, useMemo} from "react";
import {User, ArrowRight} from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import FilterBar from "../components/FilterBar";
import VentaForm from "../components/VentaForm";
import ClienteForm from "../components/ClienteForm";
import "./Ventas.css";

const ventaColumns = [
  {key: "idTransaccion", label: "ID Transacción"},
  {key: "idBovino", label: "ID Bovino"},
  {key: "nombreCliente", label: "Nombre Cliente"},
  {key: "categoria", label: "Categoría"},
  {key: "amount", label: "Amount"},
  {key: "date", label: "Date"},
];

const clienteColumns = [
  {key: "idCliente", label: "ID Cliente"},
  {key: "nombre", label: "Nombre / Empresa"},
  {key: "tipo", label: "Tipo"},
  {key: "telefono", label: "Teléfono"},
  {key: "correo", label: "Correo"},
];

const emptyVenta = {
  idBovino: "",
  nombreCliente: "",
  categoria: "Venta",
  amount: "",
  date: "",
  notas: "",
};

const emptyCliente = {
  nombre: "",
  rfc: "",
  tipo: "",
  direccion: "",
  telefono: "",
  correo: "",
  notas: "",
};

const filterConfig = {
  movimientos: {
    placeholder: "Bus car por cliente, ID de transacción...",
    filters: [
      {key: "categoria", placeholder: "Categoría", options: ["Venta", "Renta"]},
    ],
  },
  clientes: {
    placeholder: "Buscar por nombre, correo...",
    filters: [
      {
        key: "tipo",
        placeholder: "Tipo",
        options: ["Agro", "Particular", "Distribuidor"],
      },
    ],
  },
};

const Ventas = () => {
  const [activeTab, setActiveTab] = useState("movimientos");

  // ---------- ESTADOS ----------
  const [ventas, setVentas] = useState([
    {
      id: 1,
      idTransaccion: "TX-001",
      idBovino: "VC-101",
      nombreCliente: "Agro El Sol",
      categoria: "Venta",
      amount: "$5,500.00",
      date: "20/05/2024",
    },
    {
      id: 2,
      idTransaccion: "TX-002",
      idBovino: "VC-102",
      nombreCliente: "Agro El Sol",
      categoria: "Venta",
      amount: "$6,000.00",
      date: "20/05/2024",
    },
    {
      id: 3,
      idTransaccion: "TX-003",
      idBovino: "VC-103",
      nombreCliente: "Agro El Sol",
      categoria: "Venta",
      amount: "$7,000.00",
      date: "20/05/2024",
    },
    {
      id: 4,
      idTransaccion: "TX-004",
      idBovino: "VC-104",
      nombreCliente: "La Hacienda",
      categoria: "Venta",
      amount: "$4,200.00",
      date: "21/05/2024",
    },
    {
      id: 5,
      idTransaccion: "TX-005",
      idBovino: "VC-105",
      nombreCliente: "Rancho Verde",
      categoria: "Renta",
      amount: "$1,200.00",
      date: "22/05/2024",
    },
    {
      id: 6,
      idTransaccion: "TX-006",
      idBovino: "VC-106",
      nombreCliente: "Agro El Sol",
      categoria: "Venta",
      amount: "$8,500.00",
      date: "23/05/2024",
    },
    {
      id: 7,
      idTransaccion: "TX-007",
      idBovino: "VC-107",
      nombreCliente: "Distribuciones MX",
      categoria: "Venta",
      amount: "$3,750.00",
      date: "24/05/2024",
    },
    {
      id: 8,
      idTransaccion: "TX-008",
      idBovino: "VC-108",
      nombreCliente: "La Hacienda",
      categoria: "Renta",
      amount: "$900.00",
      date: "25/05/2024",
    },
    {
      id: 9,
      idTransaccion: "TX-009",
      idBovino: "VC-109",
      nombreCliente: "Rancho Verde",
      categoria: "Venta",
      amount: "$5,300.00",
      date: "26/05/2024",
    },
    {
      id: 10,
      idTransaccion: "TX-010",
      idBovino: "VC-110",
      nombreCliente: "Distribuciones MX",
      categoria: "Venta",
      amount: "$2,600.00",
      date: "27/05/2024",
    },
  ]);

  const [clientes, setClientes] = useState([
    {
      id: 1,
      idCliente: "CLI-001",
      nombre: "Agro El Sol",
      tipo: "Agro",
      telefono: "614-123-4567",
      correo: "contacto@agroelsol.com",
    },
    {
      id: 2,
      idCliente: "CLI-002",
      nombre: "Ganadería Los Andes",
      tipo: "Agro",
      telefono: "555-987-6543",
      correo: "info@ganaderiaaandes.com",
    },
    {
      id: 3,
      idCliente: "CLI-003",
      nombre: "Juan Carlos García",
      tipo: "Particular",
      telefono: "666-234-5678",
      correo: "jcgarcia@email.com",
    },
    {
      id: 4,
      idCliente: "CLI-004",
      nombre: "Distribuciones MX",
      tipo: "Distribuidor",
      telefono: "777-456-7890",
      correo: "ventas@distribucionesmx.com",
    },
    {
      id: 5,
      idCliente: "CLI-005",
      nombre: "Rancho Verde",
      tipo: "Agro",
      telefono: "888-345-2109",
      correo: "contacto@ranchverde.com",
    },
    {
      id: 6,
      idCliente: "CLI-006",
      nombre: "María López Hernández",
      tipo: "Particular",
      telefono: "999-567-8901",
      correo: "mlopez@email.com",
    },
    {
      id: 7,
      idCliente: "CLI-007",
      nombre: "Carnicería El Primo",
      tipo: "Distribuidor",
      telefono: "444-789-0123",
      correo: "carnes@elprimomx.com",
    },
    {
      id: 8,
      idCliente: "CLI-008",
      nombre: "Exportaciones Ganaderas",
      tipo: "Agro",
      telefono: "333-012-3456",
      correo: "export@ganaderas.mx",
    },
    {
      id: 9,
      idCliente: "CLI-009",
      nombre: "Roberto Fernández",
      tipo: "Particular",
      telefono: "222-234-5678",
      correo: "rfernandez@email.com",
    },
    {
      id: 10,
      idCliente: "CLI-010",
      nombre: "Supermercados Nacionales",
      tipo: "Distribuidor",
      telefono: "111-890-1234",
      correo: "compras@supermercadosnac.com",
    },
    {
      id: 11,
      idCliente: "CLI-011",
      nombre: "Riqueza Ganadera",
      tipo: "Agro",
      telefono: "555-111-2233",
      correo: "riqueza@ganaderamx.com",
    },
  ]);

  const [editingRow, setEditingRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const [showVentaModal, setShowVentaModal] = useState(false);
  const [newVenta, setNewVenta] = useState(emptyVenta);

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [newCliente, setNewCliente] = useState(emptyCliente);

  const [editingCliente, setEditingCliente] = useState(null);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  // NUEVO: búsqueda y filtros
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});

  const tabs = [
    {key: "movimientos", label: "Movimientos", count: ventas.length},
    {key: "clientes", label: "Clientes", count: clientes.length},
  ];

  // NUEVO: datos filtrados según pestaña activa
  const filteredVentas = useMemo(() => {
    let result = ventas;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(term),
        ),
      );
    }
    if (filterValues.categoria) {
      result = result.filter((row) => row.categoria === filterValues.categoria);
    }
    return result;
  }, [ventas, search, filterValues]);

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
    if (filterValues.tipo) {
      result = result.filter((row) => row.tipo === filterValues.tipo);
    }
    return result;
  }, [clientes, search, filterValues]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearch("");
    setFilterValues({});
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({...prev, [key]: value}));
  };

  // ---------- HANDLERS: VENTAS ----------
  const handleEdit = (row) => setEditingRow(row);
  const handleDeleteClick = (row) => setRowToDelete(row);

  const handleConfirmDelete = () => {
    setVentas((prev) => prev.filter((v) => v.id !== rowToDelete.id));
    setRowToDelete(null);
    setToast({message: "Registro eliminado correctamente", type: "success"});
  };

  const handleChange = (field, value) => {
    setEditingRow((prev) => ({...prev, [field]: value}));
  };

  const handleSave = () => {
    setVentas((prev) =>
      prev.map((v) => (v.id === editingRow.id ? editingRow : v)),
    );
    setEditingRow(null);
    setToast({message: "Cambios guardados correctamente", type: "success"});
  };

  const handleNewVentaChange = (field, value) => {
    setNewVenta((prev) => ({...prev, [field]: value}));
  };

  const handleCreateVenta = () => {
    const nextId = ventas.length ? Math.max(...ventas.map((v) => v.id)) + 1 : 1;
    const idTransaccion = `TX-${String(nextId).padStart(3, "0")}`;

    setVentas((prev) => [...prev, {id: nextId, idTransaccion, ...newVenta}]);
    setNewVenta(emptyVenta);
    setShowVentaModal(false);
    setToast({message: "Venta registrada correctamente", type: "success"});
  };

  // ---------- HANDLERS: CLIENTES ----------
  const handleNewClienteChange = (field, value) => {
    setNewCliente((prev) => ({...prev, [field]: value}));
  };

  const handleCreateCliente = () => {
    const nextId = clientes.length
      ? Math.max(...clientes.map((c) => c.id)) + 1
      : 1;
    const idCliente = `CLI-${String(nextId).padStart(3, "0")}`;

    setClientes((prev) => [...prev, {id: nextId, idCliente, ...newCliente}]);
    setNewCliente(emptyCliente);
    setShowClienteModal(false);
    setToast({message: "Cliente registrado correctamente", type: "success"});
  };

  const handleEditCliente = (row) => setEditingCliente(row);

  const handleChangeCliente = (field, value) => {
    setEditingCliente((prev) => ({...prev, [field]: value}));
  };

  const handleSaveCliente = () => {
    setClientes((prev) =>
      prev.map((c) => (c.id === editingCliente.id ? editingCliente : c)),
    );
    setEditingCliente(null);
    setToast({message: "Cliente actualizado correctamente", type: "success"});
  };

  const handleDeleteClienteClick = (row) => setClienteToDelete(row);

  const handleConfirmDeleteCliente = () => {
    setClientes((prev) => prev.filter((c) => c.id !== clienteToDelete.id));
    setClienteToDelete(null);
    setToast({message: "Cliente eliminado correctamente", type: "success"});
  };

  // ---------- RENDER ----------
  return (
    <div>
      <div className="ventas-header-top">
        <div>
          <h1>Ventas</h1>
          <p>Registro de ventas y transacciones</p>
        </div>
      </div>

      <div style={{display: "flex", gap: "1rem", marginTop: "1.5rem"}}>
        <Button icon="+" onClick={() => setShowVentaModal(true)}>
          Registrar Venta o Renta de Bovino
        </Button>
        <Button icon="+" onClick={() => setShowClienteModal(true)}>
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
              <span>— {filteredVentas.length} registros</span>
            </h3>
          </div>
          <DataTable
            columns={ventaColumns}
            data={filteredVentas}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
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
          <DataTable
            columns={clienteColumns}
            data={filteredClientes}
            onEdit={handleEditCliente}
            onDelete={handleDeleteClienteClick}
          />
        </div>
      )}

      {/* Editar venta existente */}
      <Modal
        isOpen={!!editingRow}
        onClose={() => setEditingRow(null)}
        title="Editar Venta"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingRow(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} iconRight={<ArrowRight size={16} />}>
              Guardar
            </Button>
          </>
        }
      >
        {editingRow && (
          <VentaForm values={editingRow} onChange={handleChange} />
        )}
      </Modal>

      {/* Registrar venta o renta */}
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
              iconRight={<ArrowRight size={16} />}
            >
              Guardar
            </Button>
          </>
        }
      >
        <VentaForm values={newVenta} onChange={handleNewVentaChange} />
      </Modal>

      {/* Registrar cliente */}
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
              icon={<User size={16} />}
              iconRight={<ArrowRight size={16} />}
            >
              Crear
            </Button>
          </>
        }
      >
        <ClienteForm values={newCliente} onChange={handleNewClienteChange} />
      </Modal>

      {/* Editar cliente existente */}
      <Modal
        isOpen={!!editingCliente}
        onClose={() => setEditingCliente(null)}
        title="Editar Cliente"
        subtitle="Actualiza los datos del cliente o empresa"
        icon={<User size={16} />}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingCliente(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCliente}
              iconRight={<ArrowRight size={16} />}
            >
              Guardar
            </Button>
          </>
        }
      >
        {editingCliente && (
          <ClienteForm values={editingCliente} onChange={handleChangeCliente} />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!rowToDelete}
        onClose={() => setRowToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemLabel="registro de venta"
        itemName={rowToDelete?.nombreCliente}
        itemId={rowToDelete?.idTransaccion}
        itemType={rowToDelete?.categoria}
      />

      <ConfirmDeleteModal
        isOpen={!!clienteToDelete}
        onClose={() => setClienteToDelete(null)}
        onConfirm={handleConfirmDeleteCliente}
        itemLabel="registro de cliente"
        itemName={clienteToDelete?.nombre}
        itemId={clienteToDelete?.idCliente}
        itemType={clienteToDelete?.tipo}
      />

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Ventas;
