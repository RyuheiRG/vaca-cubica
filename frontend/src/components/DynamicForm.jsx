/**
 * Formulario genérico: recibe una lista de campos y arma los inputs solo.
 * fields: [{ key, label, type: "text"|"number"|"select"|"textarea", options?, placeholder? }]
 * Se usa dentro de <Modal>, así que hereda el estilo de .modal-body en Modal.css
 */
const DynamicForm = ({fields, values, onChange}) => {
  return (
    <>
      {fields.map((field) => (
        <label key={field.key}>
          {field.label}
          {field.type === "select" ? (
            <select
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              placeholder={field.placeholder}
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          ) : (
            <input
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          )}
        </label>
      ))}
    </>
  );
};

export default DynamicForm;
