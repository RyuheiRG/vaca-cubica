import {useState} from "react";
import {User, ArrowRight} from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import VentaForm from "../components/VentaForm";
import ClienteForm from "../components/ClienteForm";

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

const Ventas = () => {
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
  ]);

  const [editingRow, setEditingRow] = useState(null); // venta en edición
  const [rowToDelete, setRowToDelete] = useState(null); // venta a borrar
  const [toast, setToast] = useState(null);

  const [showVentaModal, setShowVentaModal] = useState(false);
  const [newVenta, setNewVenta] = useState(emptyVenta);

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [newCliente, setNewCliente] = useState(emptyCliente);

  const [editingCliente, setEditingCliente] = useState(null); // cliente en edición
  const [clienteToDelete, setClienteToDelete] = useState(null); // cliente a borrar

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
      <h1>Ventas</h1>
      <p>Registro de ventas y transacciones</p>

      <div style={{display: "flex", gap: "1rem", marginTop: "1.5rem"}}>
        <Button icon="+" onClick={() => setShowVentaModal(true)}>
          Registrar Venta o Renta de Bovino
        </Button>
        <Button icon="+" onClick={() => setShowClienteModal(true)}>
          Registrar Catálogo de Clientes
        </Button>
      </div>

      <h3 style={{marginTop: "2rem"}}>
        Listado General de Movimientos y Clientes
      </h3>

      <DataTable
        columns={ventaColumns}
        data={ventas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <h3 style={{marginTop: "2.5rem"}}>Catálogo de Clientes</h3>

      <DataTable
        columns={clienteColumns}
        data={clientes}
        onEdit={handleEditCliente}
        onDelete={handleDeleteClienteClick}
      />

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
