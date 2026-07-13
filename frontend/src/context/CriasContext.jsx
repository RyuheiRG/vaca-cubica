/* eslint-disable react-refresh/only-export-components */
import {createContext, useContext, useState} from "react";

const CriasContext = createContext(null);

// Nota: la cría NO guarda su propia "raza". Es un dato derivado de la madre
// (Bovinos → tipoRaza), igual que ya se hace en Bitácora (Pesaje, Control
// Médico). Guardarla aquí también producía datos repetidos/desincronizados
// entre el módulo de Crías y el de Bovinos.
const initialCrias = [
  {
    id: 1,
    codigo: "CRI-001",
    nombre: "Cría A",
    sexo: "Macho",
    madre: "B-001",
    fechaNacimiento: "2023-01-15",
    pesoNacimiento: "38 kg",
    pesoActual: "112 kg",
    estado: "Desarrollo",
  },
  {
    id: 2,
    codigo: "CRI-002",
    nombre: "Cría B",
    sexo: "Hembra",
    madre: "B-002",
    fechaNacimiento: "2023-01-20",
    pesoNacimiento: "38 kg",
    pesoActual: "95 kg",
    estado: "Destete",
  },
];

export const CriasProvider = ({children}) => {
  const [crias, setCrias] = useState(initialCrias);

  // Se llama desde Bitácora al registrar un nacimiento: crea automáticamente
  // la ficha de la cría en el Catálogo, sin que el usuario la capture dos veces.
  const addCriaFromNacimiento = ({madre, sexo, peso, fecha}) => {
    setCrias((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
      const codigo = `CRI-${String(nextId).padStart(3, "0")}`;
      return [
        ...prev,
        {
          id: nextId,
          codigo,
          nombre: "Sin nombre",
          sexo,
          madre,
          fechaNacimiento: fecha,
          pesoNacimiento: peso,
          pesoActual: peso,
          estado: "Lactante",
        },
      ];
    });
  };

  return (
    <CriasContext.Provider value={{crias, setCrias, addCriaFromNacimiento}}>
      {children}
    </CriasContext.Provider>
  );
};

export const useCrias = () => {
  const ctx = useContext(CriasContext);
  if (!ctx) throw new Error("useCrias debe usarse dentro de <CriasProvider>");
  return ctx;
};
