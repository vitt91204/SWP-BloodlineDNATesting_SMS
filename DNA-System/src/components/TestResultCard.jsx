const TestResultCard = ({ result }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Test Result #{result.id}</h5>
        <p className="card-text">
          <strong>Status:</strong> {result.status}<br />
          <strong>Result:</strong> {result.result}<br />
          <strong>Date:</strong> {result.date}
        </p>
      </div>
    </div>
  );
};

export default TestResultCard;
