import {useEffect} from "react";
import {CheckCircle2, AlertTriangle, Info} from "lucide-react";
import "./Toast.css";

const Toast = ({message, type = "success", onClose, duration = 3000}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const Icon =
    type === "success" ? CheckCircle2 : type === "error" ? AlertTriangle : Info;

  return (
    <div className={`toast toast-${type}`}>
      <Icon size={18} color="#ffffff" />
      <span>{message}</span>
    </div>
  );
};

export default Toast;
