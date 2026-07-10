import "./Tabs.css";

const Tabs = ({tabs, activeTab, onChange}) => {
  return (
    <div className="tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.icon}
          {tab.label}
          <span className="tab-count">{tab.count}</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
