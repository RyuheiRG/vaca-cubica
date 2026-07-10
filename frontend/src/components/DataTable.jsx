import {Pencil, Trash2} from "lucide-react";
import Badge from "./Badge";
import "./DataTable.css";

const DataTable = ({columns, data, onEdit, onDelete}) => {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id ?? index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.badge ? <Badge value={row[col.key]} /> : row[col.key]}
                </td>
              ))}
              <td>
                <div className="table-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit?.(row)}
                    aria-label="Editar"
                  >
                    <Pencil size={16} color="#ffffff" />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete?.(row)}
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} color="#ffffff" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
