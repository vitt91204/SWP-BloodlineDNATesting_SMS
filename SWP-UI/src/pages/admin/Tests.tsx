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
import { Search, Eye, FileText, Calendar, User, TestTube } from "lucide-react";

// Sample data for DNA tests
const initialTests = [
  {
    id: "XN001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    testType: "Xét nghiệm huyết thống dân sự",
    sampleType: "Thu mẫu tại nhà",
    dateCreated: "2024-03-15",
    expectedDate: "2024-03-22",
    status: "processing",
    price: "3,500,000 VNĐ",
    participants: 2,
    notes: "Gia đình có 2 thành viên cần xét nghiệm"
  },
  {
    id: "XN002",
    customerName: "Trần Thị B",
    customerPhone: "0907654321",
    testType: "Xét nghiệm huyết thống hành chính",
    sampleType: "Thu mẫu tại cơ sở",
    dateCreated: "2024-03-14",
    expectedDate: "2024-03-24",
    status: "completed",
    price: "5,000,000 VNĐ",
    participants: 3,
    notes: "Xét nghiệm cho 3 thành viên trong gia đình"
  },
  {
    id: "XN003",
    customerName: "Lê Văn C",
    customerPhone: "0909876543",
    testType: "Xét nghiệm huyết thống dân sự",
    sampleType: "Thu mẫu tại nhà",
    dateCreated: "2024-03-13",
    expectedDate: "2024-03-20",
    status: "pending",
    price: "2,800,000 VNĐ",
    participants: 2,
    notes: "Chờ xác nhận thông tin"
  },
  {
    id: "XN004",
    customerName: "Phạm Thị D",
    customerPhone: "0908765432",
    testType: "Xét nghiệm huyết thống hành chính",
    sampleType: "Thu mẫu tại cơ sở",
    dateCreated: "2024-03-12",
    expectedDate: "2024-03-22",
    status: "sample_collected",
    price: "4,200,000 VNĐ",
    participants: 2,
    notes: "Đã thu mẫu, chờ phân tích"
  }
];

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "sample_collected", label: "Đã thu mẫu" },
  { value: "processing", label: "Đang phân tích" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" }
];

export default function Tests() {
  const [tests, setTests] = useState(initialTests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700">
            Hoàn thành
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            Đang phân tích
          </Badge>
        );
      case "sample_collected":
        return (
          <Badge className="bg-purple-100 text-purple-700">
            Đã thu mẫu
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            Chờ xử lý
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700">
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = 
      test.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || test.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateTestStatus = (testId: string, newStatus: string) => {
    setTests(prev => 
      prev.map(test => 
        test.id === testId ? { ...test, status: newStatus } : test
      )
    );
  };

  const getTestStats = () => {
    const total = tests.length;
    const pending = tests.filter(t => t.status === "pending").length;
    const processing = tests.filter(t => t.status === "processing").length;
    const completed = tests.filter(t => t.status === "completed").length;
    
    return { total, pending, processing, completed };
  };

  const stats = getTestStats();

  return (
    <div className="w-full px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn xét nghiệm</h1>
        <p className="text-gray-600">Theo dõi và quản lý các đơn xét nghiệm ADN</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Tổng đơn</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Chờ xử lý</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TestTube className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Đang phân tích</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">Hoàn thành</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="pl-9"
                placeholder="Tìm kiếm theo tên khách hàng, mã đơn hoặc số điện thoại..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
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

        {/* Tests Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Loại xét nghiệm</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày dự kiến</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{test.customerName}</div>
                    <div className="text-sm text-gray-500">{test.customerPhone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{test.testType}</div>
                    <div className="text-sm text-gray-500">{test.sampleType}</div>
                  </div>
                </TableCell>
                <TableCell>{test.dateCreated}</TableCell>
                <TableCell>{test.expectedDate}</TableCell>
                <TableCell>{getStatusBadge(test.status)}</TableCell>
                <TableCell className="font-medium text-blue-600">{test.price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTest(test)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Test Details Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn xét nghiệm - {selectedTest?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và cập nhật trạng thái đơn xét nghiệm
            </DialogDescription>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Họ tên:</strong> {selectedTest.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {selectedTest.customerPhone}</p>
                    <p><strong>Số người tham gia:</strong> {selectedTest.participants} người</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin xét nghiệm</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Loại xét nghiệm:</strong> {selectedTest.testType}</p>
                    <p><strong>Hình thức:</strong> {selectedTest.sampleType}</p>
                    <p><strong>Giá trị:</strong> {selectedTest.price}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tiến độ</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Ngày tạo đơn:</strong> {selectedTest.dateCreated}</p>
                  <p><strong>Ngày dự kiến hoàn thành:</strong> {selectedTest.expectedDate}</p>
                  <p><strong>Trạng thái hiện tại:</strong> {getStatusBadge(selectedTest.status)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                <p className="text-sm text-gray-600">{selectedTest.notes}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <select
                  value={selectedTest.status}
                  onChange={(e) => {
                    updateTestStatus(selectedTest.id, e.target.value);
                    setSelectedTest({...selectedTest, status: e.target.value});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="sample_collected">Đã thu mẫu</option>
                  <option value="processing">Đang phân tích</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTest(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 