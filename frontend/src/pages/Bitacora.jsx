import { useState, useMemo } from "react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import DynamicForm from "../components/DynamicForm";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import { useBovinos } from "../context/BovinosContext";
import { useAlimentos } from "../context/AlimentosContext";
import { useVacunas } from "../context/VacunasContext";
import { useBitacora } from "../context/BitacoraContext";
import "./Bitacora.css";

const PAGE_SIZE = 5;

const Bitacora = () => {
  const { bovinos } = useBovinos();
  const { alimentos } = useAlimentos();
  const { vacunas } = useVacunas();
  const {
    pesajes,
    registrosMedicos,
    dietas,
    createPesaje,
    createRegistroMedico,
    createDieta,
  } = useBitacora();

  const getBovinoById = (id) => bovinos.find((b) => b.id === id) || {};
  const getVacunaById = (id) => vacunas.find((v) => v.id === id) || {};
  const getAlimentoById = (id) => alimentos.find((a) => a.id === id) || {};

  // 1. Memorización de Opciones para evitar re-renders destructivos
  const bovinoOptions = useMemo(
    () =>
      bovinos.map((b) => ({
        value: b.id,
        label: `${b.arete} — ${b.nombre || "Sin nombre"}`,
      })),
    [bovinos],
  );

  const alimentoOptions = useMemo(
    () =>
      alimentos.map((a) => ({
        value: a.id,
        label: a.nombre,
      })),
    [alimentos],
  );

  const vacunaOptions = useMemo(
    () =>
      vacunas.map((v) => ({
        value: v.id,
        label: v.nombre,
      })),
    [vacunas],
  );

  // 2. Memorización del Strategy de Tabs
  const tabsConfig = useMemo(
    () => [
      {
        key: "pesaje",
        label: "Historial de Pesaje",
        singular: "Pesaje",
        columns: [
          { key: "id", label: "ID" },
          { key: "fecha", label: "Fecha" },
          {
            key: "arete",
            label: "Arete Bovino",
            render: (row) => getBovinoById(row.bovino_id).arete,
          },
          {
            key: "nombre",
            label: "Nombre Bovino",
            render: (row) => getBovinoById(row.bovino_id).nombre,
          },
          { key: "peso_kg", label: "Peso Actual (kg)" },
        ],
        formFields: [
          { key: "fecha", label: "Fecha", type: "date" },
          {
            key: "bovino_id",
            label: "Bovino",
            type: "select",
            options: bovinoOptions,
          },
          { key: "peso_kg", label: "Peso Actual (kg)", placeholder: "660.00" },
        ],
        getData: () => pesajes,
        create: createPesaje,
        stats: [
          {
            key: "registros",
            label: "Registros",
            compute: (d) => d.length,
            variant: "neutral",
          },
        ],
        filters: [],
        moreFilters: [],
      },
      {
        key: "medico",
        label: "Control Médico",
        singular: "Control Médico",
        columns: [
          { key: "id", label: "ID" },
          { key: "fecha_aplicacion", label: "Fecha" },
          {
            key: "arete",
            label: "Arete Bovino",
            render: (row) => getBovinoById(row.bovino_id).arete,
          },
          {
            key: "nombre",
            label: "Nombre Bovino",
            render: (row) => getBovinoById(row.bovino_id).nombre,
          },
          {
            key: "vacuna",
            label: "Vacuna",
            render: (row) => getVacunaById(row.vacuna_id).nombre,
          },
          { key: "dosis_ml", label: "Dosis (ml)" },
        ],
        formFields: [
          { key: "fecha_aplicacion", label: "Fecha", type: "date" },
          {
            key: "bovino_id",
            label: "Bovino",
            type: "select",
            options: bovinoOptions,
          },
          {
            key: "vacuna_id",
            label: "Vacuna",
            type: "select",
            options: vacunaOptions,
          },
          { key: "dosis_ml", label: "Dosis (ml)", placeholder: "2.5" },
        ],
        getData: () => registrosMedicos,
        create: createRegistroMedico,
        stats: [
          {
            key: "registros",
            label: "Registros",
            compute: (d) => d.length,
            variant: "neutral",
          },
        ],
        filters: [],
        moreFilters: [],
      },
      {
        key: "dieta",
        label: "Dieta Diaria",
        singular: "Registro de Dieta",
        columns: [
          { key: "id", label: "ID" },
          { key: "fecha", label: "Fecha" },
          {
            key: "arete",
            label: "Arete Bovino",
            render: (row) => getBovinoById(row.bovino_id).arete,
          },
          {
            key: "nombre",
            label: "Nombre Bovino",
            render: (row) => getBovinoById(row.bovino_id).nombre,
          },
          {
            key: "alimento",
            label: "Alimento",
            render: (row) => getAlimentoById(row.alimento_id).nombre,
          },
          { key: "cantidad_kg", label: "Cantidad (kg)" },
        ],
        formFields: [
          { key: "fecha", label: "Fecha", type: "date" },
          {
            key: "bovino_id",
            label: "Bovino",
            type: "select",
            options: bovinoOptions,
          },
          {
            key: "alimento_id",
            label: "Alimento",
            type: "select",
            options: alimentoOptions,
          },
          { key: "cantidad_kg", label: "Cantidad (kg)", placeholder: "5.0" },
        ],
        getData: () => dietas,
        create: createDieta,
        stats: [
          {
            key: "registros",
            label: "Registros",
            compute: (d) => d.length,
            variant: "neutral",
          },
        ],
        filters: [],
        moreFilters: [],
      },
    ],
    [
      bovinoOptions,
      alimentoOptions,
      vacunaOptions,
      pesajes,
      registrosMedicos,
      dietas,
    ],
  );

  // 3. Estados de UI
  const [activeTab, setActiveTab] = useState("pesaje");
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false); // Frame de invulnerabilidad (Bloqueo UI)

  const currentConfig = tabsConfig.find((t) => t.key === activeTab);
  const currentData = currentConfig.getData();

  // 4. Filtrado y Paginación
  const filteredData = useMemo(() => {
    let result = currentData;
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
  }, [currentData, search, filterValues]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pageData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabsWithCounts = tabsConfig.map((t) => ({
    key: t.key,
    label: t.label,
    count: t.getData().length,
  }));

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearch("");
    setFilterValues({});
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setNewItem({});
    setShowCreateModal(true);
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  // 5. Inserción Asíncrona con Sanitización
  const handleCreate = async () => {
    setSaving(true);
    try {
      // Zero Trust Payload: Casteo explícito para evitar fallos de esquema en el backend
      const payload = {
        ...newItem,
        bovino_id: Number(newItem.bovino_id),
        ...(newItem.peso_kg && { peso_kg: parseFloat(newItem.peso_kg) }),
        ...(newItem.dosis_ml && { dosis_ml: parseFloat(newItem.dosis_ml) }),
        ...(newItem.cantidad_kg && {
          cantidad_kg: parseFloat(newItem.cantidad_kg),
        }),
        ...(newItem.vacuna_id && { vacuna_id: Number(newItem.vacuna_id) }),
        ...(newItem.alimento_id && {
          alimento_id: Number(newItem.alimento_id),
        }),
      };

      await currentConfig.create(payload);
      setShowCreateModal(false);
      setToast({
        message: `${currentConfig.singular} registrado correctamente`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message:
          "Error al registrar: " + (err.response?.data?.detail || err.message),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="bitacora-header-top">
        <div>
          <h1>Bitácora Ganadera</h1>
          <p>Pesaje · Control Médico · Dieta</p>
        </div>
        <Button icon="+" onClick={handleOpenCreate}>
          Registrar {currentConfig.singular}
        </Button>
      </div>

      <Tabs
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      <div className="stats-grid">
        {currentConfig.stats.map((stat) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stat.compute(currentData)}
            variant={stat.variant}
          />
        ))}
      </div>

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar en bitácora..."
        filters={currentConfig.filters || []}
        moreFilters={currentConfig.moreFilters || []}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      <div className="bitacora-card">
        <div className="bitacora-card-header">
          <h3>
            {currentConfig.label} <span>({filteredData.length} registros)</span>
          </h3>
        </div>

        <DataTable
          columns={currentConfig.columns}
          data={pageData} // Renderiza solo el slice paginado
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredData.length}
          pageSize={PAGE_SIZE}
        />
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={`Registrar ${currentConfig.singular}`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            {/* Bloqueo del botón durante la resolución de la promesa */}
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <DynamicForm
          fields={currentConfig.formFields}
          values={newItem}
          onChange={handleNewItemChange}
        />
      </Modal>

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Bitacora;
