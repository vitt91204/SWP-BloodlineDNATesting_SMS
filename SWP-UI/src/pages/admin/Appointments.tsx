import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Eye, 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

// Sample data for appointments
const initialAppointments = [
  {
    id: "LH001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    testType: "Xét nghiệm huyết thống dân sự",
    appointmentType: "home",
    date: "2024-03-16",
    time: "09:00",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    status: "confirmed",
    participants: 2,
    notes: "Khách hàng yêu cầu đến đúng giờ",
    staff: "Nguyễn Thị X"
  },
  {
    id: "LH002",
    customerName: "Trần Thị B",
    customerPhone: "0907654321",
    testType: "Xét nghiệm huyết thống hành chính",
    appointmentType: "facility",
    date: "2024-03-16",
    time: "10:30",
    address: "Cơ sở xét nghiệm ADN - 456 Đường XYZ",
    status: "pending",
    participants: 3,
    notes: "Gia đình có trẻ nhỏ",
    staff: "Phạm Văn Y"
  },
  {
    id: "LH003",
    customerName: "Lê Văn C",
    customerPhone: "0909876543",
    testType: "Xét nghiệm huyết thống dân sự",
    appointmentType: "home",
    date: "2024-03-17",
    time: "14:00",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    status: "completed",
    participants: 2,
    notes: "Đã hoàn thành thu mẫu",
    staff: "Nguyễn Thị X"
  },
  {
    id: "LH004",
    customerName: "Phạm Thị D",
    customerPhone: "0908765432",
    testType: "Xét nghiệm huyết thống hành chính",
    appointmentType: "facility",
    date: "2024-03-18",
    time: "11:00",
    address: "Cơ sở xét nghiệm ADN - 456 Đường XYZ",
    status: "confirmed",
    participants: 2,
    notes: "Khách hàng đã xác nhận lịch hẹn",
    staff: "Phạm Văn Y"
  },
  {
    id: "LH005",
    customerName: "Hoàng Văn E",
    customerPhone: "0905432109",
    testType: "Xét nghiệm huyết thống dân sự",
    appointmentType: "home",
    date: "2024-03-19",
    time: "08:30",
    address: "321 Đường GHI, Quận 2, TP.HCM",
    status: "cancelled",
    participants: 1,
    notes: "Khách hàng hủy lịch hẹn",
    staff: "Nguyễn Thị X"
  }
];

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" }
];

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã xác nhận
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ xác nhận
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700">
            Không xác định
          </Badge>
        );
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    return type === "home" ? (
      <div className="flex items-center text-green-600">
        <Home className="w-4 h-4 mr-1" />
        Tại nhà
      </div>
    ) : (
      <div className="flex items-center text-blue-600">
        <MapPin className="w-4 h-4 mr-1" />
        Tại cơ sở
      </div>
    );
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleDateFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(event.target.value);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = !dateFilter || appointment.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateAppointmentStatus = (appointmentId: string, newStatus: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      )
    );
  };

  const getAppointmentStats = () => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === "pending").length;
    const confirmed = appointments.filter(a => a.status === "confirmed").length;
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today).length;
    
    return { total, pending, confirmed, todayAppointments };
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(a => a.date === today && a.status !== "cancelled");
  };

  const stats = getAppointmentStats();
  const todayAppointments = getTodayAppointments();

  return (
    <div className="w-full px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
        <p className="text-gray-600">Theo dõi và quản lý các lịch hẹn thu mẫu ADN</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Tổng lịch hẹn</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Chờ xác nhận</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Đã xác nhận</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Hôm nay</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Tất cả lịch hẹn</TabsTrigger>
          <TabsTrigger value="today">Lịch hẹn hôm nay</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-9"
                    placeholder="Tìm kiếm theo tên khách hàng, mã lịch hẹn hoặc số điện thoại..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={handleDateFilter}
                  className="w-48"
                />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Appointments Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lịch hẹn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại hình</TableHead>
                  <TableHead>Ngày & Giờ</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.customerName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {appointment.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {getAppointmentTypeIcon(appointment.appointmentType)}
                        <div className="text-sm text-gray-500 mt-1">
                          {appointment.participants} người
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium">{appointment.date}</div>
                          <div className="text-sm text-gray-500">{appointment.time}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {appointment.address}
                    </TableCell>
                    <TableCell>{appointment.staff}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch hẹn hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Không có lịch hẹn nào trong hôm nay</p>
                ) : (
                  todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{appointment.customerName}</div>
                          <div className="text-sm text-gray-500">
                            {appointment.time} - {getAppointmentTypeIcon(appointment.appointmentType)}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.address}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn - {selectedAppointment?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và cập nhật trạng thái lịch hẹn
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Họ tên:</strong> {selectedAppointment.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {selectedAppointment.customerPhone}</p>
                    <p><strong>Số người tham gia:</strong> {selectedAppointment.participants} người</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin lịch hẹn</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Loại xét nghiệm:</strong> {selectedAppointment.testType}</p>
                    <p><strong>Ngày hẹn:</strong> {selectedAppointment.date}</p>
                    <p><strong>Giờ hẹn:</strong> {selectedAppointment.time}</p>
                    <p><strong>Nhân viên:</strong> {selectedAppointment.staff}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Địa điểm</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Hình thức:</strong> {getAppointmentTypeIcon(selectedAppointment.appointmentType)}</p>
                  <p><strong>Địa chỉ:</strong> {selectedAppointment.address}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) => {
                    updateAppointmentStatus(selectedAppointment.id, e.target.value);
                    setSelectedAppointment({...selectedAppointment, status: e.target.value});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage; 