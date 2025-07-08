import { useEffect, useState } from "react";
import { testRequestAPI, userAPI } from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Search,
  User,
  Calendar,
  Clock,
  Package,
  FileText,
  FlaskConical,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TestRequest {
  requestId: number;
  userId: number;
  serviceId: number;
  collectionType: string;
  status: string;
  appointmentDate: string;
  slotTime: string;
  createdAt: string;
  staffId: number | null;
  addressId: number | null;
  feedbacks: any[];
  payments: any[];
  samples: any[];
  service: {
    serviceId: number;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    testKit: any;
  } | null;
  address: {
    addressId: number;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  } | null;
  user: {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    role: string;
  } | null;
}

export default function ManagerDashboard() {
  const [testRequests, setTestRequests] = useState<TestRequest[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [collectionTypeFilter, setCollectionTypeFilter] = useState('all');
  const [assigning, setAssigning] = useState<{ [key: number]: boolean }>({});
  const [selectedStaff, setSelectedStaff] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all test requests
      const requestsData = await testRequestAPI.getAll();
      console.log('Test requests data:', requestsData);
      setTestRequests(Array.isArray(requestsData) ? requestsData : []);

      // Fetch all users for staff list and customer info
      const usersData = await userAPI.getAllUsers();
      const allUsers = Array.isArray(usersData) ? usersData : [];
      setUsers(allUsers);
      
      // Filter staff users
      const staffUsers = allUsers.filter((u: any) => u.role === "staff");
      setStaffList(staffUsers);
      
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (requestId: number) => {
    const staffId = selectedStaff[requestId];
    if (!staffId) {
      alert("Vui lòng chọn staff!");
      return;
    }

    setAssigning(prev => ({ ...prev, [requestId]: true }));
    
    try {
      // Sử dụng API chuyên dụng để giao việc cho staff
      await testRequestAPI.assignStaff(requestId, staffId);
      
      // Refresh data để lấy thông tin mới nhất từ server
      await fetchData();
      
      // Clear selection
      setSelectedStaff(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
      
      alert("Giao việc thành công!");
    } catch (err: any) {
      console.error('Error assigning task:', err);
      alert(`Lỗi khi giao việc: ${err.message}`);
    } finally {
      setAssigning(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { className: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
      'On-going': { className: 'bg-blue-100 text-blue-800', text: 'Đang xử lý' },
      'Arrived': { className: 'bg-purple-100 text-purple-800', text: 'Đã đến' },
      'Collected': { className: 'bg-green-100 text-green-800', text: 'Đã thu mẫu' },
      'Testing': { className: 'bg-orange-100 text-orange-800', text: 'Đang xét nghiệm' },
      'Completed': { className: 'bg-green-100 text-green-800', text: 'Hoàn thành' },
      'Cancelled': { className: 'bg-red-100 text-red-800', text: 'Đã hủy' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { className: 'bg-gray-100 text-gray-800', text: status };
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const getCollectionTypeVN = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'at clinic':
        return 'Tại cơ sở';
      case 'at home':
        return 'Tại nhà';
      case 'self':
        return 'Tự thu mẫu';
      default:
        return type;
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.userId === userId || u.id === userId);
    return user?.fullName || user?.username || `User ${userId}`;
  };

  const getStaffName = (staffId: number | null) => {
    if (!staffId) return 'Chưa phân công';
    const staff = staffList.find(s => s.userId === staffId || s.id === staffId);
    return staff?.fullName || staff?.username || `Staff ${staffId}`;
  };

  const filteredRequests = testRequests.filter(request => {
    const matchesSearch = 
      getUserName(request.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.requestId ? request.requestId.toString() : "").includes(searchTerm) ||
      request.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesCollectionType = collectionTypeFilter === 'all' || 
      request.collectionType?.toLowerCase() === collectionTypeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCollectionType;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng yêu cầu</p>
                <p className="text-2xl font-bold">{testRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ phân công</p>
                <p className="text-2xl font-bold">{testRequests.filter(r => !r.staffId).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Staff có sẵn</p>
                <p className="text-2xl font-bold">{staffList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold">{testRequests.filter(r => r.status === 'Completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Quản lý phân công công việc
          </CardTitle>
          <div className="text-sm text-gray-600">
            Tổng yêu cầu: {testRequests.length} | Chờ phân công: {testRequests.filter(r => !r.staffId).length} | Staff có sẵn: {staffList.length}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên khách hàng, mã yêu cầu, dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Pending">Chờ xử lý</SelectItem>
                  <SelectItem value="On-going">Đang xử lý</SelectItem>
                  <SelectItem value="Arrived">Đã đến</SelectItem>
                  <SelectItem value="Collected">Đã thu mẫu</SelectItem>
                  <SelectItem value="Testing">Đang xét nghiệm</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={collectionTypeFilter} onValueChange={setCollectionTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hình thức</SelectItem>
                  <SelectItem value="at clinic">Tại cơ sở</SelectItem>
                  <SelectItem value="at home">Tại nhà</SelectItem>
                  <SelectItem value="self">Tự thu mẫu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã yêu cầu</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Hình thức thu mẫu</TableHead>
                  <TableHead>Ngày hẹn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Staff được phân công</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.requestId}>
                    <TableCell className="font-medium">YC{request.requestId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{getUserName(request.userId)}</div>
                          <div className="text-sm text-gray-500">{request.user?.phone || 'Chưa có SĐT'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.service?.name || 'Chưa xác định'}</div>
                        <div className="text-sm text-gray-500">{request.service?.price?.toLocaleString('vi-VN')} VNĐ</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCollectionTypeVN(request.collectionType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm">
                          <div>{request.appointmentDate}</div>
                          <div className="text-gray-500">{request.slotTime}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className={request.staffId ? 'text-green-600 font-medium' : 'text-gray-500'}>
                          {getStaffName(request.staffId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {!request.staffId ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={selectedStaff[request.requestId]?.toString() || ""}
                            onValueChange={val => setSelectedStaff(prev => ({ ...prev, [request.requestId]: Number(val) }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Chọn staff" />
                            </SelectTrigger>
                            <SelectContent>
                              {staffList.map((staff) => (
                                <SelectItem key={staff.userId || staff.id} value={(staff.userId || staff.id).toString()}>
                                  {staff.fullName || staff.username}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            disabled={assigning[request.requestId] || !selectedStaff[request.requestId]}
                            onClick={() => handleAssign(request.requestId)}
                          >
                            {assigning[request.requestId] ? "Đang giao..." : "Giao việc"}
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-green-600">
                          Đã phân công
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty state */}
          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' || collectionTypeFilter !== 'all' 
                ? 'Không tìm thấy yêu cầu nào phù hợp với bộ lọc'
                : 'Không có yêu cầu xét nghiệm nào'
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 