import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const VacunasContext = createContext(null);

export const VacunasProvider = ({ children }) => {
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVacunas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/vacunas/");
      setVacunas(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVacunas();
  }, [fetchVacunas]);

  const createVacuna = async (vacunaIn) => {
    const { data } = await api.post("/api/vacunas/", vacunaIn);
    setVacunas((prev) => [...prev, data]);
    return data;
  };

  const deleteVacuna = async (id) => {
    await api.delete(`/api/vacunas/${id}`);
    setVacunas((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <VacunasContext.Provider
      value={{
        vacunas,
        setVacunas,
        loading,
        error,
        refetch: fetchVacunas,
        createVacuna,
        deleteVacuna,
      }}
    >
      {children}
    </VacunasContext.Provider>
  );
};

export const useVacunas = () => {
  const ctx = useContext(VacunasContext);
  if (!ctx)
    throw new Error("useVacunas debe usarse dentro de <VacunasProvider>");
  return ctx;
};
