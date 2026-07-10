import {useState, useMemo} from "react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import DynamicForm from "../components/DynamicForm";
import FilterBar from "../components/FilterBar";
import "./Catalogo.css";

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
      {
        id: 4,
        codigo: "RZ-004",
        nombre: "Charolais",
        origen: "Francia",
        tipo: "Cárnica",
        peso: "560 kg",
        resistencia: "Media",
        descripcion: "Raza grande, buena calidad de carne",
        estado: "Activa",
      },
      {
        id: 5,
        codigo: "RZ-005",
        nombre: "Jersey",
        origen: "Reino Unido",
        tipo: "Lechera",
        peso: "480 kg",
        resistencia: "Baja",
        descripcion: "Lechera compacta, leche cremosa",
        estado: "Activa",
      },
      {
        id: 6,
        codigo: "RZ-006",
        nombre: "Brahman",
        origen: "India",
        tipo: "Doble Propósito",
        peso: "620 kg",
        resistencia: "Alta",
        descripcion: "Raza resistente al calor y parásitos",
        estado: "Activa",
      },
      {
        id: 7,
        codigo: "RZ-007",
        nombre: "Simmental",
        origen: "Suiza",
        tipo: "Doble Propósito",
        peso: "630 kg",
        resistencia: "Media",
        descripcion: "Versátil para carne y leche",
        estado: "Activa",
      },
      {
        id: 8,
        codigo: "RZ-008",
        nombre: "Brangus",
        origen: "Estados Unidos",
        tipo: "Cárnica",
        peso: "540 kg",
        resistencia: "Alta",
        descripcion: "Cruce resistente con carne de calidad",
        estado: "Activa",
      },
      {
        id: 9,
        codigo: "RZ-009",
        nombre: "Gyr",
        origen: "Brasil",
        tipo: "Lechera",
        peso: "590 kg",
        resistencia: "Alta",
        descripcion: "Raza de leche tropical resistente",
        estado: "Activa",
      },
      {
        id: 10,
        codigo: "RZ-010",
        nombre: "Malagueña",
        origen: "España",
        tipo: "Doble Propósito",
        peso: "530 kg",
        resistencia: "Media",
        descripcion: "Raza ibérica para carne y leche",
        estado: "Activa",
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
      {
        id: 2,
        codigo: "VAC-002",
        nombre: "Vacuna B",
        laboratorio: "Lab B",
        dosis: "1.5 ml IM",
        frecuencia: "Semestral",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "VAC-003",
        nombre: "Vacuna C",
        laboratorio: "Lab C",
        dosis: "3 ml IM",
        frecuencia: "Bienal",
        estado: "Inactiva",
      },
      {
        id: 4,
        codigo: "VAC-004",
        nombre: "Vacuna D",
        laboratorio: "Lab D",
        dosis: "2 ml SC",
        frecuencia: "Anual",
        estado: "Activa",
      },
      {
        id: 5,
        codigo: "VAC-005",
        nombre: "Vacuna E",
        laboratorio: "Lab E",
        dosis: "1 ml IM",
        frecuencia: "Trimestral",
        estado: "Activa",
      },
      {
        id: 6,
        codigo: "VAC-006",
        nombre: "Vacuna F",
        laboratorio: "Lab F",
        dosis: "2.5 ml IM",
        frecuencia: "Anual",
        estado: "Activa",
      },
      {
        id: 7,
        codigo: "VAC-007",
        nombre: "Vacuna G",
        laboratorio: "Lab G",
        dosis: "2 ml SC",
        frecuencia: "Bienal",
        estado: "Inactiva",
      },
      {
        id: 8,
        codigo: "VAC-008",
        nombre: "Vacuna H",
        laboratorio: "Lab H",
        dosis: "1.5 ml IM",
        frecuencia: "Anual",
        estado: "Activa",
      },
      {
        id: 9,
        codigo: "VAC-009",
        nombre: "Vacuna I",
        laboratorio: "Lab I",
        dosis: "3 ml IM",
        frecuencia: "Semestral",
        estado: "Activa",
      },
      {
        id: 10,
        codigo: "VAC-010",
        nombre: "Vacuna J",
        laboratorio: "Lab J",
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
    initialData: [
      {
        id: 1,
        codigo: "ALI-001",
        nombre: "Alimento A",
        tipo: "Forraje",
        proveedor: "Proveedor A",
        costoUnitario: "$100.00",
        estado: "Activa",
      },
      {
        id: 2,
        codigo: "ALI-002",
        nombre: "Alimento B",
        tipo: "Concentrado",
        proveedor: "Proveedor B",
        costoUnitario: "$120.00",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "ALI-003",
        nombre: "Alimento C",
        tipo: "Heno",
        proveedor: "Proveedor C",
        costoUnitario: "$95.50",
        estado: "Inactiva",
      },
      {
        id: 4,
        codigo: "ALI-004",
        nombre: "Alimento D",
        tipo: "Mineral",
        proveedor: "Proveedor D",
        costoUnitario: "$110.25",
        estado: "Activa",
      },
      {
        id: 5,
        codigo: "ALI-005",
        nombre: "Alimento E",
        tipo: "Suplemento",
        proveedor: "Proveedor E",
        costoUnitario: "$130.75",
        estado: "Activa",
      },
      {
        id: 6,
        codigo: "ALI-006",
        nombre: "Alimento F",
        tipo: "Forraje",
        proveedor: "Proveedor F",
        costoUnitario: "$105.00",
        estado: "Inactiva",
      },
      {
        id: 7,
        codigo: "ALI-007",
        nombre: "Alimento G",
        tipo: "Concentrado",
        proveedor: "Proveedor G",
        costoUnitario: "$115.90",
        estado: "Activa",
      },
      {
        id: 8,
        codigo: "ALI-008",
        nombre: "Alimento H",
        tipo: "Heno",
        proveedor: "Proveedor H",
        costoUnitario: "$98.40",
        estado: "Activa",
      },
      {
        id: 9,
        codigo: "ALI-009",
        nombre: "Alimento I",
        tipo: "Mineral",
        proveedor: "Proveedor I",
        costoUnitario: "$125.60",
        estado: "Inactiva",
      },
      {
        id: 10,
        codigo: "ALI-010",
        nombre: "Alimento J",
        tipo: "Suplemento",
        proveedor: "Proveedor J",
        costoUnitario: "$140.00",
        estado: "Activa",
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
        madre: "VACA-001",
        fechaNacimiento: "2023-01-15",
        pesoNacimiento: "38 kg",
        estado: "Lactante",
      },
      {
        id: 2,
        codigo: "CRI-002",
        nombre: "Cría B",
        sexo: "Hembra",
        raza: "Hereford",
        madre: "VACA-002",
        fechaNacimiento: "2023-02-08",
        pesoNacimiento: "36 kg",
        estado: "Lactante",
      },
      {
        id: 3,
        codigo: "CRI-003",
        nombre: "Cría C",
        sexo: "Macho",
        raza: "Charolais",
        madre: "VACA-003",
        fechaNacimiento: "2023-03-12",
        pesoNacimiento: "40 kg",
        estado: "Destete",
      },
      {
        id: 4,
        codigo: "CRI-004",
        nombre: "Cría D",
        sexo: "Hembra",
        raza: "Limousin",
        madre: "VACA-004",
        fechaNacimiento: "2023-04-20",
        pesoNacimiento: "34 kg",
        estado: "Desarrollo",
      },
      {
        id: 5,
        codigo: "CRI-005",
        nombre: "Cría E",
        sexo: "Macho",
        raza: "Simmental",
        madre: "VACA-005",
        fechaNacimiento: "2023-05-05",
        pesoNacimiento: "42 kg",
        estado: "Destete",
      },
      {
        id: 6,
        codigo: "CRI-006",
        nombre: "Cría F",
        sexo: "Hembra",
        raza: "Brangus",
        madre: "VACA-006",
        fechaNacimiento: "2023-06-18",
        pesoNacimiento: "37 kg",
        estado: "Lactante",
      },
      {
        id: 7,
        codigo: "CRI-007",
        nombre: "Cría G",
        sexo: "Macho",
        raza: "Brahman",
        madre: "VACA-007",
        fechaNacimiento: "2023-07-09",
        pesoNacimiento: "39 kg",
        estado: "Desarrollo",
      },
      {
        id: 8,
        codigo: "CRI-008",
        nombre: "Cría H",
        sexo: "Hembra",
        raza: "Murray Grey",
        madre: "VACA-008",
        fechaNacimiento: "2023-08-01",
        pesoNacimiento: "35 kg",
        estado: "Destete",
      },
      {
        id: 9,
        codigo: "CRI-009",
        nombre: "Cría I",
        sexo: "Macho",
        raza: "Santa Gertrudis",
        madre: "VACA-009",
        fechaNacimiento: "2023-09-14",
        pesoNacimiento: "41 kg",
        estado: "Lactante",
      },
      {
        id: 10,
        codigo: "CRI-010",
        nombre: "Cría J",
        sexo: "Hembra",
        raza: "Angus",
        madre: "VACA-010",
        fechaNacimiento: "2023-10-22",
        pesoNacimiento: "33 kg",
        estado: "Desarrollo",
      },
    ],
    filters: [{key: "sexo", placeholder: "Sexo", options: ["Macho", "Hembra"]}],
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
        estado: "Activo",
      },
      {
        id: 2,
        codigo: "SEM-002",
        nombre: "Semental B",
        raza: "Hereford",
        edad: "3 años",
        estado: "Activo",
      },
      {
        id: 3,
        codigo: "SEM-003",
        nombre: "Semental C",
        raza: "Brahman",
        edad: "5 años",
        estado: "Inactiva",
      },
      {
        id: 4,
        codigo: "SEM-004",
        nombre: "Semental D",
        raza: "Charolais",
        edad: "2 años",
        estado: "Activo",
      },
      {
        id: 5,
        codigo: "SEM-005",
        nombre: "Semental E",
        raza: "Angus",
        edad: "6 años",
        estado: "Activo",
      },
      {
        id: 6,
        codigo: "SEM-006",
        nombre: "Semental F",
        raza: "Hereford",
        edad: "4 años",
        estado: "Inactiva",
      },
      {
        id: 7,
        codigo: "SEM-007",
        nombre: "Semental G",
        raza: "Brahman",
        edad: "3 años",
        estado: "Activo",
      },
      {
        id: 8,
        codigo: "SEM-008",
        nombre: "Semental H",
        raza: "Charolais",
        edad: "5 años",
        estado: "Activo",
      },
      {
        id: 9,
        codigo: "SEM-009",
        nombre: "Semental I",
        raza: "Angus",
        edad: "2 años",
        estado: "Inactiva",
      },
      {
        id: 10,
        codigo: "SEM-010",
        nombre: "Semental J",
        raza: "Hereford",
        edad: "4 años",
        estado: "Activo",
      },
    ],
    filters: [
      {key: "estado", placeholder: "Estado", options: ["Activo", "Inactiva"]},
    ],
    moreFilters: [],
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
        telefono: "555-1234",
        estado: "Activa",
      },
      {
        id: 2,
        codigo: "COMP-002",
        nombre: "Comprador B",
        tipo: "Particular",
        telefono: "555-2345",
        estado: "Activa",
      },
      {
        id: 3,
        codigo: "COMP-003",
        nombre: "Distribuciones Sol",
        tipo: "Distribuidor",
        telefono: "555-3456",
        estado: "Activa",
      },
      {
        id: 4,
        codigo: "COMP-004",
        nombre: "Comprador C",
        tipo: "Agro",
        telefono: "555-4567",
        estado: "Inactiva",
      },
      {
        id: 5,
        codigo: "COMP-005",
        nombre: "Familia López",
        tipo: "Particular",
        telefono: "555-5678",
        estado: "Activa",
      },
      {
        id: 6,
        codigo: "COMP-006",
        nombre: "Agroexport SRL",
        tipo: "Agro",
        telefono: "555-6789",
        estado: "Activa",
      },
      {
        id: 7,
        codigo: "COMP-007",
        nombre: "Mercado Central",
        tipo: "Distribuidor",
        telefono: "555-7890",
        estado: "Inactiva",
      },
      {
        id: 8,
        codigo: "COMP-008",
        nombre: "Comprador D",
        tipo: "Particular",
        telefono: "555-8901",
        estado: "Activa",
      },
      {
        id: 9,
        codigo: "COMP-009",
        nombre: "Cooperativa Verde",
        tipo: "Agro",
        telefono: "555-9012",
        estado: "Activa",
      },
      {
        id: 10,
        codigo: "COMP-010",
        nombre: "Distribuciones Norte",
        tipo: "Distribuidor",
        telefono: "555-0123",
        estado: "Inactiva",
      },
    ],
    filters: [
      {
        key: "tipo",
        placeholder: "Tipo",
        options: ["Agro", "Particular", "Distribuidor"],
      },
    ],
    moreFilters: [
      {key: "estado", placeholder: "Estado", options: ["Activa", "Inactiva"]},
    ],
  },
];

const Catalogo = () => {
  const [activeTab, setActiveTab] = useState("razas");

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
