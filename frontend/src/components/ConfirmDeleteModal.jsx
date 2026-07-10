import {ShieldAlert, Trash2, X} from "lucide-react";
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemLabel = "registro",
  itemName,
  itemId,
  itemType,
}) => {
  if (!isOpen) return null;

  const initials = itemName
    ? itemName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-content" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="confirm-icon-wrapper">
          <div className="confirm-icon-circle">
            <ShieldAlert size={28} color="#e11d48" />
          </div>
        </div>

        <h2 className="confirm-title">¿Confirmar Eliminación?</h2>

        <div className="confirm-warning">Esta acción no se puede deshacer</div>

        <p className="confirm-question">
          ¿Estás seguro de que deseas eliminar este <strong>{itemLabel}</strong>
          ?
        </p>

        <div className="confirm-item-card">
          <div className="confirm-avatar">{initials}</div>
          <div>
            <div className="confirm-item-name">{itemName}</div>
            <div className="confirm-item-meta">
              ID: {itemId} · Tipo: {itemType}
            </div>
          </div>
        </div>

        <div className="confirm-actions">
          <button className="confirm-btn-delete" onClick={onConfirm}>
            <Trash2 size={16} />
            Sí, Borrar
          </button>
          <button className="confirm-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
