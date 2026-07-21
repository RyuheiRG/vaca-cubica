import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const ClientesContext = createContext(null);

export const ClientesProvider = ({ children }) => {
  // El backend solo maneja: id, nombre, telefono (no tipo/correo/idCliente propio).
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/clientes/");
      setClientes(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Igual que alimentos: el backend solo expone GET y POST para clientes.
  const createCliente = async (clienteIn) => {
    const { data } = await api.post("/api/clientes/", clienteIn);
    setClientes((prev) => [...prev, data]);
    return data;
  };

  const getClienteById = (id) => {
    const found = clientes.find((c) => c.id === id);
    return found || { nombre: "—" };
  };

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        setClientes,
        loading,
        error,
        refetch: fetchClientes,
        createCliente,
        getClienteById,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};

export const useClientes = () => {
  const ctx = useContext(ClientesContext);
  if (!ctx)
    throw new Error("useClientes debe usarse dentro de <ClientesProvider>");
  return ctx;
};
