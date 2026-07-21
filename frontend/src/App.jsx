import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Bovinos from "./pages/Bovinos";
import Bitacora from "./pages/Bitacora";
import Catalogo from "./pages/Catalogo";
import Ventas from "./pages/Ventas";
import Estadisticas from "./pages/Estadisticas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Inicio />} />

            <Route path="bovinos" element={<Bovinos />} />
            <Route path="bitacora" element={<Bitacora />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="estadisticas" element={<Estadisticas />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
