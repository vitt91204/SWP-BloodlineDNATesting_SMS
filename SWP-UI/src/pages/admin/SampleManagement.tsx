import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TestTube, 
  Search, 
  Eye, 
  Edit, 
  Plus, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Package
} from "lucide-react";
import { sampleAPI } from "@/api/axios";
import { subSampleAPI } from "@/api/axios";

interface Sample {
  id: string;
  testId: string;
  customerName: string;
  customerPhone: string;
  sampleType: string;
  collectionDate: string;
  receivedDate: string;
  status: 'pending' | 'collected' | 'received' | 'processing' | 'completed' | 'rejected';
  location: string;
  notes: string;
  kitId: number;
  kitName: string;
  technician: string;
  qualityCheck: boolean;
  storageCondition: string;
  expiryDate: string;
}

const initialSamples: Sample[] = [
  {
    id: "SMP001",
    testId: "XN001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    sampleType: "Máu",
    collectionDate: "2024-03-15",
    receivedDate: "2024-03-16",
    status: "received",
    location: "Kho lạnh A - Ngăn 1",
    notes: "Mẫu được thu tại nhà, đóng gói đúng quy trình",
    kitId: 1,
    kitName: "Kit xét nghiệm huyết thống dân sự",
    technician: "Nguyễn Thị B",
    qualityCheck: true,
    storageCondition: "Nhiệt độ: 2-8°C, Độ ẩm: 60-70%",
    expiryDate: "2024-04-15"
  },
  {
    id: "SMP002",
    testId: "XN002",
    customerName: "Trần Thị B",
    customerPhone: "0907654321",
    sampleType: "Nước bọt",
    collectionDate: "2024-03-14",
    receivedDate: "2024-03-14",
    status: "processing",
    location: "Phòng phân tích B",
    notes: "Mẫu thu tại cơ sở, chất lượng tốt",
    kitId: 2,
    kitName: "Kit xét nghiệm huyết thống hành chính",
    technician: "Lê Văn C",
    qualityCheck: true,
    storageCondition: "Nhiệt độ: 2-8°C, Độ ẩm: 60-70%",
    expiryDate: "2024-04-14"
  },
  {
    id: "SMP003",
    testId: "XN003",
    customerName: "Lê Văn C",
    customerPhone: "0909876543",
    sampleType: "Máu",
    collectionDate: "2024-03-13",
    receivedDate: "2024-03-15",
    status: "collected",
    location: "Kho lạnh A - Ngăn 2",
    notes: "Chờ vận chuyển về phòng xét nghiệm",
    kitId: 1,
    kitName: "Kit xét nghiệm huyết thống dân sự",
    technician: "Phạm Thị D",
    qualityCheck: false,
    storageCondition: "Nhiệt độ: 2-8°C, Độ ẩm: 60-70%",
    expiryDate: "2024-04-13"
  },
  {
    id: "SMP004",
    testId: "XN004",
    customerName: "Phạm Thị D",
    customerPhone: "0908765432",
    sampleType: "Nước bọt",
    collectionDate: "2024-03-12",
    receivedDate: "2024-03-12",
    status: "completed",
    location: "Kho lưu trữ dài hạn",
    notes: "Đã hoàn thành phân tích, lưu trữ theo quy định",
    kitId: 2,
    kitName: "Kit xét nghiệm huyết thống hành chính",
    technician: "Nguyễn Văn E",
    qualityCheck: true,
    storageCondition: "Nhiệt độ: -20°C, Độ ẩm: 40-50%",
    expiryDate: "2025-03-12"
  }
];

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ thu mẫu" },
  { value: "collected", label: "Đã thu mẫu" },
  { value: "received", label: "Đã nhận mẫu" },
  { value: "processing", label: "Đang xử lý" },
  { value: "completed", label: "Hoàn thành" },
  { value: "rejected", label: "Từ chối" }
];

// Helper function to map API status to UI status
const mapApiStatusToUI = (apiStatus: string): Sample['status'] => {
  switch (apiStatus) {
    case 'Waiting':
      return 'pending';
    case 'Received':
      return 'received';
    case 'Tested':
      return 'completed';
    default:
      return 'pending';
  }
};

