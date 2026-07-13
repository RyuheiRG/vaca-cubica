import {useState, useMemo} from "react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import DynamicForm from "../components/DynamicForm";
import FilterBar from "../components/FilterBar";
import {useRazas} from "../context/RazasContext";
import {useBovinos} from "../context/BovinosContext";
import {useCrias} from "../context/CriasContext";
import {useAlimentos} from "../context/AlimentosContext";
import "./Catalogo.css";

const Catalogo = () => {
  const {razas, setRazas} = useRazas();
  const {bovinos, getBovinoByCodigo} = useBovinos();
  const {crias, setCrias} = useCrias();
  const {alimentos, setAlimentos} = useAlimentos();
  const nombresRazas = razas.map((r) => r.nombre);
  const bovinoOptions = bovinos.map((b) => ({
    value: b.codigo,
    label: `${b.codigo} — ${b.nombre}`,
  }));

  const tabsConfig = [
    {
      key: "razas",
      label: "Razas",
      singular: "Raza",
      prefix: "RZ",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "nombre", label: "Nombre"},
        {key: "origen", label: "Origen"},
        {key: "tipo", label: "Tipo", badge: true},
        {key: "peso", label: "Peso Prom."},
        {key: "resistencia", label: "Resistencia", badge: true},
        {key: "descripcion", label: "Descripción"},
        {key: "estado", label: "Estado", badge: true},
      ],
      formFields: [
        {key: "nombre", label: "Nombre"},
        {key: "origen", label: "Origen"},
        {
          key: "tipo",
          label: "Tipo",
          type: "select",
          options: ["Cárnica", "Lechera", "Doble Propósito"],
        },
        {key: "peso", label: "Peso Promedio", placeholder: "550 kg"},
        {
          key: "resistencia",
          label: "Resistencia",
          type: "select",
          options: ["Alta", "Media", "Baja"],
        },
        {key: "descripcion", label: "Descripción", type: "textarea"},
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["Activa", "Inactiva"],
        },
      ],
      filters: [
        {
          key: "tipo",
          placeholder: "Tipo",
          options: ["Cárnica", "Lechera", "Doble Propósito"],
        },
      ],
      moreFilters: [
        {
          key: "resistencia",
          placeholder: "Resistencia",
          options: ["Alta", "Media", "Baja"],
        },
        {key: "estado", placeholder: "Estado", options: ["Activa", "Inactiva"]},
      ],
    },
    {
      key: "vacunas",
      label: "Vacunas",
      singular: "Vacuna",
      prefix: "VAC",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "nombre", label: "Nombre"},
        {key: "laboratorio", label: "Laboratorio"},
        {key: "dosis", label: "Dosis"},
        {key: "frecuencia", label: "Frecuencia"},
        {key: "estado", label: "Estado", badge: true},
      ],
      formFields: [
        {key: "nombre", label: "Nombre"},
        {key: "laboratorio", label: "Laboratorio"},
        {key: "dosis", label: "Dosis", placeholder: "2 ml IM"},
        {key: "frecuencia", label: "Frecuencia", placeholder: "Anual"},
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["Activa", "Inactiva"],
        },
      ],
      initialData: [
        {
          id: 1,
          codigo: "VAC-001",
          nombre: "Vacuna A",
          laboratorio: "Lab A",
          dosis: "2 ml IM",
          frecuencia: "Anual",
          estado: "Activa",
        },
      ],
      filters: [
        {key: "estado", placeholder: "Estado", options: ["Activa", "Inactiva"]},
      ],
      moreFilters: [],
    },
    {
      key: "alimentos",
      label: "Alimentos",
      singular: "Alimento",
      prefix: "ALI",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "nombre", label: "Nombre"},
        {key: "tipo", label: "Tipo"},
        {key: "proveedor", label: "Proveedor"},
        {key: "costoUnitario", label: "Costo Unitario"},
        {key: "estado", label: "Estado", badge: true},
      ],
      formFields: [
        {key: "nombre", label: "Nombre"},
        {key: "tipo", label: "Tipo", placeholder: "Forraje, concentrado..."},
        {key: "proveedor", label: "Proveedor"},
        {key: "costoUnitario", label: "Costo Unitario", placeholder: "$120.00"},
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["Activa", "Inactiva"],
        },
      ],
      filters: [
        {key: "estado", placeholder: "Estado", options: ["Activa", "Inactiva"]},
      ],
      moreFilters: [],
    },
    {
      key: "crias",
      label: "Crías",
      singular: "Cría",
      prefix: "CRI",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "nombre", label: "Nombre"},
        {key: "sexo", label: "Sexo", badge: true},
        {
          key: "raza",
          label: "Raza",
          render: (row) => getBovinoByCodigo(row.madre).tipoRaza,
        },
        {key: "madre", label: "Madre"},
        {key: "fechaNacimiento", label: "F. Nacimiento"},
        {key: "pesoActual", label: "Peso Actual"},
        {key: "estado", label: "Estado", badge: true},
      ],
      formFields: [
        {key: "nombre", label: "Nombre"},
        {
          key: "sexo",
          label: "Sexo",
          type: "select",
          options: ["Macho", "Hembra"],
        },
        {
          key: "madre",
          label: "Madre (ID Bovino)",
          type: "select",
          options: bovinoOptions,
        },
        {key: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date"},
        {key: "pesoActual", label: "Peso Actual", placeholder: "112 kg"},
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["Lactante", "Destete", "Desarrollo"],
        },
      ],
      filters: [
        {key: "sexo", placeholder: "Sexo", options: ["Macho", "Hembra"]},
      ],
      moreFilters: [
        {
          key: "estado",
          placeholder: "Estado",
          options: ["Lactante", "Destete", "Desarrollo"],
        },
      ],
    },
    {
      key: "sementales",
      label: "Sementales",
      singular: "Semental",
      prefix: "SEM",
      columns: [
        {key: "codigo", label: "ID"},
        {key: "nombre", label: "Nombre"},
        {key: "raza", label: "Raza"},
        {key: "edad", label: "Edad"},
        {key: "estado", label: "Estado", badge: true},
      ],
      formFields: [
        {key: "nombre", label: "Nombre"},
        {key: "raza", label: "Raza", type: "select", options: nombresRazas},
        {key: "edad", label: "Edad", placeholder: "4 años"},
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["Activa", "Inactiva"],
        },
      ],
      initialData: [
        {
          id: 1,
          codigo: "SEM-001",
          nombre: "Toro Alfa",
          raza: "Angus",
          edad: "4 años",
          estado: "Activa",
        },
      ],
      filters: [
        {key: "estado", placeholder: "Estado", options: ["Activa", "Inactiva"]},
      ],
      moreFilters: [],
    },
  ];

  const [activeTab, setActiveTab] = useState("razas");

  // Estado local SOLO para pestañas que no viven en un Context compartido.
  const [dataByTab, setDataByTab] = useState(() =>
    Object.fromEntries(
      tabsConfig
        .filter(
          (t) =>
            t.key !== "razas" && t.key !== "crias" && t.key !== "alimentos",
        )
        .map((t) => [t.key, t.initialData]),
    ),
  );

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const currentConfig = tabsConfig.find((t) => t.key === activeTab);
  const isRazasTab = activeTab === "razas";
  const isCriasTab = activeTab === "crias";
  const isAlimentosTab = activeTab === "alimentos";

  const currentData = isRazasTab
    ? razas
    : isCriasTab
      ? crias
      : isAlimentosTab
        ? alimentos
        : dataByTab[activeTab];

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
    count:
      t.key === "razas"
        ? razas.length
        : t.key === "crias"
          ? crias.length
          : t.key === "alimentos"
            ? alimentos.length
            : dataByTab[t.key].length,
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
    const list = isRazasTab
      ? razas
      : isCriasTab
        ? crias
        : isAlimentosTab
          ? alimentos
          : dataByTab[activeTab];
    const nextId = list.length ? Math.max(...list.map((r) => r.id)) + 1 : 1;
    const codigo = `${currentConfig.prefix}-${String(nextId).padStart(3, "0")}`;
    const newRecord = {id: nextId, codigo, ...newItem};

    if (isRazasTab) {
      setRazas((prev) => [...prev, newRecord]);
    } else if (isCriasTab) {
      setCrias((prev) => [...prev, newRecord]);
    } else if (isAlimentosTab) {
      setAlimentos((prev) => [...prev, newRecord]);
    } else {
      setDataByTab((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newRecord],
      }));
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
    if (isRazasTab) {
      setRazas((prev) =>
        prev.map((r) => (r.id === editingItem.id ? editingItem : r)),
      );
    } else if (isCriasTab) {
      setCrias((prev) =>
        prev.map((r) => (r.id === editingItem.id ? editingItem : r)),
      );
    } else if (isAlimentosTab) {
      setAlimentos((prev) =>
        prev.map((r) => (r.id === editingItem.id ? editingItem : r)),
      );
    } else {
      setDataByTab((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((r) =>
          r.id === editingItem.id ? editingItem : r,
        ),
      }));
    }
    setEditingItem(null);
    setToast({
      message: `${currentConfig.singular} actualizado correctamente`,
      type: "success",
    });
  };

  const handleDeleteClick = (row) => setItemToDelete(row);

  const handleConfirmDelete = () => {
    if (isRazasTab) {
      setRazas((prev) => prev.filter((r) => r.id !== itemToDelete.id));
    } else if (isCriasTab) {
      setCrias((prev) => prev.filter((r) => r.id !== itemToDelete.id));
    } else if (isAlimentosTab) {
      setAlimentos((prev) => prev.filter((r) => r.id !== itemToDelete.id));
    } else {
      setDataByTab((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((r) => r.id !== itemToDelete.id),
      }));
    }
    setItemToDelete(null);
    setToast({
      message: `${currentConfig.singular} eliminado correctamente`,
      type: "success",
    });
  };

  return (
    <div>
      <div className="catalogo-header-top">
        <div>
          <h1>Gestión de Catálogos</h1>
          <p>Razas · Vacunas · Alimentos · Crías · Sementales</p>
        </div>
        <Button icon="+" onClick={handleOpenCreate}>
          Nueva {currentConfig.singular}
        </Button>
      </div>

      <Tabs
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={`Buscar en ${currentConfig.label.toLowerCase()}...`}
        filters={currentConfig.filters || []}
        moreFilters={currentConfig.moreFilters || []}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      <div className="catalogo-card">
        <div className="catalogo-card-header">
          <h3>
            {currentConfig.label} <span>— {filteredData.length} registros</span>
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
        title={`Nueva ${currentConfig.singular}`}
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

export default Catalogo;
