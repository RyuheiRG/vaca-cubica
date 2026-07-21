// src/pages/Usuarios.jsx
import { useState, useEffect, useCallback } from "react";
import { UserPlus } from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import DynamicForm from "../components/DynamicForm";
import { getFormErrorMessage } from "../utils/errorMessage";
import api from "../services/api";
import "./Catalogo.css";

const ROLES = [
  { value: "dueño", label: "Dueño" },
  { value: "caporal", label: "Capataz / Caporal" },
];

const emptyForm = { username: "", password: "", rol: "caporal" };

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = crear nuevo
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const cargarUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/usuarios/");
      setUsuarios(data);
    } catch (err) {
      setToast({
        message: getFormErrorMessage(
          err,
          "No se pudo cargar la lista de usuarios.",
        ),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (usuario) => {
    setEditingUser(usuario);
    setForm({ username: usuario.username, password: "", rol: usuario.rol });
    setModalOpen(true);
  };

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        // PATCH: solo manda password si se escribió una nueva
        const payload = { username: form.username, rol: form.rol };
        if (form.password) payload.password = form.password;
        await api.patch(`/api/usuarios/${editingUser.id}`, payload);
        setToast({
          message: "Usuario actualizado correctamente.",
          type: "success",
        });
      } else {
        await api.post("/api/usuarios/", {
          username: form.username,
          password: form.password,
          rol: form.rol,
          activo: true,
        });
        setToast({ message: "Usuario creado correctamente.", type: "success" });
      }
      setModalOpen(false);
      cargarUsuarios();
    } catch (err) {
      setToast({
        message: getFormErrorMessage(err, "Ocurrió un error al guardar."),
        type: "error",
      });
    }
  };

  const handleToggleActivo = async (usuario) => {
    try {
      await api.patch(`/api/usuarios/${usuario.id}`, {
        activo: !usuario.activo,
      });
      setToast({
        message: usuario.activo
          ? "Usuario desactivado."
          : "Usuario reactivado.",
        type: "success",
      });
      cargarUsuarios();
    } catch (err) {
      setToast({
        message: getFormErrorMessage(err, "No se pudo actualizar el estado."),
        type: "error",
      });
    }
  };

  const columns = [
    { key: "username", label: "Usuario" },
    {
      key: "rol",
      label: "Rol",
      render: (row) => (row.rol === "dueño" ? "👑 Dueño" : "🤠 Capataz"),
    },
    {
      key: "activo",
      label: "Estado",
      render: (row) => (row.activo ? "Activo" : "Desactivado"),
    },
  ];

  const formFields = [
    { key: "username", label: "Usuario", placeholder: "juan.perez" },
    {
      key: "password",
      label: editingUser ? "Nueva contraseña (opcional)" : "Contraseña",
      type: "password",
      placeholder: "Mínimo 8 caracteres",
    },
    { key: "rol", label: "Rol", type: "select", options: ROLES },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Administra las cuentas de acceso del rancho.</p>
        </div>
        <Button icon={<UserPlus size={16} />} onClick={openCreateModal}>
          Nuevo usuario
        </Button>
      </div>

      {!loading && (
        <DataTable
          columns={columns}
          data={usuarios}
          onEdit={openEditModal}
          onDelete={handleToggleActivo} // el botón de "borrar" en realidad activa/desactiva
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? "Editar usuario" : "Nuevo usuario"}
        subtitle={
          editingUser ? editingUser.username : "Crear cuenta de Capataz/Caporal"
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </>
        }
      >
        <DynamicForm
          fields={formFields}
          values={form}
          onChange={handleFormChange}
        />
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
};

export default Usuarios;
