import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const RazasContext = createContext(null);

export const RazasProvider = ({ children }) => {
  const [razas, setRazas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRazas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/razas/");
      setRazas(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRazas();
  }, [fetchRazas]);

  const createRaza = async (razaIn) => {
    const { data } = await api.post("/api/razas/", razaIn);
    setRazas((prev) => [...prev, data]);
    return data;
  };

  const getRazaByNombre = (nombre) => {
    const found = razas.find((r) => r.nombre === nombre);
    return found || { nombre: "—" };
  };

  const getRazaById = (id) => {
    const found = razas.find((r) => r.id === id);
    return found || { nombre: "—" };
  };

  return (
    <RazasContext.Provider
      value={{
        razas,
        setRazas,
        loading,
        error,
        refetch: fetchRazas,
        createRaza,
        getRazaByNombre,
        getRazaById,
      }}
    >
      {children}
    </RazasContext.Provider>
  );
};

export const useRazas = () => {
  const ctx = useContext(RazasContext);
  if (!ctx) throw new Error("useRazas debe usarse dentro de <RazasProvider>");
  return ctx;
};
