import { useState, useEffect } from 'react';
import StatsCard from '../../components/common/StatsCard';
import DataTable from '../../components/common/DataTable';
import { admin } from '../../services/api/admin';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTests: 0,
    pendingResults: 0,
    activeUsers: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await admin.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="h3 mb-4">Dashboard</h1>
      
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatsCard 
            title="Total Tests"
            value={stats.totalTests}
            icon="bi-clipboard-data"
            color="primary"
          />
        </div>
        <div className="col-md-3">
          <StatsCard 
            title="Pending Results"
            value={stats.pendingResults}
            icon="bi-hourglass-split"
            color="warning"
          />
        </div>
        <div className="col-md-3">
          <StatsCard 
            title="Active Users"
            value={stats.activeUsers}
            icon="bi-people"
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatsCard 
            title="Revenue"
            value={`$${stats.revenue}`}
            icon="bi-currency-dollar"
            color="info"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Recent Activity</h5>
          <DataTable 
            loading={loading}
            columns={[
              { header: 'Date', field: 'date' },
              { header: 'User', field: 'user' },
              { header: 'Action', field: 'action' },
              { header: 'Status', field: 'status' }
            ]}
            data={[]} // Add your data here
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
