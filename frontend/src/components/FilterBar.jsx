import {useState} from "react";
import {Search, Filter, ChevronDown} from "lucide-react";
import "./FilterBar.css";

/**
 * Barra de búsqueda + filtros por dropdown, reutilizable.
 * filters: filtros siempre visibles [{ key, placeholder, options: [] }]
 * moreFilters: filtros que aparecen al hacer clic en "Más filtros" (mismo formato)
 */
const FilterBar = ({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters = [],
  moreFilters = [],
  filterValues = {},
  onFilterChange,
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="filter-bar-wrapper">
      <div className="filter-bar">
        <div className="filter-search">
          <Search size={16} />
          <input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {filters.map((f) => (
          <select
            key={f.key}
            className="filter-select"
            value={filterValues[f.key] || ""}
            onChange={(e) => onFilterChange(f.key, e.target.value)}
          >
            <option value="">{f.placeholder}</option>
            {f.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}

        {moreFilters.length > 0 && (
          <button
            className={`filter-more-btn ${showMore ? "active" : ""}`}
            onClick={() => setShowMore((prev) => !prev)}
          >
            <Filter size={16} />
            Más filtros
            <ChevronDown size={14} className={showMore ? "chevron-up" : ""} />
          </button>
        )}
      </div>

      {showMore && moreFilters.length > 0 && (
        <div className="filter-bar-more">
          {moreFilters.map((f) => (
            <select
              key={f.key}
              className="filter-select"
              value={filterValues[f.key] || ""}
              onChange={(e) => onFilterChange(f.key, e.target.value)}
            >
              <option value="">{f.placeholder}</option>
              {f.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
