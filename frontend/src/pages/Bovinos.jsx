import { useState, useMemo } from "react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import DynamicForm from "../components/DynamicForm";
import { useBovinos } from "../context/BovinosContext";
import { useRazas } from "../context/RazasContext";
import AsyncState from "../components/AsyncState";
import { getFriendlyErrorMessage } from "../utils/errorMessage";
import BovinoIcon from "../assets/bovino.png";
import "./Bovinos.css";

const PAGE_SIZE = 5;

const ESTADOS = ["activo", "vendido", "cuarentena", "fallecido"];
const SEXOS = ["macho", "hembra"];

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "—";
  const nacimiento = new Date(fechaNacimiento);
  const años =
    (Date.now() - nacimiento.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return `${Math.floor(años)} años`;
};

const animalRender = (row) => (
  <div className="bovino-cell">
    <span className="bovino-avatar">
      <img src={BovinoIcon} alt="Bovino" style={{ width: 18, height: 18 }} />
    </span>
    <div>
      <div className="bovino-name">{row.nombre || "—"}</div>
      <div className="bovino-code">{row.arete}</div>
    </div>
  </div>
);

const columns = [
  { key: "nombre", label: "Animal", render: animalRender },
  { key: "tipoRaza", label: "Raza" },
  { key: "sexoLabel", label: "Sexo", badge: true },
  { key: "edad", label: "Edad" },
  { key: "pesoLabel", label: "Peso" },
  { key: "estadoLabel", label: "Estado", badge: true },
];

const emptyBovino = {
  nombre: "",
  arete: "",
  raza_id: "",
  sexo: "",
  fecha_nacimiento: "",
  fecha_ingreso: "",
  peso_ingreso: "",
  estado: "activo",
};

const Bovinos = () => {
  const { bovinos, loading, error, refetch, createBovino, updateBovino } =
    useBovinos();
  const { razas, getRazaById } = useRazas();

  const formFields = [
    { key: "nombre", label: "Nombre" },
    { key: "arete", label: "Arete", placeholder: "B-006" },
    {
      key: "raza_id",
      label: "Raza",
      type: "select",
      options: razas.map((r) => ({ value: r.id, label: r.nombre })),
    },
    {
      key: "sexo",
      label: "Sexo",
      type: "select",
      options: SEXOS.map((s) => ({ value: s, label: capitalize(s) })),
    },
    { key: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date" },
    { key: "fecha_ingreso", label: "Fecha de ingreso", type: "date" },
    {
      key: "peso_ingreso",
      label: "Peso de ingreso (kg)",
      type: "number",
      placeholder: "450",
    },
    {
      key: "estado",
      label: "Estado",
      type: "select",
      options: ESTADOS.map((e) => ({ value: e, label: capitalize(e) })),
    },
  ];

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState(emptyBovino);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  // Enriquecemos cada bovino (que viene "crudo" de la API) con los
  // campos que la UI necesita para mostrarse (nombre de raza, edad, etc).
  const displayData = useMemo(
    () =>
      bovinos.map((b) => ({
        ...b,
        tipoRaza: getRazaById(b.raza_id).nombre,
        sexoLabel: capitalize(b.sexo),
        edad: calcularEdad(b.fecha_nacimiento),
        pesoLabel: `${b.peso_ingreso} kg`,
        estadoLabel: capitalize(b.estado),
      })),
    [bovinos, razas], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filters = [
    { key: "sexoLabel", placeholder: "Sexo", options: SEXOS.map(capitalize) },
    {
      key: "estadoLabel",
      placeholder: "Estado",
      options: ESTADOS.map(capitalize),
    },
  ];

  const filteredData = useMemo(() => {
    let result = displayData;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(term),
        ),
      );
    }
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) result = result.filter((row) => row[key] === value);
    });
    return result;
  }, [displayData, search, filterValues]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pageData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = [
    { label: "Total Animales", value: displayData.length, variant: "neutral" },
    {
      label: "Activos",
      value: displayData.filter((b) => b.estado === "activo").length,
      variant: "info",
    },
    {
      label: "En Cuarentena",
      value: displayData.filter((b) => b.estado === "cuarentena").length,
      variant: "warning",
    },
    {
      label: "Fallecidos",
      value: displayData.filter((b) => b.estado === "fallecido").length,
      variant: "danger",
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setNewItem(emptyBovino);
    setShowCreateModal(true);
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await createBovino({
        ...newItem,
        raza_id: Number(newItem.raza_id),
        peso_ingreso: Number(newItem.peso_ingreso),
        fecha_nacimiento: newItem.fecha_nacimiento || null,
      });
      setShowCreateModal(false);
      setToast({ message: "Bovino registrado correctamente", type: "success" });
    } catch (err) {
      setToast({
        message: err.response?.data?.detail || "No se pudo registrar el bovino",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => setEditingItem(row);

  const handleEditChange = (field, value) => {
    setEditingItem((prev) => ({ ...prev, [field]: value }));
  };

  // El backend solo permite editar nombre, estado y es_semental (BovinoUpdate).
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateBovino(editingItem.id, {
        nombre: editingItem.nombre,
        estado: editingItem.estado,
        es_semental: editingItem.es_semental,
      });
      setEditingItem(null);
      setToast({
        message: "Bovino actualizado correctamente",
        type: "success",
      });
    } catch (err) {
      setToast({
        message:
          err.response?.data?.detail || "No se pudo actualizar el bovino",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (row) => setItemToDelete(row);

  const handleConfirmDelete = async () => {
    setSaving(true);
    try {
      await updateBovino(itemToDelete.id, { estado: "fallecido" });
      setItemToDelete(null);
      setToast({
        message: "Bovino marcado como fallecido (no se puede eliminar vía API)",
        type: "success",
      });
    } catch (err) {
      setToast({
        message:
          err.response?.data?.detail || "No se pudo actualizar el bovino",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="bovinos-header-top">
        <div>
          <h1>Registro de Animales</h1>
          <p>Gestión completa del inventario animal de la finca</p>
        </div>
        <Button icon="+" onClick={handleOpenCreate}>
          Agregar Bovino
        </Button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            variant={stat.variant}
          />
        ))}
      </div>

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por nombre o arete..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      <div className="bovinos-card">
        <AsyncState
          loading={loading}
          error={error ? getFriendlyErrorMessage(error) : null}
          isEmpty={bovinos.length === 0}
          emptyMessage="Aún no hay bovinos registrados. Usa 'Agregar Bovino' para crear el primero."
          onRetry={refetch}
        >
          <DataTable
            columns={columns}
            data={pageData}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filteredData.length}
            pageSize={PAGE_SIZE}
          />
        </AsyncState>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Agregar Bovino"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <DynamicForm
          fields={formFields}
          values={newItem}
          onChange={handleNewItemChange}
        />
      </Modal>

      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Editar Bovino"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingItem(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        {editingItem && (
          <DynamicForm
            fields={[
              { key: "nombre", label: "Nombre" },
              {
                key: "estado",
                label: "Estado",
                type: "select",
                options: ESTADOS.map((e) => ({
                  value: e,
                  label: capitalize(e),
                })),
              },
            ]}
            values={editingItem}
            onChange={handleEditChange}
          />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemLabel="registro de bovino"
        itemName={itemToDelete?.nombre}
        itemId={itemToDelete?.arete}
        itemType={itemToDelete?.tipoRaza}
      />

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Bovinos;
