import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const CriasContext = createContext(null);

export const CriasProvider = ({ children }) => {
  const [partos, setPartos] = useState([]);
  const [crias, setCrias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: partosData } = await api.get("/api/partos/");
      setPartos(partosData);

      const criasPorParto = await Promise.all(
        partosData.map((p) =>
          api
            .get(`/api/crias/parto/${p.id}`)
            .then((res) => res.data.map((c) => ({ ...c, parto: p }))),
        ),
      );
      setCrias(criasPorParto.flat());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  const createParto = async (partoIn) => {
    const { data } = await api.post("/api/partos/", partoIn);
    setPartos((prev) => [...prev, data]);
    return data;
  };

  const createCria = async (criaIn) => {
    const { data } = await api.post("/api/crias/", criaIn);
    const parto = partos.find((p) => p.id === criaIn.parto_id);
    setCrias((prev) => [...prev, { ...data, parto }]);
    return data;
  };

  const updateCria = async (id, changes) => {
    const { data } = await api.patch(`/api/crias/${id}`, changes);
    setCrias((prev) =>
      prev.map((c) => (c.id === id ? { ...data, parto: c.parto } : c)),
    );
    return data;
  };

  const addCriaFromNacimiento = async ({
    madre_id,
    fecha,
    sexo,
    raza_id,
    peso,
  }) => {
    const parto = await createParto({ madre_id, fecha_parto: fecha });
    return createCria({
      parto_id: parto.id,
      raza_id,
      sexo,
      peso_nacer: peso,
    });
  };

  return (
    <CriasContext.Provider
      value={{
        crias,
        partos,
        loading,
        error,
        refetch: fetchTodo,
        createParto,
        createCria,
        updateCria,
        addCriaFromNacimiento,
      }}
    >
      {children}
    </CriasContext.Provider>
  );
};

export const useCrias = () => {
  const ctx = useContext(CriasContext);
  if (!ctx) throw new Error("useCrias debe usarse dentro de <CriasProvider>");
  return ctx;
};
