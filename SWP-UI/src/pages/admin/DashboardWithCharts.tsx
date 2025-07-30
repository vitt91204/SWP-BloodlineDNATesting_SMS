import React, { useState, useEffect } from 'react';
import { reportAPI } from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  Calendar,
  Activity,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import DashboardCharts, { 
  RevenueChart, 
  PaymentList, 
  RequestList, 
  MonthlyTrendChart, 
  DailyChart,
  SummaryCards 
} from '@/components/DashboardCharts';

interface ChartData {
  revenue: any[];
  payments: any[];
  requests: any[];
  daily: any[];
}

export const DashboardWithCharts = () => {
  const now = new Date();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData>({
    revenue: [],
    payments: [],
    requests: [],
    daily: []
  });
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i);

  // Fetch data for charts
  const fetchChartData = async () => {
    setLoading(true);
    try {
      // Fetch revenue data for 1 month only
      const revenueData = [];
      const monthsToFetch = 1;
      
      for (let i = monthsToFetch - 1; i >= 0; i--) {
        const date = new Date(selectedYear, selectedMonth - 1 - i, 1);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        try {
          const revenue = await reportAPI.getMonthlyRevenue(month, year);
          revenueData.push({
            month: `${month}/${year}`,
            revenue: revenue?.totalRevenue || 0,
            name: `${month}/${year}`
          });
        } catch (error) {
          revenueData.push({
            month: `${month}/${year}`,
            revenue: 0,
            name: `${month}/${year}`
          });
        }
      }
      setChartData(prev => ({ ...prev, revenue: revenueData }));

      // Fetch payment data for current month
      try {
        const payments = await reportAPI.getThisMonthPayments(selectedMonth, selectedYear);
        
        const paymentData = Array.isArray(payments) ? payments.map((payment, index) => ({
          id: payment.paymentId || payment.id || index + 1,
          amount: payment.amount || 0,
          status: payment.status || 'Pending',
          name: payment.userFullname,
          requestId: payment.requestId
        })) : [];
        
        setChartData(prev => ({ ...prev, payments: paymentData }));
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setChartData(prev => ({ ...prev, payments: [] }));
      }

      // Fetch request data for current month
      try {
        const requests = await reportAPI.getThisMonthRequests(selectedMonth, selectedYear);
        const requestData = Array.isArray(requests) ? requests.map((request, index) => ({
          id: request.id || index + 1,
          status: request.status || 'Pending',
          name: request.userFullName || 'Không có tên',
          serviceName: request.serviceName || 'Không có dịch vụ',
          collectionType: request.collectionType || 'Không xác định'
        })) : [];
        setChartData(prev => ({ ...prev, requests: requestData }));
      } catch (error) {
        console.error('Error fetching request data:', error);
        setChartData(prev => ({ ...prev, requests: [] }));
      }

      // Fetch daily data for current month
      try {
        const dailyData = [];
        const daysInCurrentMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        for (let day = 1; day <= Math.min(daysInCurrentMonth, 30); day++) {
          try {
            const dailyRequests = await reportAPI.getDailyRequests(selectedMonth, selectedYear, day);
            dailyData.push({
              day: day,
              requests: typeof dailyRequests === 'number' ? dailyRequests : 0,
              name: `Ngày ${day}`
            });
          } catch (error) {
            dailyData.push({
              day: day,
              requests: 0,
              name: `Ngày ${day}`
            });
          }
        }
        setChartData(prev => ({ ...prev, daily: dailyData }));
      } catch (error) {
        console.error('Error fetching daily data:', error);
        setChartData(prev => ({ ...prev, daily: [] }));
      }

    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedMonth, selectedYear]);

  const handleRefresh = () => {
    fetchChartData();
  };

  const handleExport = () => {
    // Export functionality can be implemented here
    console.log('Exporting data...');
  };

  return (
    <div className="w-full px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-1">Thống kê và phân tích dữ liệu hệ thống</p>
        </div>

      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Bộ lọc dữ liệu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
              <select
                className="border rounded px-3 py-2"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
              <select
                className="border rounded px-3 py-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <SummaryCards chartData={chartData} />

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="payments">Thanh toán</TabsTrigger>
          <TabsTrigger value="requests">Đơn xét nghiệm</TabsTrigger>
          <TabsTrigger value="daily">Theo ngày</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={chartData.revenue} />
            <PaymentList data={chartData.payments} />
            <RequestList data={chartData.requests} />
            <DailyChart data={chartData.daily} />
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueChart data={chartData.revenue} />
          <MonthlyTrendChart data={chartData.revenue} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentList data={chartData.payments} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <RequestList data={chartData.requests} />
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <DailyChart data={chartData.daily} />
          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo ngày</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {chartData.daily.slice(0, 30).map((day, index) => (
                  <div key={index} className="text-center p-2 border rounded">
                    <div className="text-sm font-medium">{day.name}</div>
                    <div className="text-lg font-bold">{day.requests}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardWithCharts; 