import {X} from "lucide-react";
import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  accentColor = "#5eb053",
  footer,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{borderTopColor: accentColor}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-left">
            {icon && <span className="modal-icon">{icon}</span>}
            <div>
              <h3>{title}</h3>
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
