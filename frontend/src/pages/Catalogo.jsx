import {useState, useMemo} from "react";
import {Search} from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import DynamicForm from "../components/DynamicForm";
import "./Catalogo.css";

// ---------- CONFIGURACIÓN POR PESTAÑA ----------
// Aquí es donde se define cada catálogo: sus columnas, sus campos de
// formulario y sus datos iniciales. Agregar una pestaña nueva en el futuro
// solo requiere agregar un objeto aquí, sin tocar el resto del archivo.
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
    initialData: [
      {
        id: 1,
        codigo: "RZ-001",
        nombre: "Angus",
        origen: "Escocia",
        tipo: "Cárnica",
        peso: "550 kg",
        resistencia: "Alta",
        descripcion: "Raza cárnica de élite, sin cuernos",
        estado: "Activa",
      },
      {
        id: 2,
        codigo: "RZ-002",
        nombre: "Hereford",
        origen: "Inglaterra",
        tipo: "Cárnica",
        peso: "520 kg",
        resistencia: "Alta",
        descripcion: "Raza rústica, buena conversión",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "RZ-003",
        nombre: "Holstein",
        origen: "Países Bajos",
        tipo: "Lechera",
        peso: "650 kg",
        resistencia: "Media",
        descripcion: "Mayor productora de leche",
        estado: "Activa",
      },
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
      {
        id: 2,
        codigo: "VAC-002",
        nombre: "Vacuna B",
        laboratorio: "Lab B",
        dosis: "1 ml IM",
        frecuencia: "Semestral",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "VAC-003",
        nombre: "Vacuna C",
        laboratorio: "Lab C",
        dosis: "3 ml IM",
        frecuencia: "Trimestral",
        estado: "Activa",
      },
    ],
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
    initialData: [
      {
        id: 1,
        codigo: "ALI-001",
        nombre: "Alimento A",
        tipo: "Forraje",
        proveedor: "Proveedor A",
        costoUnitario: "$120.00",
        estado: "Activa",
      },
      {
        id: 2,
        codigo: "ALI-002",
        nombre: "Alimento B",
        tipo: "Concentrado",
        proveedor: "Proveedor B",
        costoUnitario: "$150.00",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "ALI-003",
        nombre: "Alimento C",
        tipo: "Forraje",
        proveedor: "Proveedor C",
        costoUnitario: "$100.00",
        estado: "Activa",
      },
    ],
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
      {key: "raza", label: "Raza"},
      {key: "madre", label: "Madre"},
      {key: "fechaNacimiento", label: "F. Nacimiento"},
      {key: "pesoNacimiento", label: "Peso Nac."},
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
      {key: "raza", label: "Raza"},
      {key: "madre", label: "Madre (ID Bovino)"},
      {key: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date"},
      {key: "pesoNacimiento", label: "Peso al Nacer", placeholder: "38 kg"},
      {
        key: "estado",
        label: "Estado",
        type: "select",
        options: ["Lactante", "Destete", "Desarrollo"],
      },
    ],
    initialData: [
      {
        id: 1,
        codigo: "CRI-001",
        nombre: "Cría A",
        sexo: "Macho",
        raza: "Angus",
        madre: "RZ-001",
        fechaNacimiento: "2023-01-15",
        pesoNacimiento: "38 kg",
        estado: "Desarrollo",
      },
      {
        id: 2,
        codigo: "CRI-002",
        nombre: "Cría B",
        sexo: "Hembra",
        raza: "Angus",
        madre: "RZ-002",
        fechaNacimiento: "2023-01-15",
        pesoNacimiento: "38 kg",
        estado: "Desarrollo",
      },
      {
        id: 3,
        codigo: "CRI-003",
        nombre: "Cría C",
        sexo: "Macho",
        raza: "Angus",
        madre: "RZ-003",
        fechaNacimiento: "2023-01-15",
        pesoNacimiento: "38 kg",
        estado: "Lactante",
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
      {key: "raza", label: "Raza"},
      {key: "edad", label: "Edad", placeholder: "4 años"},
      {
        key: "estado",
        label: "Estado",
        type: "select",
        options: ["Activo", "Inactiva"],
      },
    ],
    initialData: [
      {
        id: 1,
        codigo: "SEM-001",
        nombre: "Semental A",
        raza: "Angus",
        edad: "4 años",
        estado: "Activa",
      },
      {
        id: 2,
        codigo: "SEM-002",
        nombre: "Semental B",
        raza: "Angus",
        edad: "4 años",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "SEM-003",
        nombre: "Semental C",
        raza: "Angus",
        edad: "4 años",
        estado: "Activa",
      },
    ],
  },
  {
    key: "compradores",
    label: "Compradores",
    singular: "Comprador",
    prefix: "COMP",
    columns: [
      {key: "codigo", label: "ID"},
      {key: "nombre", label: "Nombre / Empresa"},
      {key: "tipo", label: "Tipo"},
      {key: "telefono", label: "Teléfono"},
      {key: "estado", label: "Estado", badge: true},
    ],
    formFields: [
      {key: "nombre", label: "Nombre / Empresa"},
      {key: "tipo", label: "Tipo", placeholder: "Agro, Particular..."},
      {key: "telefono", label: "Teléfono"},
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
        codigo: "COMP-001",
        nombre: "Comprador A",
        tipo: "Agro",
        telefono: "123456789",
        estado: "Activa",
      },
      {
        id: 2,
        codigo: "COMP-002",
        nombre: "Comprador B",
        tipo: "Particular",
        telefono: "987654321",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "COMP-003",
        nombre: "Comprador C",
        tipo: "Particular",
        telefono: "555555555",
        estado: "Activa",
      },
    ],
  },
];

const Catalogo = () => {
  const [activeTab, setActiveTab] = useState("razas");

  // Un solo estado: objeto con un arreglo de datos por cada pestaña
  const [dataByTab, setDataByTab] = useState(() =>
    Object.fromEntries(tabsConfig.map((t) => [t.key, t.initialData])),
  );

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const currentConfig = tabsConfig.find((t) => t.key === activeTab);
  const currentData = dataByTab[activeTab];

  const filteredData = useMemo(() => {
    if (!search.trim()) return currentData;
    const term = search.toLowerCase();
    return currentData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
  }, [currentData, search]);

  const tabsWithCounts = tabsConfig.map((t) => ({
    key: t.key,
    label: t.label,
    count: dataByTab[t.key].length,
  }));

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearch(""); // limpia el buscador al cambiar de pestaña
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
      <div className="catalogo-header-top">
        <div>
          <h1>Gestión de Catálogos</h1>
          <p>Razas · Vacunas · Alimentos · Crías · Sementales · Compradores</p>
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

      <div className="catalogo-card">
        <div className="catalogo-card-header">
          <h3>
            {currentConfig.label} <span>— {currentData.length} registros</span>
          </h3>
          <div className="catalogo-search">
            <Search size={16} />
            <input
              placeholder={`Buscar en ${currentConfig.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={currentConfig.columns}
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Registrar nuevo */}
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

      {/* Editar existente */}
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
