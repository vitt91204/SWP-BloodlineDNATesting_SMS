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

export const AdminDashboard = () => {
  return (  
    <div className="w-full px-8 py-6"> 


      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Xem tổng quan về hoạt động của hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600">{stat.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Tests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Đơn xét nghiệm gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{test.customer}</div>
                    <div className="text-sm text-gray-600">
                      {test.type} - {test.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(test.status)}
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch hẹn sắp tới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{appointment.customer}</div>
                    <Badge variant="outline">{appointment.time}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.type}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 