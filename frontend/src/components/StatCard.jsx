import "./StatCard.css";

const StatCard = ({label, value, variant = "neutral"}) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className={`stat-value stat-${variant}`}>{value}</div>
  </div>
);

export default StatCard;
