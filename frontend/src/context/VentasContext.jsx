import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const VentasContext = createContext(null);

export const VentasProvider = ({children}) => {
  // El backend no expone un endpoint conjunto: ventas y rentas viven en
  // tablas y routers separados (comercial), así que se piden en paralelo.
  const [ventas, setVentas] = useState([]);
  const [rentas, setRentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{data: ventasData}, {data: rentasData}] = await Promise.all([
        api.get("/api/ventas/"),
        api.get("/api/rentas/"),
      ]);
      setVentas(ventasData);
      setRentas(rentasData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  // El backend solo expone POST y GET para ventas y rentas
  // (no hay edición ni eliminación de movimientos comerciales).
  const createVenta = async (ventaIn) => {
    const {data} = await api.post("/api/ventas/", ventaIn);
    setVentas((prev) => [...prev, data]);
    return data;
  };

  const createRenta = async (rentaIn) => {
    const {data} = await api.post("/api/rentas/", rentaIn);
    setRentas((prev) => [...prev, data]);
    return data;
  };

  return (
    <VentasContext.Provider
      value={{
        ventas,
        rentas,
        loading,
        error,
        refetch: fetchTodo,
        createVenta,
        createRenta,
      }}
    >
      {children}
    </VentasContext.Provider>
  );
};

export const useVentas = () => {
  const ctx = useContext(VentasContext);
  if (!ctx) throw new Error("useVentas debe usarse dentro de <VentasProvider>");
  return ctx;
};
