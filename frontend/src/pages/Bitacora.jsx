import {useState, useMemo} from "react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import DynamicForm from "../components/DynamicForm";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import {useBovinos} from "../context/BovinosContext";
import {useCrias} from "../context/CriasContext";
import {useAlimentos} from "../context/AlimentosContext";
import "./Bitacora.css";

const ganaciaRender = (row) => {
  const isPositive = String(row.ganancia).trim().startsWith("+");
  return (
    <span className={isPositive ? "value-positive" : "value-negative"}>
      {row.ganancia}
    </span>
  );
};

const ccRender = (row) => {
  const cc = Number(row.cc);
  const className =
    cc >= 4 ? "value-positive" : cc <= 2 ? "value-negative" : "value-neutral";
  return <span className={className}>{row.cc}</span>;
};

const Bitacora = () => {
  const {bovinos, getBovinoByCodigo} = useBovinos();
  const {addCriaFromNacimiento} = useCrias();
  const {alimentos} = useAlimentos();

  const bovinoOptions = bovinos.map((b) => ({
    value: b.codigo,
    label: `${b.codigo} — ${b.nombre}`,
  }));
  const alimentoOptions = alimentos.map((a) => a.nombre);

  const tabsConfig = [
    {
      key: "pesaje",
      label: "Historial de Pesaje",
      singular: "Pesaje",
      prefix: "PES",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "fecha", label: "Fecha"},
        {key: "idBovino", label: "ID Bovino"},
        {
          key: "nombre",
          label: "Nombre",
          render: (row) => getBovinoByCodigo(row.idBovino).nombre,
        },
        {
          key: "raza",
          label: "Raza",
          render: (row) => getBovinoByCodigo(row.idBovino).tipoRaza,
        },
        {key: "pesoAnterior", label: "Peso Anterior"},
        {key: "pesoActual", label: "Peso Actual"},
        {key: "ganancia", label: "Ganancia", render: ganaciaRender},
        {key: "cc", label: "CC (1-5)", render: ccRender},
        {key: "responsable", label: "Responsable"},
        {key: "observaciones", label: "Observaciones"},
      ],
      formFields: [
        {key: "fecha", label: "Fecha", type: "date"},
        {
          key: "idBovino",
          label: "ID Bovino",
          type: "select",
          options: bovinoOptions,
        },
        {key: "pesoAnterior", label: "Peso Anterior", placeholder: "640 kg"},
        {key: "pesoActual", label: "Peso Actual", placeholder: "660 kg"},
        {key: "ganancia", label: "Ganancia", placeholder: "+20 kg"},
        {
          key: "cc",
          label: "Condición Corporal (1-5)",
          type: "select",
          options: ["1", "2", "3", "4", "5"],
        },
        {key: "responsable", label: "Responsable"},
        {key: "observaciones", label: "Observaciones", type: "textarea"},
      ],
      initialData: [
        {
          id: 1,
          codigo: "PES-001",
          fecha: "10/06/2024",
          idBovino: "B-001",
          pesoAnterior: "640 kg",
          pesoActual: "660 kg",
          ganancia: "+20 kg",
          cc: "4",
          responsable: "Ing. Ramírez",
          observaciones: "Ganancia esperada",
        },
        {
          id: 2,
          codigo: "PES-002",
          fecha: "10/06/2024",
          idBovino: "B-003",
          pesoAnterior: "480 kg",
          pesoActual: "510 kg",
          ganancia: "+30 kg",
          cc: "3",
          responsable: "Ing. Ramírez",
          observaciones: "Buena ganancia en periodo",
        },
        {
          id: 3,
          codigo: "PES-003",
          fecha: "10/06/2024",
          idBovino: "B-002",
          pesoAnterior: "590 kg",
          pesoActual: "600 kg",
          ganancia: "+10 kg",
          cc: "4",
          responsable: "Ing. Ramírez",
          observaciones: "Ganancia baja, revisar alimentación",
        },
      ],
      stats: [
        {
          key: "registros",
          label: "Registros",
          compute: (d) => d.length,
          variant: "neutral",
        },
        {
          key: "hoy",
          label: "Hoy",
          compute: (d) => d.filter((r) => r.fecha === "10/06/2024").length,
          variant: "info",
        },
        {
          key: "ccOptima",
          label: "CC Óptima (4-5)",
          compute: (d) => d.filter((r) => Number(r.cc) >= 4).length,
          variant: "success",
        },
        {
          key: "ccBaja",
          label: "CC Baja (1-2)",
          compute: (d) => d.filter((r) => Number(r.cc) <= 2).length,
          variant: "danger",
        },
      ],
      filters: [],
      moreFilters: [],
    },
    {
      key: "medico",
      label: "Control Médico",
      singular: "Control Médico",
      prefix: "MED",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "fecha", label: "Fecha"},
        {key: "idBovino", label: "ID Bovino"},
        {
          key: "nombre",
          label: "Nombre",
          render: (row) => getBovinoByCodigo(row.idBovino).nombre,
        },
        {
          key: "raza",
          label: "Raza",
          render: (row) => getBovinoByCodigo(row.idBovino).tipoRaza,
        },
        {key: "tipo", label: "Tipo", badge: true},
        {key: "diagnostico", label: "Diagnóstico"},
        {key: "medicamento", label: "Medicamento"},
        {key: "dosis", label: "Dosis"},
        {key: "veterinario", label: "Veterinario"},
        {key: "proxima", label: "Próxima"},
        {key: "estado", label: "Estado", badge: true},
      ],
      formFields: [
        {key: "fecha", label: "Fecha", type: "date"},
        {
          key: "idBovino",
          label: "ID Bovino",
          type: "select",
          options: bovinoOptions,
        },
        {
          key: "tipo",
          label: "Tipo",
          type: "select",
          options: ["Vacuna", "Tratamiento", "Desparasitación", "Revisión"],
        },
        {key: "diagnostico", label: "Diagnóstico", type: "textarea"},
        {key: "medicamento", label: "Medicamento"},
        {key: "dosis", label: "Dosis", placeholder: "2 ml IM"},
        {key: "veterinario", label: "Veterinario"},
        {key: "proxima", label: "Próxima Revisión", type: "date"},
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["Completado", "En seguimiento", "Pendiente"],
        },
      ],
      initialData: [
        {
          id: 1,
          codigo: "MED-001",
          fecha: "08/06/2024",
          idBovino: "B-004",
          tipo: "Vacuna",
          diagnostico: "Refuerzo IBR/BVD vencido",
          medicamento: "Bovilis IBR",
          dosis: "2 ml IM",
          veterinario: "Dr. Pérez",
          proxima: "08/12/2024",
          estado: "Completado",
        },
        {
          id: 2,
          codigo: "MED-002",
          fecha: "07/06/2024",
          idBovino: "B-002",
          tipo: "Tratamiento",
          diagnostico: "Fiebre 40.2°C, pérdida de apetito",
          medicamento: "Oxitetraciclina + Flunixin",
          dosis: "10 ml IM + 5 ml IM",
          veterinario: "Dr. García",
          proxima: "14/06/2024",
          estado: "En seguimiento",
        },
      ],
      stats: [
        {
          key: "registros",
          label: "Registros",
          compute: (d) => d.length,
          variant: "neutral",
        },
        {
          key: "seguimiento",
          label: "En Seguimiento",
          compute: (d) => d.filter((r) => r.estado === "En seguimiento").length,
          variant: "info",
        },
        {
          key: "tratamientos",
          label: "Tratamientos",
          compute: (d) => d.filter((r) => r.tipo === "Tratamiento").length,
          variant: "warning",
        },
        {
          key: "pendientes",
          label: "Pendientes",
          compute: (d) => d.filter((r) => r.estado === "Pendiente").length,
          variant: "danger",
        },
      ],
      filters: [
        {
          key: "tipo",
          placeholder: "Tipo",
          options: ["Vacuna", "Tratamiento", "Desparasitación", "Revisión"],
        },
      ],
      moreFilters: [
        {
          key: "estado",
          placeholder: "Estado",
          options: ["Completado", "En seguimiento", "Pendiente"],
        },
      ],
    },
    {
      key: "dieta",
      label: "Dieta Diaria",
      singular: "Registro de Dieta",
      prefix: "DIE",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "fecha", label: "Fecha"},
        {key: "idBovino", label: "ID Bovino"},
        {key: "alimento", label: "Alimento"},
        {key: "cantidad", label: "Cantidad"},
        {key: "responsable", label: "Responsable"},
      ],
      formFields: [
        {key: "fecha", label: "Fecha", type: "date"},
        {
          key: "idBovino",
          label: "ID Bovino",
          type: "select",
          options: bovinoOptions,
        },
        {
          key: "alimento",
          label: "Alimento",
          type: "select",
          options: alimentoOptions,
        },
        {key: "cantidad", label: "Cantidad", placeholder: "5 kg"},
        {key: "responsable", label: "Responsable"},
      ],
      initialData: [
        {
          id: 1,
          codigo: "DIE-001",
          fecha: "10/06/2024",
          idBovino: "B-001",
          alimento: "Alimento A",
          cantidad: "5 kg",
          responsable: "Ing. Ramírez",
        },
      ],
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
      key: "crias",
      label: "Crías Nacidas",
      singular: "Cría Nacida",
      prefix: "CRN",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "fecha", label: "Fecha"},
        {key: "madre", label: "Madre"},
        {key: "sexo", label: "Sexo", badge: true},
        {key: "peso", label: "Peso al Nacer"},
      ],
      formFields: [
        {key: "fecha", label: "Fecha", type: "date"},
        {
          key: "madre",
          label: "Madre (ID Bovino)",
          type: "select",
          options: bovinoOptions,
        },
        {
          key: "sexo",
          label: "Sexo",
          type: "select",
          options: ["Macho", "Hembra"],
        },
        {key: "peso", label: "Peso al Nacer", placeholder: "38 kg"},
      ],
      initialData: [
        {
          id: 1,
          codigo: "CRN-001",
          fecha: "10/06/2024",
          madre: "B-005",
          sexo: "Hembra",
          peso: "38 kg",
        },
      ],
      stats: [
        {
          key: "registros",
          label: "Registros",
          compute: (d) => d.length,
          variant: "neutral",
        },
      ],
      filters: [
        {key: "sexo", placeholder: "Sexo", options: ["Macho", "Hembra"]},
      ],
      moreFilters: [],
    },
    {
      key: "partos",
      label: "Historial de Partos",
      singular: "Parto",
      prefix: "PAR",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "fecha", label: "Fecha"},
        {key: "idBovino", label: "ID Bovino (Madre)"},
        {key: "tipo", label: "Tipo de Parto"},
        {key: "estado", label: "Estado", badge: true},
      ],
      formFields: [
        {key: "fecha", label: "Fecha", type: "date"},
        {
          key: "idBovino",
          label: "ID Bovino (Madre)",
          type: "select",
          options: bovinoOptions,
        },
        {
          key: "tipo",
          label: "Tipo de Parto",
          placeholder: "Natural, Asistido...",
        },
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["Completado", "En seguimiento"],
        },
      ],
      initialData: [
        {
          id: 1,
          codigo: "PAR-001",
          fecha: "10/06/2024",
          idBovino: "B-005",
          tipo: "Natural",
          estado: "Completado",
        },
      ],
      stats: [
        {
          key: "registros",
          label: "Registros",
          compute: (d) => d.length,
          variant: "neutral",
        },
      ],
      filters: [
        {
          key: "estado",
          placeholder: "Estado",
          options: ["Completado", "En seguimiento"],
        },
      ],
      moreFilters: [],
    },
  ];

  const [activeTab, setActiveTab] = useState("pesaje");

  const [dataByTab, setDataByTab] = useState(() =>
    Object.fromEntries(tabsConfig.map((t) => [t.key, t.initialData])),
  );

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const currentConfig = tabsConfig.find((t) => t.key === activeTab);
  const currentData = dataByTab[activeTab];

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
    count: dataByTab[t.key].length,
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

  const handleCreate = () => {
    const list = dataByTab[activeTab];
    const nextId = list.length ? Math.max(...list.map((r) => r.id)) + 1 : 1;
    const codigo = `${currentConfig.prefix}-${String(nextId).padStart(3, "0")}`;

    setDataByTab((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], {id: nextId, codigo, ...newItem}],
    }));

    // Si el registro es un nacimiento, crea automáticamente la ficha
    // correspondiente en Catálogo → Crías, sin capturarla dos veces.
    if (activeTab === "crias") {
      addCriaFromNacimiento({
        madre: newItem.madre,
        sexo: newItem.sexo,
        peso: newItem.peso,
        fecha: newItem.fecha,
      });
    }

    setShowCreateModal(false);
    setToast({
      message: `${currentConfig.singular} registrado correctamente`,
      type: "success",
    });
  };

  const handleEdit = (row) => setEditingItem(row);

  const handleEditChange = (field, value) => {
    setEditingItem((prev) => ({...prev, [field]: value}));
  };

  const handleSaveEdit = () => {
    setDataByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((r) =>
        r.id === editingItem.id ? editingItem : r,
      ),
    }));
    setEditingItem(null);
    setToast({
      message: `${currentConfig.singular} actualizado correctamente`,
      type: "success",
    });
  };

  const handleDeleteClick = (row) => setItemToDelete(row);

  const handleConfirmDelete = () => {
    setDataByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((r) => r.id !== itemToDelete.id),
    }));
    setItemToDelete(null);
    setToast({
      message: `${currentConfig.singular} eliminado correctamente`,
      type: "success",
    });
  };

  return (
    <div>
      <div className="bitacora-header-top">
        <div>
          <h1>Bitácora Ganadera</h1>
          <p>Pesaje · Control Médico · Dieta · Crías · Partos</p>
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
        searchPlaceholder="Buscar bovino, ID..."
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
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
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

      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Editar ${currentConfig.singular}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingItem(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar</Button>
          </>
        }
      >
        {editingItem && (
          <DynamicForm
            fields={currentConfig.formFields}
            values={editingItem}
            onChange={handleEditChange}
          />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemLabel={`registro de ${currentConfig.singular.toLowerCase()}`}
        itemName={itemToDelete?.nombre}
        itemId={itemToDelete?.codigo}
        itemType={itemToDelete?.tipo || itemToDelete?.estado}
      />

      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Bitacora;
