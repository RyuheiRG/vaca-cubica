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
              {field.options.map((opt) => {
                const value = typeof opt === "object" ? opt.value : opt;
                const label = typeof opt === "object" ? opt.label : opt;
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              placeholder={field.placeholder}
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={!!values[field.key]}
              onChange={(e) => onChange(field.key, e.target.checked)}
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
