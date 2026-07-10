import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination-bar">
      <span className="pagination-info">
        Mostrando {end - start + 1} de {totalItems} animales
      </span>
      <div className="pagination-pages">
        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-page ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
