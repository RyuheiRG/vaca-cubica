import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const AlimentosContext = createContext(null);

export const AlimentosProvider = ({ children }) => {
  // El backend solo maneja: id, nombre, tipo (no proveedor/costo/estado).
  const [alimentos, setAlimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlimentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/alimentos/");
      setAlimentos(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlimentos();
  }, [fetchAlimentos]);

  // No existe PATCH ni DELETE de alimentos en el backend: solo se puede
  // listar y crear. Si tu app necesita editar/borrar, hay que agregar
  // esos endpoints en el backend primero.
  const createAlimento = async (alimentoIn) => {
    const { data } = await api.post("/api/alimentos/", alimentoIn);
    setAlimentos((prev) => [...prev, data]);
    return data;
  };

  return (
    <AlimentosContext.Provider
      value={{
        alimentos,
        setAlimentos,
        loading,
        error,
        refetch: fetchAlimentos,
        createAlimento,
      }}
    >
      {children}
    </AlimentosContext.Provider>
  );
};

export const useAlimentos = () => {
  const ctx = useContext(AlimentosContext);
  if (!ctx)
    throw new Error("useAlimentos debe usarse dentro de <AlimentosProvider>");
  return ctx;
};
