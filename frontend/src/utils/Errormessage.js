export function getFriendlyErrorMessage(err) {
  if (!err) return null;

  if (err.code === "ERR_NETWORK") {
    return "No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté activo.";
  }

  const status = err.response?.status;

  if (status === 401) {
    return "Tu sesión expiró. Inicia sesión nuevamente.";
  }

  if (status === 403) {
    return "No tienes permisos para ver esta información.";
  }

  if (status && status >= 500) {
    return "Ocurrió un problema en el servidor. Intenta de nuevo en unos momentos.";
  }

  return "Ocurrió un error al cargar los datos. Intenta de nuevo.";
}
