import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const BitacoraContext = createContext(null);

export const BitacoraProvider = ({ children }) => {
  const [pesajes, setPesajes] = useState([]);
  const [registrosMedicos, setRegistrosMedicos] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resPesajes, resMedicos, resDietas] = await Promise.all([
        api.get("/api/pesajes/"),
        api.get("/api/medico/"),
        api.get("/api/dieta/"),
      ]);

      setPesajes(resPesajes.data);
      setRegistrosMedicos(resMedicos.data);
      setDietas(resDietas.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  const createPesaje = async (pesajeIn) => {
    const { data } = await api.post("/api/pesajes/", pesajeIn);
    setPesajes((prev) => [data, ...prev]);
    return data;
  };

  const createRegistroMedico = async (medicoIn) => {
    const { data } = await api.post("/api/medico/", medicoIn);
    setRegistrosMedicos((prev) => [data, ...prev]);
    return data;
  };

  const createDieta = async (dietaIn) => {
    const { data } = await api.post("/api/dieta/", dietaIn);
    setDietas((prev) => [data, ...prev]);
    return data;
  };

  return (
    <BitacoraContext.Provider
      value={{
        pesajes,
        registrosMedicos,
        dietas,
        loading,
        error,
        refetch: fetchTodo,
        createPesaje,
        createRegistroMedico,
        createDieta,
      }}
    >
      {children}
    </BitacoraContext.Provider>
  );
};

export const useBitacora = () => {
  const ctx = useContext(BitacoraContext);
  if (!ctx)
    throw new Error("useBitacora debe usarse dentro de <BitacoraProvider>");
  return ctx;
};
