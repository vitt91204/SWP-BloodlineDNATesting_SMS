import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import React, { useEffect, useState } from 'react';
import { reportAPI } from '@/api/axios';

// Temporary data for demonstration
const stats = [
  {
    name: "Tổng khách hàng",
    value: "1,234",
    change: "+12.3%",
    trend: "up",
    icon: Users
  },
  {
    name: "Đơn xét nghiệm",
    value: "567",
    change: "+8.2%",
    trend: "up",
    icon: FileText
  },
  {
    name: "Lịch hẹn hôm nay",
    value: "12",
    change: "-2.1%",
    trend: "down",
    icon: Calendar
  },
  {
    name: "Doanh thu tháng",
    value: "234.5M",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp
  }
];

const recentTests = [
  {
    id: "XN001",
    customer: "Nguyễn Văn A",
    type: "ADN Huyết thống",
    status: "completed",
    date: "2024-03-15"
  },
  {
    id: "XN002",
    customer: "Trần Thị B",
    type: "ADN Hành chính",
    status: "pending",
    date: "2024-03-14"
  },
  {
    id: "XN003",
    customer: "Lê Văn C",
    type: "ADN Huyết thống",
    status: "processing",
    date: "2024-03-14"
  }
];

const appointments = [
  {
    id: "LH001",
    customer: "Phạm Thị D",
    type: "Thu mẫu tại nhà",
    time: "09:00",
    date: "2024-03-16"
  },
  {
    id: "LH002",
    customer: "Hoàng Văn E",
    type: "Thu mẫu tại cơ sở",
    time: "10:30",
    date: "2024-03-16"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Hoàn thành
        </Badge>
      );
    case "processing":
      return (
        <Badge className="bg-blue-100 text-blue-700">
          <Clock className="w-3 h-3 mr-1" />
          Đang xử lý
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          Chờ xử lý
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-700">
          <XCircle className="w-3 h-3 mr-1" />
          Không xác định
        </Badge>
      );
  }
};

// Hàm kiểm tra dữ liệu trả về từ API
const safeValue = (val, key) => {
  if (val == null) return '...';
  if (typeof val === 'object') {
    if (Array.isArray(val)) return val.length;
    if (key && val[key] !== undefined) return val[key];
    const firstKey = Object.keys(val)[0];
    return val[firstKey];
  }
  if (typeof val === 'string' && val.startsWith('<!DOCTYPE html>')) {
    return 'Lỗi API!';
  }
  return val;
};

export const AdminDashboard = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [thisMonthPayments, setThisMonthPayments] = useState('');
  const [thisMonthRequests, setThisMonthRequests] = useState('');
  const [monthlyRequests, setMonthlyRequests] = useState('');
  const [dailyRequests, setDailyRequests] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const revenue = await reportAPI.getMonthlyRevenue(selectedMonth, selectedYear);
        setMonthlyRevenue(revenue);
        const [payments, requests, monthly, daily] = await Promise.all([
          reportAPI.getThisMonthPayments(),
          reportAPI.getThisMonthRequests(),
          reportAPI.getMonthlyRequests(),
          reportAPI.getDailyRequests(selectedMonth, selectedYear)
        ]);
        console.log('API DATA:', { revenue, payments, requests, monthly, daily });
        setThisMonthPayments(payments);
        setThisMonthRequests(requests);
        setMonthlyRequests(monthly);
        setDailyRequests(daily);
      } catch (e) {
        console.error('API ERROR:', e);
      }
    }
    fetchData();
  }, [selectedMonth, selectedYear]);

  // Tạo danh sách tháng và năm cho select
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="w-full px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan số liệu hệ thống</p>
        <div className="flex gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tháng</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Năm</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Doanh thu tháng này</div>
            <div className="text-2xl font-bold text-gray-900">
              {(monthlyRevenue as unknown) && typeof monthlyRevenue === 'object' && monthlyRevenue !== null ? (monthlyRevenue as any).totalRevenue : '...'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Số thanh toán tháng này</div>
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(thisMonthPayments) ? thisMonthPayments.length : '...'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Số đơn xét nghiệm tháng này</div>
            <div className="text-2xl font-bold text-gray-900">
              {Array.isArray(thisMonthRequests) ? thisMonthRequests.filter(x => x != null).length : '...'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Requests Table */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê đơn xét nghiệm theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {typeof monthlyRequests === 'number' ? monthlyRequests : '...'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Requests Table */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê đơn xét nghiệm theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Ngày</th>
                    <th className="text-left p-2">Số đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
                    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                    return daysArray.map(day => {
                      const found = Array.isArray(dailyRequests) && dailyRequests.find(d => d.day === day);
                      return (
                        <tr key={day}>
                          <td className="p-2">{day}</td>
                          <td className="p-2">{found ? found.count : 0}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 