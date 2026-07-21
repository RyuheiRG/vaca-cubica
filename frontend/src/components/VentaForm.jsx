const VentaForm = ({values, onChange, bovinos = [], clientes = []}) => {
  const isRenta = values.categoria === "Renta";

  return (
    <>
      <label>
        Tipo de Transacción
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="tipoTransaccion"
              checked={values.categoria === "Venta"}
              onChange={() => onChange("categoria", "Venta")}
            />
            Venta
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="tipoTransaccion"
              checked={values.categoria === "Renta"}
              onChange={() => onChange("categoria", "Renta")}
            />
            Renta
          </label>
        </div>
      </label>

      <div className="form-row">
        <label>
          Bovino
          <select
            value={values.bovino_id}
            onChange={(e) => onChange("bovino_id", e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {bovinos.map((b) => (
              <option key={b.id} value={b.id}>
                {b.arete} — {b.nombre || "sin nombre"}
              </option>
            ))}
          </select>
          {isRenta && (
            <small className="form-hint">
              Solo se muestran sementales (macho, activo).
            </small>
          )}
        </label>
        <label>
          Cliente
          <select
            value={values.cliente_id}
            onChange={(e) => onChange("cliente_id", e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isRenta ? (
        <div className="form-row">
          <label>
            Fecha de Inicio
            <input
              type="date"
              value={values.fecha_inicio}
              onChange={(e) => onChange("fecha_inicio", e.target.value)}
            />
          </label>
          <label>
            Fecha de Fin (opcional)
            <input
              type="date"
              value={values.fecha_fin}
              onChange={(e) => onChange("fecha_fin", e.target.value)}
            />
          </label>
        </div>
      ) : (
        <label>
          Fecha de Venta
          <input
            type="date"
            value={values.fecha_venta}
            onChange={(e) => onChange("fecha_venta", e.target.value)}
          />
        </label>
      )}

      <label>
        {isRenta ? "Costo Total (en $)" : "Precio Final (en $)"}
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={isRenta ? values.costo_total : values.precio_final}
          onChange={(e) =>
            onChange(isRenta ? "costo_total" : "precio_final", e.target.value)
          }
        />
      </label>
    </>
  );
};

export default VentaForm;
