const DataTable = ({ columns, data, actions, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col">{column.header}</th>
            ))}
            {actions && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render ? column.render(row) : row[column.field]}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="btn-group">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className={`btn btn-sm btn-${action.variant || 'primary'}`}
                        onClick={() => action.onClick(row)}
                      >
                        {action.icon && <i className={`bi ${action.icon} me-1`}></i>}
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 