const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h2 className="mb-0">{value}</h2>
          </div>
          <div className={`bg-${color} bg-opacity-10 p-3 rounded`}>
            <i className={`bi ${icon} fs-1 text-${color}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 