import {useState, useMemo} from "react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import DynamicForm from "../components/DynamicForm";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import {useBovinos} from "../context/BovinosContext";
import {useAlimentos} from "../context/AlimentosContext";
import {useVacunas} from "../context/VacunasContext";
import {useBitacora} from "../context/BitacoraContext";
import "./Bitacora.css";

const Bitacora = () => {
  const {bovinos, getBovinoByCodigo} = useBovinos();
  const {alimentos} = useAlimentos();
  const {vacunas} = useVacunas();
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

  const bovinoOptions = bovinos.map((b) => ({
    value: b.id,
    label: `${b.arete} — ${b.nombre || "Sin nombre"}`,
  }));

  const alimentoOptions = alimentos.map((a) => ({
    value: a.id,
    label: a.nombre,
  }));

  const vacunaOptions = vacunas.map((v) => ({
    value: v.id,
    label: v.nombre,
  }));

  const tabsConfig = [
    {
      key: "pesaje",
      label: "Historial de Pesaje",
      singular: "Pesaje",
      columns: [
        {key: "id", label: "ID"},
        {key: "fecha", label: "Fecha"},
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
        {key: "peso_kg", label: "Peso Actual (kg)"},
      ],
      formFields: [
        {key: "fecha", label: "Fecha", type: "date"},
        {
          key: "bovino_id",
          label: "Bovino",
          type: "select",
          options: bovinoOptions,
        },
        {key: "peso_kg", label: "Peso Actual (kg)", placeholder: "660.00"},
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
        {key: "id", label: "ID"},
        {key: "fecha_aplicacion", label: "Fecha"},
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
        {key: "dosis_ml", label: "Dosis (ml)"},
      ],
      formFields: [
        {key: "fecha_aplicacion", label: "Fecha", type: "date"},
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
        {key: "dosis_ml", label: "Dosis (ml)", placeholder: "2.5"},
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
        {key: "id", label: "ID"},
        {key: "fecha", label: "Fecha"},
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
        {key: "cantidad_kg", label: "Cantidad (kg)"},
      ],
      formFields: [
        {key: "fecha", label: "Fecha", type: "date"},
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
        {key: "cantidad_kg", label: "Cantidad (kg)", placeholder: "5.0"},
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
  ];

  const [activeTab, setActiveTab] = useState("pesaje");
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [toast, setToast] = useState(null);

  const currentConfig = tabsConfig.find((t) => t.key === activeTab);
  const currentData = currentConfig.getData();

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

  const tabsWithCounts = tabsConfig.map((t) => ({
    key: t.key,
    label: t.label,
    count: t.getData().length,
  }));

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearch("");
    setFilterValues({});
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({...prev, [key]: value}));
  };

  const handleOpenCreate = () => {
    setNewItem({});
    setShowCreateModal(true);
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({...prev, [field]: value}));
  };

  const handleCreate = async () => {
    try {
      await currentConfig.create(newItem);
      setShowCreateModal(false);
      setToast({
        message: `${currentConfig.singular} registrado correctamente`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message: "Error al registrar: " + (err.response?.data?.detail || err.message),
        type: "error",
      });
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
        onSearchChange={setSearch}
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
          data={filteredData}
          onEdit={() => {}}
          onDelete={() => {}}
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
            <Button onClick={handleCreate}>Guardar</Button>
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
