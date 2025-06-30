import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  AlertCircle,
  Loader2,
  TestTube,
  Users
} from "lucide-react";
import { testRequestAPI, TestRequestResponse } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Pending", label: "Chờ xác nhận" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Completed", label: "Hoàn thành" },
  { value: "Cancelled", label: "Đã hủy" }
];

export const AppointmentsPage = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<TestRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<TestRequestResponse | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await testRequestAPI.getAll();
        // Sắp xếp lịch hẹn mới nhất lên đầu
        setAppointments(data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }));
      } catch (err) {
        setError("Không thể tải danh sách lịch hẹn. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
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
          <Badge variant="outline">
            {status || 'Không xác định'}
          </Badge>
        );
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    const typeLower = type?.toLowerCase();
    if (typeLower?.includes('home')) {
      return <div className="flex items-center text-green-600"><Home className="w-4 h-4 mr-1" /> Tại nhà</div>;
    }
    if (typeLower?.includes('clinic')) {
      return <div className="flex items-center text-blue-600"><MapPin className="w-4 h-4 mr-1" /> Tại cơ sở</div>;
    }
    if (typeLower?.includes('self')) {
      return <div className="flex items-center text-purple-600"><Users className="w-4 h-4 mr-1" /> Tự thu mẫu</div>;
    }
    return <div>{type}</div>;
  };

  const filteredAppointments = appointments.filter(appointment => {
    const user = appointment.user;
    const service = appointment.service;
    
    const matchesSearch = searchTerm
      ? (user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user?.phone?.includes(searchTerm)) ||
        (appointment.requestId?.toString().includes(searchTerm))
      : true;

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    const matchesDate = dateFilter
      ? new Date(appointment.appointmentDate).toISOString().split('T')[0] === dateFilter
      : true;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateAppointmentStatus = async (appointmentId: number, newStatus: string) => {
    try {
      await testRequestAPI.update(appointmentId, { status: newStatus });
      setAppointments(prev =>
        prev.map(appointment =>
          appointment.requestId === appointmentId ? { ...appointment, status: newStatus } : appointment
        )
      );
      toast({
        title: "Cập nhật thành công!",
        description: `Lịch hẹn #${appointmentId} đã được chuyển sang trạng thái "${newStatus}".`,
      });
    } catch (err) {
      toast({
        title: "Cập nhật thất bại!",
        description: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const getAppointmentStats = () => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === "Pending").length;
    const confirmed = appointments.filter(a => a.status === "Confirmed").length;
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => new Date(a.appointmentDate).toISOString().split('T')[0] === today).length;
    
    return { total, pending, confirmed, todayAppointments };
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(a => new Date(a.appointmentDate).toISOString().split('T')[0] === today && a.status !== "Cancelled");
  };

  const stats = getAppointmentStats();
  const todayAppointments = getTodayAppointments();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 mr-2 animate-spin" />
          <span>Đang tải danh sách lịch hẹn...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-red-600">
          <XCircle className="w-12 h-12 mb-4" />
          <p>{error}</p>
        </div>
      );
    }

    if (filteredAppointments.length === 0) {
      return (
        <div className="text-center py-12">
          <p>Không tìm thấy lịch hẹn nào phù hợp.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã LH</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Dịch vụ</TableHead>
            <TableHead>Ngày & Giờ</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAppointments.map((appointment) => (
            <TableRow key={appointment.requestId}>
              <TableCell className="font-medium">#{appointment.requestId}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{appointment.user?.fullName || 'N/A'}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {appointment.user?.phone || 'N/A'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{appointment.service?.name || 'N/A'}</div>
                  {getAppointmentTypeIcon(appointment.collectionType)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <div className="font-medium">{new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}</div>
                    <div className="text-sm text-gray-500">{appointment.slotTime}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{appointment.staff?.fullName || 'Chưa chỉ định'}</TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
        <p className="text-gray-600 mt-1">Theo dõi và quản lý các lịch hẹn thu mẫu ADN</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Tổng lịch hẹn</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Chờ xác nhận</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Đã xác nhận</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Lịch hẹn hôm nay</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
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
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-9"
                    placeholder="Tìm theo tên, SĐT, mã LH..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {renderContent()}
          </div>
        </TabsContent>

        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Không có lịch hẹn nào trong hôm nay</p>
                ) : (
                  todayAppointments.map((appointment) => (
                    <div
                      key={appointment.requestId}
                      className="flex flex-wrap items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex w-12 h-12 bg-blue-100 rounded-lg items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{appointment.user?.fullName}</div>
                          <div className="text-sm text-gray-500">
                            {appointment.slotTime} - {getAppointmentTypeIcon(appointment.collectionType)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          Xem chi tiết
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
            <DialogTitle>Chi tiết lịch hẹn - #{selectedAppointment?.requestId}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và cập nhật trạng thái lịch hẹn
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Họ tên:</strong> {selectedAppointment.user?.fullName || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedAppointment.user?.email || 'N/A'}</p>
                    <p><strong>Số điện thoại:</strong> {selectedAppointment.user?.phone || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin dịch vụ</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Dịch vụ:</strong> {selectedAppointment.service?.name || 'N/A'}</p>
                    <p><strong>Giá:</strong> {selectedAppointment.service?.price?.toLocaleString('vi-VN') || 'N/A'} VNĐ</p>
                    <p><strong>Loại hình:</strong> {getAppointmentTypeIcon(selectedAppointment.collectionType)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin lịch hẹn</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Ngày hẹn:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Giờ hẹn:</strong> {selectedAppointment.slotTime}</p>
                  <p><strong>Nhân viên:</strong> {selectedAppointment.staff?.fullName || 'Chưa chỉ định'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Địa chỉ</h4>
                <p className="text-sm text-gray-600">{selectedAppointment.address ? `${selectedAppointment.address.addressLine}, ${selectedAppointment.address.city}` : 'Không có'}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) => {
                    updateAppointmentStatus(selectedAppointment.requestId, e.target.value);
                    setSelectedAppointment({...selectedAppointment, status: e.target.value});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
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