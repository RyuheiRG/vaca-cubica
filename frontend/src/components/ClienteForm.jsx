const ClienteForm = ({values, onChange}) => {
  return (
    <>
      <label>
        Nombre Completo o Empresa <span className="required-mark">*</span>
        <input
          placeholder="Ej. Agro El Sol S.A. de C.V."
          value={values.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />
      </label>

      <label>
        Teléfono de Contacto <span className="required-mark">*</span>
        <input
          placeholder="+52 800 000 0000"
          value={values.telefono}
          onChange={(e) => onChange("telefono", e.target.value)}
        />
      </label>
    </>
  );
};

export default ClienteForm;