export default function SampleManagement() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSample, setNewSample] = useState({
    testId: "",
    customerName: "",
    customerPhone: "",
    sampleType: "",
    collectionDate: "",
    location: "",
    notes: "",
    kitId: "",
    technician: ""
  });
  const [showAddSubSampleForm, setShowAddSubSampleForm] = useState(false);
  const [createdSampleId, setCreatedSampleId] = useState<number | null>(null);
  const [subSampleDesc, setSubSampleDesc] = useState("");

  // Fetch samples from API
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sampleAPI.getAll();
        
        // Map API response to UI format
        const mappedSamples = Array.isArray(data) ? data.map((apiSample: any) => ({
          id: `SMP${apiSample.id || Math.random().toString().substring(2, 5)}`,
          testId: `XN${apiSample.request_id || Math.random().toString().substring(2, 5)}`,
          customerName: apiSample.customer_name || "Không xác định",
          customerPhone: apiSample.customer_phone || "",
          sampleType: apiSample.sample_type || "Không xác định",
          collectionDate: apiSample.collection_time ? new Date(apiSample.collection_time).toISOString().split('T')[0] : "",
          receivedDate: apiSample.received_time ? new Date(apiSample.received_time).toISOString().split('T')[0] : "",
          status: mapApiStatusToUI(apiSample.status),
          location: apiSample.location || "Chưa xác định",
          notes: apiSample.notes || "",
          kitId: apiSample.kit_id || 1,
          kitName: apiSample.kit_name || "Kit mặc định",
          technician: apiSample.technician_name || "Chưa phân công",
          qualityCheck: apiSample.quality_check || false,
          storageCondition: apiSample.storage_condition || "Nhiệt độ: 2-8°C, Độ ẩm: 60-70%",
          expiryDate: apiSample.expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })) : initialSamples; // Fallback to initial samples if API fails
        
        setSamples(mappedSamples);
      } catch (err: any) {
        console.error("Error fetching samples:", err);
        setError(`Không thể tải danh sách mẫu: ${err.message || 'Lỗi kết nối API'}`);
        // Use initial samples as fallback
        setSamples(initialSamples);
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700">Đang xử lý</Badge>;
      case "received":
        return <Badge className="bg-purple-100 text-purple-700">Đã nhận mẫu</Badge>;
      case "collected":
        return <Badge className="bg-orange-100 text-orange-700">Đã thu mẫu</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ thu mẫu</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Từ chối</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>;
    }
  };

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = 
      sample.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.testId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || sample.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateSampleStatus = async (sampleId: string, newStatus: string) => {
    try {
      // Convert sample ID to number and map status values
      const numericId = parseInt(sampleId.replace('SMP', ''));
      let apiStatus: 'Waiting' | 'Received' | 'Tested';
      
      switch (newStatus) {
        case 'pending':
        case 'collected':
          apiStatus = 'Waiting';
          break;
        case 'received':
        case 'processing':
          apiStatus = 'Received';
          break;
        case 'completed':
          apiStatus = 'Tested';
          break;
        default:
          apiStatus = 'Waiting';
      }
      
      await sampleAPI.updateStatus(numericId, apiStatus);
      setSamples(prev => 
        prev.map(sample => 
          sample.id === sampleId ? { ...sample, status: newStatus as any } : sample
        )
      );
    } catch (err: any) {
      console.error("Error updating sample status:", err);
      alert(`Lỗi cập nhật trạng thái: ${err.message}`);
    }
  };

  const handleAddSample = async () => {
    if (!newSample.testId || !newSample.customerName) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    try {
      // Map to the API expected format
      const sampleData = {
        requestId: parseInt(newSample.testId.replace('XN', '')) || 1,
        collectedBy: 1,
        collectionTime: newSample.collectionDate ? new Date(newSample.collectionDate).toISOString() : undefined,
        receivedTime: undefined,
        status: 'Waiting' as const
      };
      const newSampleData = await sampleAPI.create(sampleData);
      setCreatedSampleId(newSampleData.id);
      setShowAddForm(false);
      setShowAddSubSampleForm(true);
    } catch (err: any) {
      console.error("Error creating sample:", err);
      alert(`Lỗi tạo mẫu: ${err.message}`);
    }
  };

  const handleAddSubSample = async () => {
    if (!createdSampleId || !subSampleDesc) {
      alert("Vui lòng nhập mô tả mẫu con");
      return;
    }
    try {
      await subSampleAPI.create({ sample_id: createdSampleId, description: subSampleDesc });
      setShowAddSubSampleForm(false);
      setSubSampleDesc("");
      setCreatedSampleId(null);
      alert("Tạo mẫu con thành công!");
      // Có thể gọi lại fetchSamples() nếu muốn cập nhật danh sách
    } catch (err) {
      alert("Lỗi tạo mẫu con");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-6 h-6" />
              Quản lý mẫu xét nghiệm
            </CardTitle>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm mẫu mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên khách hàng, mã mẫu..."
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
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Samples Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã mẫu</TableHead>
                  <TableHead>Mã xét nghiệm</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại mẫu</TableHead>
                  <TableHead>Ngày thu</TableHead>
                  <TableHead>Vị trí lưu trữ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Kiểm tra chất lượng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>{sample.testId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sample.customerName}</div>
                        <div className="text-sm text-gray-500">{sample.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{sample.sampleType}</TableCell>
                    <TableCell>{sample.collectionDate}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{sample.location}</div>
                        <div className="text-gray-500">{sample.storageCondition}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(sample.status)}</TableCell>
                    <TableCell>
                      {sample.qualityCheck ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSample(sample)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSamples.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy mẫu xét nghiệm nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Details Dialog */}
      <Dialog open={!!selectedSample} onOpenChange={() => setSelectedSample(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết mẫu xét nghiệm - {selectedSample?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và cập nhật trạng thái mẫu xét nghiệm
            </DialogDescription>
          </DialogHeader>
          
          {selectedSample && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Họ tên:</strong> {selectedSample.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {selectedSample.customerPhone}</p>
                    <p><strong>Mã xét nghiệm:</strong> {selectedSample.testId}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin mẫu</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Loại mẫu:</strong> {selectedSample.sampleType}</p>
                    <p><strong>Bộ kit:</strong> {selectedSample.kitName}</p>
                    <p><strong>Kỹ thuật viên:</strong> {selectedSample.technician}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin lưu trữ</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Vị trí:</strong> {selectedSample.location}</p>
                  <p><strong>Điều kiện bảo quản:</strong> {selectedSample.storageCondition}</p>
                  <p><strong>Ngày hết hạn:</strong> {selectedSample.expiryDate}</p>
                  <p><strong>Ngày thu mẫu:</strong> {selectedSample.collectionDate}</p>
                  <p><strong>Ngày nhận mẫu:</strong> {selectedSample.receivedDate}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                <p className="text-sm text-gray-600">{selectedSample.notes}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <Select
                  value={selectedSample.status}
                  onValueChange={(value) => {
                    updateSampleStatus(selectedSample.id, value);
                    setSelectedSample({...selectedSample, status: value as any});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ thu mẫu</SelectItem>
                    <SelectItem value="collected">Đã thu mẫu</SelectItem>
                    <SelectItem value="received">Đã nhận mẫu</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSample(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sample Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mẫu xét nghiệm mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin mẫu xét nghiệm mới
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Mã xét nghiệm *</label>
                <Input
                  value={newSample.testId}
                  onChange={(e) => setNewSample({...newSample, testId: e.target.value})}
                  placeholder="XN001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tên khách hàng *</label>
                <Input
                  value={newSample.customerName}
                  onChange={(e) => setNewSample({...newSample, customerName: e.target.value})}
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input
                  value={newSample.customerPhone}
                  onChange={(e) => setNewSample({...newSample, customerPhone: e.target.value})}
                  placeholder="0901234567"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Loại mẫu</label>
                <Select value={newSample.sampleType} onValueChange={(value) => setNewSample({...newSample, sampleType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại mẫu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Máu">Máu</SelectItem>
                    <SelectItem value="Nước bọt">Nước bọt</SelectItem>
                    <SelectItem value="Tóc">Tóc</SelectItem>
                    <SelectItem value="Móng tay">Móng tay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ngày thu mẫu</label>
                <Input
                  type="date"
                  value={newSample.collectionDate}
                  onChange={(e) => setNewSample({...newSample, collectionDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vị trí lưu trữ</label>
                <Input
                  value={newSample.location}
                  onChange={(e) => setNewSample({...newSample, location: e.target.value})}
                  placeholder="Kho lạnh A - Ngăn 1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Kỹ thuật viên</label>
              <Input
                value={newSample.technician}
                onChange={(e) => setNewSample({...newSample, technician: e.target.value})}
                placeholder="Nguyễn Thị B"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Ghi chú</label>
              <Textarea
                value={newSample.notes}
                onChange={(e) => setNewSample({...newSample, notes: e.target.value})}
                placeholder="Ghi chú về mẫu..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAddSample}>Tiếp tục</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add SubSample Dialog */}
      <Dialog open={showAddSubSampleForm} onOpenChange={setShowAddSubSampleForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm mẫu con cho mẫu vừa tạo</DialogTitle>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium">Mô tả mẫu con</label>
            <Textarea
              value={subSampleDesc}
              onChange={e => setSubSampleDesc(e.target.value)}
              placeholder="Nhập mô tả mẫu con..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddSubSample}>Lưu mẫu con</Button>
            <Button variant="outline" onClick={() => setShowAddSubSampleForm(false)}>Hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 