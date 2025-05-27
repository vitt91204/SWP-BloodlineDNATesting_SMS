import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TestResultCard from '../../components/customer/TestResultCard';
import { test } from '../../services/api/test';

const Result = () => {
  const { testId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [testId]);

  const fetchResult = async () => {
    try {
      const data = await test.getTestResults(testId);
      setResult(data);
    } catch (error) {
      setError(error.message || 'Failed to fetch result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Test Results</h2>
          {result ? (
            <TestResultCard result={result} />
          ) : (
            <div className="alert alert-info">
              No results found for this test.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result; 