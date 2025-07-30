import { useState, useEffect, useCallback } from "react";
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
  Users,
  RefreshCw,
  Filter
} from "lucide-react";
import { testRequestAPI, TestRequestResponse, userAPI, paymentAPI } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Pending", label: "Chờ xác nhận" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Completed", label: "Hoàn thành" },
  { value: "Cancelled", label: "Đã hủy" }
];

const filterOptions = [
  { value: "all", label: "Tất cả lịch hẹn" },
  { value: "user", label: "Theo khách hàng" },
  { value: "staff", label: "Theo nhân viên" },
  { value: "today", label: "Hôm nay" },
];

export const AppointmentsPage = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<TestRequestResponse[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [staffIdFilter, setStaffIdFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<TestRequestResponse | null>(null);

  // Function to fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      console.log('Fetching all users...');
      const userData = await userAPI.getAllUsers();
      setUsers(Array.isArray(userData) ? userData : []);
      console.log(`Successfully fetched ${Array.isArray(userData) ? userData.length : 0} users`);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      // Don't show error toast for users fetch, just log it
    }
  }, []);

  // Function to fetch all payments
  const fetchPayments = useCallback(async () => {
    try {
      console.log('Fetching all payments...');
      const paymentData = await paymentAPI.getAll();
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      console.log(`Successfully fetched ${Array.isArray(paymentData) ? paymentData.length : 0} payments`);
      console.log('Sample payment data:', paymentData?.[0]);
    } catch (err: any) {
      console.error('Failed to fetch payments:', err);
      // Don't show error toast for payments fetch, just log it
    }
  }, []);

  // Function to find payment by request ID
  const findPaymentByRequestId = useCallback((requestId: number) => {
    console.log('Looking for payment with requestId:', requestId);
    console.log('Available payments:', payments);
    
    const payment = payments.find(payment => {
      console.log('Checking payment:', payment);
      console.log('Payment requestId:', payment.requestId, 'Type:', typeof payment.requestId);
      console.log('Looking for requestId:', requestId, 'Type:', typeof requestId);
      
      // Try different field names for request ID
      const paymentRequestId = payment.requestId || payment.request_id || payment.id;
      return paymentRequestId === requestId;
    });
    
    console.log('Found payment:', payment);
    return payment;
  }, [payments]);

  // Function to get payment amount for an appointment
  const getPaymentAmount = useCallback((appointment: TestRequestResponse) => {
    console.log('Getting payment amount for appointment:', appointment);
    
    // Try different field names for appointment ID
    const appointmentId = appointment.requestId || appointment.id || appointment.testRequestId;
    console.log('Appointment ID to match:', appointmentId);
    
    const payment = findPaymentByRequestId(appointmentId);
    if (payment && payment.amount) {
      console.log('Found payment amount:', payment.amount);
      return payment.amount;
    }
    
    console.log('No payment found, using service price:', appointment.service?.price);
    // Fallback to service price if no payment found
    return appointment.service?.price || 0;
  }, [findPaymentByRequestId]);

  // Function to format payment amount
  const formatPaymentAmount = useCallback((amount: number) => {
    if (!amount) return 'Chưa có';
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  }, []);

  // Function to find user by ID
  const findUserById = useCallback((userId: number) => {
    return users.find(user => 
      user.userId === userId || 
      user.id === userId
    );
  }, [users]);

  // Function to get user display info
  const getUserDisplayInfo = useCallback((userId: number) => {
    const user = findUserById(userId);
    if (user) {
      return {
        fullName: user.fullName || user.username || `User ${userId}`,
        phone: user.phone || 'Chưa có SĐT',
        email: user.email || 'Chưa có email'
      };
    }
    return {
      fullName: `User ID: ${userId}`,
      phone: 'Chưa có SĐT',
      email: 'Chưa có email'
    };
  }, [findUserById]);

  // Hàm fetch appointments với các tùy chọn khác nhau
  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data: TestRequestResponse[] = [];

      // Sử dụng các API GET endpoints khác nhau dựa trên filter type
      switch (filterType) {
        case "user":
          if (userIdFilter && !isNaN(Number(userIdFilter))) {
            console.log(`Fetching appointments for user ID: ${userIdFilter}`);
            data = await testRequestAPI.getByUserId(Number(userIdFilter));
          } else {
            // Nếu không có user ID, fetch tất cả
            data = await testRequestAPI.getAll();
          }
          break;
          
        case "staff":
          if (staffIdFilter && !isNaN(Number(staffIdFilter))) {
            console.log(`Fetching appointments for staff ID: ${staffIdFilter}`);
            data = await testRequestAPI.getByStaffId(Number(staffIdFilter));
          } else {
            // Nếu không có staff ID, fetch tất cả
            data = await testRequestAPI.getAll();
          }
          break;
          
        case "today":
        case "all":
        default:
          console.log('Fetching all appointments');
          data = await testRequestAPI.getAll();
          break;
      }

      // Sắp xếp lịch hẹn mới nhất lên đầu
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setAppointments(sortedData);
      console.log(`Successfully fetched ${sortedData.length} appointments`);
      console.log('Sample appointment data:', sortedData[0]);
      console.log('Appointment field names:', sortedData[0] ? Object.keys(sortedData[0]) : []);
      console.log('First appointment requestId:', sortedData[0]?.requestId);
      console.log('First appointment id:', sortedData[0]?.id);
      console.log('First appointment testRequestId:', sortedData[0]?.testRequestId);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Không thể tải danh sách lịch hẹn. Vui lòng thử lại.";
      setError(errorMessage);
      console.error('Failed to fetch appointments:', err);
      
      toast({
        title: "Lỗi tải dữ liệu",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filterType, userIdFilter, staffIdFilter, toast]);

  // Hàm refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchAppointments(),
      fetchUsers(),
      fetchPayments()
    ]);
    setIsRefreshing(false);
    
    toast({
      title: "Làm mới thành công",
      description: "Dữ liệu lịch hẹn, người dùng và thanh toán đã được cập nhật.",
    });
  };

  // Fetch data when component mounts or filter changes
  useEffect(() => {
    Promise.all([
      fetchAppointments(),
      fetchUsers(),
      fetchPayments()
    ]);
  }, [fetchAppointments, fetchUsers, fetchPayments]);

  // Hàm fetch appointment by ID
  const fetchAppointmentById = async (id: number) => {
    try {
      console.log(`Fetching appointment details for ID: ${id}`);
      const appointment = await testRequestAPI.getById(id);
      setSelectedAppointment(appointment);
    } catch (err: any) {
      console.error('Failed to fetch appointment details:', err);
      toast({
        title: "Lỗi tải chi tiết",
        description: "Không thể tải thông tin chi tiết lịch hẹn.",
        variant: "destructive",
      });
    }
  };

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
    const userInfo = getUserDisplayInfo(appointment.userId);
    
    const matchesSearch = searchTerm
      ? (user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (userInfo.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user?.phone?.includes(searchTerm)) ||
        (userInfo.phone?.includes(searchTerm)) ||
        (appointment.requestId?.toString().includes(searchTerm)) ||
        (appointment.userId?.toString().includes(searchTerm))
      : true;

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    const matchesDate = dateFilter
      ? new Date(appointment.appointmentDate).toISOString().split('T')[0] === dateFilter
      : true;

    // Filter for today's appointments
    if (filterType === "today") {
      const today = new Date().toISOString().split('T')[0];
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      return matchesSearch && matchesStatus && appointmentDate === today;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateAppointmentStatus = async (appointmentId: number, newStatus: string) => {
    try {
      // Sử dụng API update hoặc updateStatus
      await testRequestAPI.update(appointmentId, { status: newStatus });
      
      // Refresh lại appointment đó hoặc toàn bộ danh sách
      await fetchAppointments();
      
      toast({
        title: "Cập nhật thành công!",
        description: `Lịch hẹn #${appointmentId} đã được chuyển sang trạng thái "${newStatus}".`,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Không thể cập nhật trạng thái. Vui lòng thử lại.";
      toast({
        title: "Cập nhật thất bại!",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Failed to update appointment status:', err);
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
            <TableHead>Giá tiền</TableHead>
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
                  <div className="font-medium">{appointment.user?.fullName || getUserDisplayInfo(appointment.userId).fullName}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {appointment.user?.phone || getUserDisplayInfo(appointment.userId).phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{appointment.service?.name || `Service ID: ${appointment.serviceId}`}</div>
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
              <TableCell>
                {formatPaymentAmount(getPaymentAmount(appointment))}
              </TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (appointment.requestId) {
                      fetchAppointmentById(appointment.requestId);
                    } else {
                      setSelectedAppointment(appointment);
                    }
                  }}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
            <p className="text-gray-600 mt-1">Theo dõi và quản lý các lịch hẹn thu mẫu ADN</p>
          </div>

        </div>
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
              {/* Filter Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Loại bộ lọc
                </label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    // Reset filter values when changing type
                    setUserIdFilter("");
                    setStaffIdFilter("");
                  }}
                  className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Filter Inputs */}
              {filterType === "user" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Khách hàng
                  </label>
                  <Input
                    type="number"
                    placeholder="Nhập ID khách hàng..."
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                    className="w-full md:w-64"
                  />
                </div>
              )}

              {filterType === "staff" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Nhân viên
                  </label>
                  <Input
                    type="number"
                    placeholder="Nhập ID nhân viên..."
                    value={staffIdFilter}
                    onChange={(e) => setStaffIdFilter(e.target.value)}
                    className="w-full md:w-64"
                  />
                </div>
              )}

              {/* Main Filter Row */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[250px]">
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
                  className="w-full md:w-auto"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
              </div>

              {/* Filter Summary */}
              {filteredAppointments.length !== appointments.length && (
                <div className="mt-3 text-sm text-gray-600">
                  Hiển thị {filteredAppointments.length} / {appointments.length} lịch hẹn
                  {filterType !== "all" && ` (Lọc ${filterOptions.find(f => f.value === filterType)?.label.toLowerCase()})`}
                </div>
              )}
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
                          <div className="font-medium">{appointment.user?.fullName || getUserDisplayInfo(appointment.userId).fullName}</div>
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
                          onClick={() => {
                            if (appointment.requestId) {
                              fetchAppointmentById(appointment.requestId);
                            } else {
                              setSelectedAppointment(appointment);
                            }
                          }}
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
                    <p><strong>User ID:</strong> {selectedAppointment.userId}</p>
                    <p><strong>Họ tên:</strong> {selectedAppointment.user?.fullName || getUserDisplayInfo(selectedAppointment.userId).fullName}</p>
                    <p><strong>Email:</strong> {selectedAppointment.user?.email || getUserDisplayInfo(selectedAppointment.userId).email}</p>
                    <p><strong>Số điện thoại:</strong> {selectedAppointment.user?.phone || getUserDisplayInfo(selectedAppointment.userId).phone}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin dịch vụ</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Service ID:</strong> {selectedAppointment.serviceId}</p>
                    <p><strong>Dịch vụ:</strong> {selectedAppointment.service?.name || 'Chưa có thông tin'}</p>
                    <p><strong>Giá dịch vụ:</strong> {selectedAppointment.service?.price ? `${selectedAppointment.service.price.toLocaleString('vi-VN')} VNĐ` : 'Chưa có thông tin'}</p>
                    <p><strong>Số tiền thanh toán:</strong> {formatPaymentAmount(getPaymentAmount(selectedAppointment))}</p>
                    <p><strong>Loại hình:</strong> {getAppointmentTypeIcon(selectedAppointment.collectionType)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin lịch hẹn</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Ngày hẹn:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Giờ hẹn:</strong> {selectedAppointment.slotTime}</p>
                  <p><strong>Ngày tạo:</strong> {new Date(selectedAppointment.createdAt).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Nhân viên:</strong> {selectedAppointment.staff?.fullName || (selectedAppointment.staffId ? `Staff ID: ${selectedAppointment.staffId}` : 'Chưa chỉ định')}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Địa chỉ</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Address ID:</strong> {selectedAppointment.addressId || 'Chưa có'}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.address ? `${selectedAppointment.address.street}, ${selectedAppointment.address.city}` : 'Chưa có thông tin địa chỉ chi tiết'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin liên quan</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Số lượng mẫu:</strong> {selectedAppointment.samples?.length || 0}</p>
                  <p><strong>Số lượng thanh toán:</strong> {selectedAppointment.payments?.length || 0}</p>
                  <p><strong>Số lượng feedback:</strong> {selectedAppointment.feedbacks?.length || 0}</p>
                </div>
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