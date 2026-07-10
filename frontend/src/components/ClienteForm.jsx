const ClienteForm = ({values, onChange}) => {
  return (
    <>
      <div className="form-section-title">Datos de Identificación</div>

      <label>
        Nombre Completo o Empresa <span className="required-mark">*</span>
        <input
          placeholder="Ej. Agro El Sol S.A. de C.V."
          value={values.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />
      </label>

      <div className="form-row">
        <label>
          RFC / ID Fiscal
          <input
            placeholder="XAXX010101000"
            value={values.rfc}
            onChange={(e) => onChange("rfc", e.target.value)}
          />
        </label>
        <label>
          Tipo de Cliente
          <select
            value={values.tipo}
            onChange={(e) => onChange("tipo", e.target.value)}
          >
            <option value="">Seleccionar...</option>
            <option value="Agro">Agro</option>
            <option value="Particular">Particular</option>
            <option value="Distribuidor">Distribuidor</option>
          </select>
        </label>
      </div>

      <div className="form-section-title">Datos de Contacto</div>

      <label>
        Dirección Principal
        <input
          placeholder="Calle, Colonia, Ciudad, Estado"
          value={values.direccion}
          onChange={(e) => onChange("direccion", e.target.value)}
        />
      </label>

      <div className="form-row">
        <label>
          Teléfono de Contacto
          <input
            placeholder="+52 800 000 0000"
            value={values.telefono}
            onChange={(e) => onChange("telefono", e.target.value)}
          />
        </label>
        <label>
          Correo Electrónico
          <input
            type="email"
            placeholder="contacto@empresa.com"
            value={values.correo}
            onChange={(e) => onChange("correo", e.target.value)}
          />
        </label>
      </div>

      <label>
        Notas de Cliente
        <textarea
          placeholder="Observaciones, condiciones especiales, historial relevante..."
          value={values.notas}
          onChange={(e) => onChange("notas", e.target.value)}
        />
      </label>
    </>
  );
};

export default ClienteForm;
