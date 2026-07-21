import "./AsyncState.css";

const AsyncState = ({
  loading,
  error,
  isEmpty,
  emptyMessage = "Todavía no hay registros.",
  onRetry,
  children,
}) => {
  if (loading) {
    return <div className="async-state async-state-loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="async-state async-state-error">
        <p>{error}</p>
        {onRetry && (
          <button className="async-state-retry" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="async-state async-state-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return children;
};

export default AsyncState;

/* Comentario sin importancia real */
