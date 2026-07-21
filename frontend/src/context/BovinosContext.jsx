import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const BovinosContext = createContext(null);

export const BovinosProvider = ({children}) => {
  const [bovinos, setBovinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBovinos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {data} = await api.get("/api/bovinos/");
      setBovinos(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBovinos();
  }, [fetchBovinos]);

  const createBovino = async (bovinoIn) => {
    const {data} = await api.post("/api/bovinos/", bovinoIn);
    setBovinos((prev) => [...prev, data]);
    return data;
  };

  const updateBovino = async (id, changes) => {
    const {data} = await api.patch(`/api/bovinos/${id}`, changes);
    setBovinos((prev) => prev.map((b) => (b.id === id ? data : b)));
    return data;
  };

  const getBovinoByCodigo = (arete) => {
    const found = bovinos.find((b) => b.arete === arete);
    return found || {nombre: "—"};
  };

  const getBovinoById = (id) => {
    const found = bovinos.find((b) => b.id === id);
    return found || {arete: "—", nombre: "—"};
  };

  return (
    <BovinosContext.Provider
      value={{
        bovinos,
        setBovinos,
        loading,
        error,
        refetch: fetchBovinos,
        createBovino,
        updateBovino,
        getBovinoByCodigo,
        getBovinoById,
      }}
    >
      {children}
    </BovinosContext.Provider>
  );
};

export const useBovinos = () => {
  const ctx = useContext(BovinosContext);
  if (!ctx)
    throw new Error("useBovinos debe usarse dentro de <BovinosProvider>");
  return ctx;
};
