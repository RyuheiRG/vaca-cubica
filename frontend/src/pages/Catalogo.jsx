import { useState, useMemo } from "react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Toast from "../components/Toast";
import Tabs from "../components/Tabs";
import DynamicForm from "../components/DynamicForm";
import FilterBar from "../components/FilterBar";
import { useRazas } from "../context/RazasContext";
import { useBovinos } from "../context/BovinosContext";
import { useCrias } from "../context/CriasContext";
import { useAlimentos } from "../context/AlimentosContext";
import { useVacunas } from "../context/VacunasContext";
import "./Catalogo.css";
import { getFormErrorMessage } from "../utils/errorMessage";

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
const ESTADOS_SALUD = [
  "excelente",
  "bueno",
  "observacion",
  "critico",
  "fallecido",
];
const SEXOS = ["macho", "hembra"];

const Catalogo = () => {
  const { razas, createRaza, getRazaById } = useRazas();
  const { bovinos } = useBovinos();
  const { crias, partos, createCria, createParto, updateCria } = useCrias();
  const { alimentos, createAlimento } = useAlimentos();
  const { vacunas, createVacuna, deleteVacuna } = useVacunas();

  const bovinoOptions = bovinos.map((b) => ({
    value: b.id,
    label: `${b.arete} — ${b.nombre || "sin nombre"}`,
  }));
  const razaOptions = razas.map((r) => ({ value: r.id, label: r.nombre }));

  const criasDisplay = useMemo(
    () =>
      crias.map((c) => {
        const madre = bovinos.find((b) => b.id === c.parto?.madre_id);
        return {
          ...c,
          codigo: c.arete_provisional || `CRI-${c.id}`,
          sexoLabel: capitalize(c.sexo),
          razaNombre: getRazaById(c.raza_id).nombre,
          madreLabel: madre ? madre.arete : "—",
          fechaNacimiento: c.parto?.fecha_parto || "—",
          pesoLabel: `${c.peso_nacer} kg`,
          estadoLabel: capitalize(c.estado_salud),
        };
      }),
    [crias, bovinos], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const sementalesDisplay = useMemo(
    () =>
      bovinos
        .filter((b) => b.es_semental)
        .map((b) => ({
          ...b,
          codigo: b.arete,
          razaNombre: getRazaById(b.raza_id).nombre,
          estadoLabel: capitalize(b.estado),
        })),
    [bovinos], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const tabsConfig = [
    {
      key: "razas",
      label: "Razas",
      singular: "Raza",
      columns: [
        { key: "nombre", label: "Nombre" },
        { key: "peso_promedio_adulto", label: "Peso Prom. Adulto (kg)" },
      ],
      formFields: [
        { key: "nombre", label: "Nombre" },
        {
          key: "peso_promedio_adulto",
          label: "Peso Promedio Adulto (kg)",
          type: "number",
        },
      ],
      canCreate: true,
      canEdit: false,
      canDelete: false,
    },
    {
      key: "vacunas",
      label: "Vacunas",
      singular: "Vacuna",
      columns: [
        { key: "nombre", label: "Nombre" },
        { key: "enfermedad_objetivo", label: "Enfermedad Objetivo" },
      ],
      formFields: [
        { key: "nombre", label: "Nombre" },
        { key: "enfermedad_objetivo", label: "Enfermedad Objetivo" },
      ],
      canCreate: true,
      canEdit: false,
      canDelete: true,
    },
    {
      key: "alimentos",
      label: "Alimentos",
      singular: "Alimento",
      columns: [
        { key: "nombre", label: "Nombre" },
        { key: "tipo", label: "Tipo" },
      ],
      formFields: [
        { key: "nombre", label: "Nombre" },
        { key: "tipo", label: "Tipo", placeholder: "Forraje, concentrado..." },
      ],
      canCreate: true,
      canEdit: false,
      canDelete: false,
    },
    {
      key: "crias",
      label: "Crías",
      singular: "Cría",
      columns: [
        { key: "codigo", label: "ID" },
        { key: "sexoLabel", label: "Sexo", badge: true },
        { key: "razaNombre", label: "Raza" },
        { key: "madreLabel", label: "Madre" },
        { key: "fechaNacimiento", label: "F. Nacimiento" },
        { key: "pesoLabel", label: "Peso al Nacer" },
        { key: "estadoLabel", label: "Estado de Salud", badge: true },
      ],
      formFields: [
        {
          key: "madre_id",
          label: "Madre (Bovino)",
          type: "select",
          options: bovinoOptions,
        },
        { key: "fecha_parto", label: "Fecha de Parto", type: "date" },
        {
          key: "raza_id",
          label: "Raza de la cría",
          type: "select",
          options: razaOptions,
        },
        {
          key: "sexo",
          label: "Sexo",
          type: "select",
          options: SEXOS.map((s) => ({ value: s, label: capitalize(s) })),
        },
        { key: "peso_nacer", label: "Peso al Nacer (kg)", type: "number" },
        {
          key: "arete_provisional",
          label: "Arete Provisional",
          placeholder: "Opcional",
        },
      ],
      editFormFields: [
        {
          key: "estado_salud",
          label: "Estado de Salud",
          type: "select",
          options: ESTADOS_SALUD.map((e) => ({
            value: e,
            label: capitalize(e),
          })),
        },
      ],
      canCreate: true,
      canEdit: true,
      canDelete: false,
    },
    {
      key: "sementales",
      label: "Sementales",
      singular: "Semental",
      columns: [
        { key: "codigo", label: "Arete" },
        { key: "nombre", label: "Nombre" },
        { key: "razaNombre", label: "Raza" },
        { key: "estadoLabel", label: "Estado", badge: true },
      ],
      canCreate: false,
      canEdit: false,
      canDelete: false,
    },
  ];

  const [activeTab, setActiveTab] = useState("razas");
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const currentConfig = tabsConfig.find((t) => t.key === activeTab);

  const currentData = {
    razas,
    vacunas,
    alimentos,
    crias: criasDisplay,
    sementales: sementalesDisplay,
  }[activeTab];

  const filteredData = useMemo(() => {
    let result = currentData;
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) =>
            typeof val !== "object" && String(val).toLowerCase().includes(term),
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
    count: {
      razas,
      vacunas,
      alimentos,
      crias: criasDisplay,
      sementales: sementalesDisplay,
    }[t.key].length,
  }));

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearch("");
    setFilterValues({});
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenCreate = () => {
    setNewItem(activeTab === "crias" ? { estado_salud: "excelente" } : {});
    setShowCreateModal(true);
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      if (activeTab === "razas") {
        await createRaza({
          nombre: newItem.nombre,
          peso_promedio_adulto: Number(newItem.peso_promedio_adulto),
        });
      } else if (activeTab === "vacunas") {
        await createVacuna({
          nombre: newItem.nombre,
          enfermedad_objetivo: newItem.enfermedad_objetivo,
        });
      } else if (activeTab === "alimentos") {
        await createAlimento({ nombre: newItem.nombre, tipo: newItem.tipo });
      } else if (activeTab === "crias") {
        const parto = await createParto({
          madre_id: Number(newItem.madre_id),
          fecha_parto: newItem.fecha_parto,
        });
        await createCria({
          parto_id: parto.id,
          raza_id: Number(newItem.raza_id),
          sexo: newItem.sexo,
          peso_nacer: Number(newItem.peso_nacer),
          arete_provisional: newItem.arete_provisional || null,
        });
      }
      setShowCreateModal(false);
      setToast({
        message: `${currentConfig.singular} registrado correctamente`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message: getFormErrorMessage(err, "No se pudo guardar el registro"),
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

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      if (activeTab === "crias") {
        await updateCria(editingItem.id, {
          estado_salud: editingItem.estado_salud,
        });
      }
      setEditingItem(null);
      setToast({
        message: `${currentConfig.singular} actualizado correctamente`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message: getFormErrorMessage(err, "No se pudo actualizar el registro"),
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
      if (activeTab === "vacunas") {
        await deleteVacuna(itemToDelete.id);
      }
      setItemToDelete(null);
      setToast({
        message: `${currentConfig.singular} eliminado correctamente`,
        type: "success",
      });
    } catch (err) {
      setToast({
        message: getFormErrorMessage(
          err,
          "No se pudo eliminar (revisa si ya tiene historial asociado)",
        ),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="catalogo-header-top">
        <div>
          <h1>Gestión de Catálogos</h1>
          <p>Razas · Vacunas · Alimentos · Crías · Sementales</p>
        </div>
        {currentConfig.canCreate && (
          <Button icon="+" onClick={handleOpenCreate}>
            Nueva {currentConfig.singular}
          </Button>
        )}
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
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      {activeTab === "sementales" && (
        <p style={{ margin: "0 0 12px", opacity: 0.7, fontSize: "0.9rem" }}>
          Esta pestaña es de solo lectura: muestra los bovinos marcados como
          semental. Para agregar o quitar uno, edítalo desde "Registro de
          Animales".
        </p>
      )}

      <div className="catalogo-card">
        <div className="catalogo-card-header">
          <h3>
            {currentConfig.label} <span>— {filteredData.length} registros</span>
          </h3>
        </div>

        <DataTable
          columns={currentConfig.columns}
          data={filteredData}
          onEdit={currentConfig.canEdit ? handleEdit : undefined}
          onDelete={currentConfig.canDelete ? handleDeleteClick : undefined}
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
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        <DynamicForm
          fields={currentConfig.formFields || []}
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
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        }
      >
        {editingItem && (
          <DynamicForm
            fields={
              currentConfig.editFormFields || currentConfig.formFields || []
            }
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
        itemType={itemToDelete?.tipo}
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
