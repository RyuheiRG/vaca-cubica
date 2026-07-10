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

// ---------- CONFIGURACIÓN POR PESTAÑA ----------
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
      {key: "nombre", label: "Nombre"},
      {key: "raza", label: "Raza"},
      {key: "pesoAnterior", label: "Peso Anterior"},
      {key: "pesoActual", label: "Peso Actual"},
      {key: "ganancia", label: "Ganancia", render: ganaciaRender},
      {key: "cc", label: "CC (1-5)", render: ccRender},
      {key: "responsable", label: "Responsable"},
      {key: "observaciones", label: "Observaciones"},
    ],
    formFields: [
      {key: "fecha", label: "Fecha", type: "date"},
      {key: "idBovino", label: "ID Bovino"},
      {key: "nombre", label: "Nombre"},
      {key: "raza", label: "Raza"},
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
        idBovino: "BOV-101",
        nombre: "Estrella",
        raza: "Holstein",
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
        idBovino: "BOV-102",
        nombre: "Luna",
        raza: "Angus",
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
        idBovino: "BOV-103",
        nombre: "Toro Rey",
        raza: "Brahman",
        pesoAnterior: "590 kg",
        pesoActual: "600 kg",
        ganancia: "+10 kg",
        cc: "4",
        responsable: "Ing. Ramírez",
        observaciones: "Ganancia baja, revisar alimentación",
      },
      {
        id: 4,
        codigo: "PES-004",
        fecha: "11/06/2024",
        idBovino: "BOV-104",
        nombre: "Sol",
        raza: "Hereford",
        pesoAnterior: "520 kg",
        pesoActual: "545 kg",
        ganancia: "+25 kg",
        cc: "4",
        responsable: "Téc. Gómez",
        observaciones: "Buen progreso",
      },
      {
        id: 5,
        codigo: "PES-005",
        fecha: "11/06/2024",
        idBovino: "BOV-105",
        nombre: "Nube",
        raza: "Charolais",
        pesoAnterior: "430 kg",
        pesoActual: "455 kg",
        ganancia: "+25 kg",
        cc: "3",
        responsable: "Téc. Gómez",
        observaciones: "Salud estable",
      },
      {
        id: 6,
        codigo: "PES-006",
        fecha: "12/06/2024",
        idBovino: "BOV-106",
        nombre: "Rayo",
        raza: "Limousin",
        pesoAnterior: "610 kg",
        pesoActual: "630 kg",
        ganancia: "+20 kg",
        cc: "5",
        responsable: "Ing. Pérez",
        observaciones: "Excelente condición",
      },
      {
        id: 7,
        codigo: "PES-007",
        fecha: "12/06/2024",
        idBovino: "BOV-107",
        nombre: "Brisa",
        raza: "Simbrah",
        pesoAnterior: "470 kg",
        pesoActual: "485 kg",
        ganancia: "+15 kg",
        cc: "3",
        responsable: "Ing. Pérez",
        observaciones: "Recuperación",
      },
      {
        id: 8,
        codigo: "PES-008",
        fecha: "13/06/2024",
        idBovino: "BOV-108",
        nombre: "Trueno",
        raza: "Braford",
        pesoAnterior: "700 kg",
        pesoActual: "720 kg",
        ganancia: "+20 kg",
        cc: "5",
        responsable: "Téc. Martínez",
        observaciones: "Peso objetivo alcanzable",
      },
      {
        id: 9,
        codigo: "PES-009",
        fecha: "13/06/2024",
        idBovino: "BOV-109",
        nombre: "Cielo",
        raza: "Holstein",
        pesoAnterior: "360 kg",
        pesoActual: "380 kg",
        ganancia: "+20 kg",
        cc: "2",
        responsable: "Téc. Martínez",
        observaciones: "Requiere ajuste en dieta",
      },
      {
        id: 10,
        codigo: "PES-010",
        fecha: "14/06/2024",
        idBovino: "BOV-110",
        nombre: "Granizo",
        raza: "Angus",
        pesoAnterior: "550 kg",
        pesoActual: "575 kg",
        ganancia: "+25 kg",
        cc: "4",
        responsable: "Ing. Ramírez",
        observaciones: "Progreso consistente",
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
      {key: "nombre", label: "Nombre"},
      {key: "raza", label: "Raza"},
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
      {key: "idBovino", label: "ID Bovino"},
      {key: "nombre", label: "Nombre"},
      {key: "raza", label: "Raza"},
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
        idBovino: "BOV-104",
        nombre: "Princesa",
        raza: "Hereford",
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
        idBovino: "BOV-110",
        nombre: "Negrita",
        raza: "Angus",
        tipo: "Tratamiento",
        diagnostico: "Fiebre 40.2°C, pérdida de apetito",
        medicamento: "Oxitetraciclina + Flunixin",
        dosis: "10 ml IM + 5 ml IM",
        veterinario: "Dr. García",
        proxima: "14/06/2024",
        estado: "En seguimiento",
      },
      {
        id: 3,
        codigo: "MED-003",
        fecha: "01/05/2024",
        idBovino: "BOV-115",
        nombre: "Luna",
        raza: "Holstein",
        tipo: "Desparasitación",
        diagnostico: "Desparasitación rutinaria",
        medicamento: "Ivermectina",
        dosis: "1 ml SC",
        veterinario: "Dr. Morales",
        proxima: "01/11/2024",
        estado: "Completado",
      },
      {
        id: 4,
        codigo: "MED-004",
        fecha: "15/06/2024",
        idBovino: "BOV-120",
        nombre: "Rayo",
        raza: "Charolais",
        tipo: "Revisión",
        diagnostico: "Revisión preñada",
        medicamento: "N/A",
        dosis: "N/A",
        veterinario: "Dra. López",
        proxima: "15/07/2024",
        estado: "Pendiente",
      },
      {
        id: 5,
        codigo: "MED-005",
        fecha: "20/04/2024",
        idBovino: "BOV-101",
        nombre: "Canelo",
        raza: "Limousin",
        tipo: "Tratamiento",
        diagnostico: "Lesión en pata trasera",
        medicamento: "Antiinflamatorio",
        dosis: "5 ml IM",
        veterinario: "Dr. Ruiz",
        proxima: "27/04/2024",
        estado: "Completado",
      },
      {
        id: 6,
        codigo: "MED-006",
        fecha: "05/06/2024",
        idBovino: "BOV-132",
        nombre: "Blanca",
        raza: "Gyr",
        tipo: "Vacuna",
        diagnostico: "Vacunación anual",
        medicamento: "Vacuna BVD",
        dosis: "2 ml SC",
        veterinario: "Dr. Pérez",
        proxima: "05/06/2025",
        estado: "Completado",
      },
      {
        id: 7,
        codigo: "MED-007",
        fecha: "28/05/2024",
        idBovino: "BOV-140",
        nombre: "Tormenta",
        raza: "Brahman",
        tipo: "Tratamiento",
        diagnostico: "Diarrea aguda",
        medicamento: "Rehidratante + Antibiótico",
        dosis: "20 ml oral",
        veterinario: "Dra. Fernández",
        proxima: "04/06/2024",
        estado: "En seguimiento",
      },
      {
        id: 8,
        codigo: "MED-008",
        fecha: "30/03/2024",
        idBovino: "BOV-150",
        nombre: "Sol",
        raza: "Angus",
        tipo: "Desparasitación",
        diagnostico: "Control interno y externo",
        medicamento: "Levamisol",
        dosis: "3 ml PO",
        veterinario: "Dr. García",
        proxima: "30/09/2024",
        estado: "Completado",
      },
      {
        id: 9,
        codigo: "MED-009",
        fecha: "12/06/2024",
        idBovino: "BOV-160",
        nombre: "Marta",
        raza: "Hereford",
        tipo: "Revisión",
        diagnostico: "Fiebre baja, observación",
        medicamento: "Antipirético",
        dosis: "2 ml IM",
        veterinario: "Dr. Morales",
        proxima: "19/06/2024",
        estado: "En seguimiento",
      },
      {
        id: 10,
        codigo: "MED-010",
        fecha: "02/02/2024",
        idBovino: "BOV-170",
        nombre: "Pecas",
        raza: "Simmental",
        tipo: "Vacuna",
        diagnostico: "Vacunación contra clostridios",
        medicamento: "Clostridial vaccine",
        dosis: "2 ml IM",
        veterinario: "Dra. López",
        proxima: "02/08/2024",
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
      {key: "idBovino", label: "ID Bovino"},
      {key: "alimento", label: "Alimento"},
      {key: "cantidad", label: "Cantidad", placeholder: "5 kg"},
      {key: "responsable", label: "Responsable"},
    ],
    initialData: [
      {
        id: 1,
        codigo: "DIE-001",
        fecha: "10/06/2024",
        idBovino: "BOV-101",
        alimento: "Heno",
        cantidad: "5 kg",
        responsable: "Téc. Gómez",
      },
      {
        id: 2,
        codigo: "DIE-002",
        fecha: "11/06/2024",
        idBovino: "BOV-102",
        alimento: "Concentrado",
        cantidad: "3 kg",
        responsable: "Ing. Rivera",
      },
      {
        id: 3,
        codigo: "DIE-003",
        fecha: "12/06/2024",
        idBovino: "BOV-103",
        alimento: "Pasto Verde",
        cantidad: "7 kg",
        responsable: "Aux. López",
      },
      {
        id: 4,
        codigo: "DIE-004",
        fecha: "13/06/2024",
        idBovino: "BOV-104",
        alimento: "Heno",
        cantidad: "4.5 kg",
        responsable: "Téc. Gómez",
      },
      {
        id: 5,
        codigo: "DIE-005",
        fecha: "14/06/2024",
        idBovino: "BOV-105",
        alimento: "Silaje",
        cantidad: "6 kg",
        responsable: "Ing. Rivera",
      },
      {
        id: 6,
        codigo: "DIE-006",
        fecha: "15/06/2024",
        idBovino: "BOV-106",
        alimento: "Concentrado",
        cantidad: "2.5 kg",
        responsable: "Aux. Morales",
      },
      {
        id: 7,
        codigo: "DIE-007",
        fecha: "16/06/2024",
        idBovino: "BOV-107",
        alimento: "Pasto Seco",
        cantidad: "5.5 kg",
        responsable: "Téc. Pérez",
      },
      {
        id: 8,
        codigo: "DIE-008",
        fecha: "17/06/2024",
        idBovino: "BOV-108",
        alimento: "Heno",
        cantidad: "5 kg",
        responsable: "Aux. López",
      },
      {
        id: 9,
        codigo: "DIE-009",
        fecha: "18/06/2024",
        idBovino: "BOV-109",
        alimento: "Silaje",
        cantidad: "6.2 kg",
        responsable: "Ing. Rivera",
      },
      {
        id: 10,
        codigo: "DIE-010",
        fecha: "19/06/2024",
        idBovino: "BOV-110",
        alimento: "Concentrado",
        cantidad: "3.5 kg",
        responsable: "Téc. Gómez",
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
      {key: "madre", label: "Madre (ID Bovino)"},
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
        madre: "BOV-101",
        sexo: "Macho",
        peso: "38 kg",
      },
      {
        id: 2,
        codigo: "CRN-002",
        fecha: "12/06/2024",
        madre: "BOV-102",
        sexo: "Hembra",
        peso: "35 kg",
      },
      {
        id: 3,
        codigo: "CRN-003",
        fecha: "15/06/2024",
        madre: "BOV-103",
        sexo: "Macho",
        peso: "40 kg",
      },
      {
        id: 4,
        codigo: "CRN-004",
        fecha: "18/06/2024",
        madre: "BOV-104",
        sexo: "Hembra",
        peso: "33 kg",
      },
      {
        id: 5,
        codigo: "CRN-005",
        fecha: "20/06/2024",
        madre: "BOV-105",
        sexo: "Macho",
        peso: "42 kg",
      },
      {
        id: 6,
        codigo: "CRN-006",
        fecha: "22/06/2024",
        madre: "BOV-106",
        sexo: "Hembra",
        peso: "36 kg",
      },
      {
        id: 7,
        codigo: "CRN-007",
        fecha: "25/06/2024",
        madre: "BOV-107",
        sexo: "Macho",
        peso: "39 kg",
      },
      {
        id: 8,
        codigo: "CRN-008",
        fecha: "28/06/2024",
        madre: "BOV-108",
        sexo: "Hembra",
        peso: "34 kg",
      },
      {
        id: 9,
        codigo: "CRN-009",
        fecha: "01/07/2024",
        madre: "BOV-109",
        sexo: "Macho",
        peso: "41 kg",
      },
      {
        id: 10,
        codigo: "CRN-010",
        fecha: "05/07/2024",
        madre: "BOV-110",
        sexo: "Hembra",
        peso: "37 kg",
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
    filters: [{key: "sexo", placeholder: "Sexo", options: ["Macho", "Hembra"]}],
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
      {key: "idBovino", label: "ID Bovino (Madre)"},
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
        idBovino: "BOV-101",
        tipo: "Natural",
        estado: "Completado",
      },
      {
        id: 2,
        codigo: "PAR-002",
        fecha: "12/06/2024",
        idBovino: "BOV-102",
        tipo: "Asistido",
        estado: "Completado",
      },
      {
        id: 3,
        codigo: "PAR-003",
        fecha: "15/06/2024",
        idBovino: "BOV-103",
        tipo: "Natural",
        estado: "En seguimiento",
      },
      {
        id: 4,
        codigo: "PAR-004",
        fecha: "18/06/2024",
        idBovino: "BOV-104",
        tipo: "Asistido",
        estado: "Completado",
      },
      {
        id: 5,
        codigo: "PAR-005",
        fecha: "20/06/2024",
        idBovino: "BOV-105",
        tipo: "Natural",
        estado: "Completado",
      },
      {
        id: 6,
        codigo: "PAR-006",
        fecha: "22/06/2024",
        idBovino: "BOV-106",
        tipo: "Natural",
        estado: "En seguimiento",
      },
      {
        id: 7,
        codigo: "PAR-007",
        fecha: "25/06/2024",
        idBovino: "BOV-107",
        tipo: "Asistido",
        estado: "Completado",
      },
      {
        id: 8,
        codigo: "PAR-008",
        fecha: "27/06/2024",
        idBovino: "BOV-108",
        tipo: "Natural",
        estado: "Completado",
      },
      {
        id: 9,
        codigo: "PAR-009",
        fecha: "29/06/2024",
        idBovino: "BOV-109",
        tipo: "Asistido",
        estado: "En seguimiento",
      },
      {
        id: 10,
        codigo: "PAR-010",
        fecha: "01/07/2024",
        idBovino: "BOV-110",
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

const Bitacora = () => {
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
