import "./Button.css";

const Button = ({
  children,
  icon,
  iconRight,
  variant = "primary",
  onClick,
  type = "button",
}) => {
  return (
    <button type={type} className={`btn btn-${variant}`} onClick={onClick}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
      {iconRight && <span className="btn-icon">{iconRight}</span>}
    </button>
  );
};

export default Button;
