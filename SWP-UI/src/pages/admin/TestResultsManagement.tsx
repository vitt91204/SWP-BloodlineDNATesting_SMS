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
  FileText, 
  Search, 
  Eye, 
  Edit, 
  Plus, 
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Microscope,
  BarChart3
} from "lucide-react";
import { testResultAPI } from "@/api/axios";

interface TestResult {
  id: string;
  testId: string;
  customerName: string;
  customerPhone: string;
  testType: string;
  sampleId: string;
  analysisDate: string;
  completionDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'reviewed' | 'delivered';
  technician: string;
  reviewer: string;
  confidence: number;
  result: 'positive' | 'negative' | 'inconclusive';
  markers: MarkerResult[];
  notes: string;
  reportFile?: string;
  qualityScore: number;
}

interface MarkerResult {
  marker: string;
  value1: string;
  value2: string;
  match: boolean;
  confidence: number;
}

const initialResults: TestResult[] = [
  {
    id: "RES001",
    testId: "XN001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    testType: "Xét nghiệm huyết thống dân sự",
    sampleId: "SMP001",
    analysisDate: "2024-03-18",
    completionDate: "2024-03-20",
    status: "delivered",
    technician: "Nguyễn Thị B",
    reviewer: "Dr. Lê Văn C",
    confidence: 99.99,
    result: "positive",
    markers: [
      { marker: "D3S1358", value1: "15,16", value2: "15,16", match: true, confidence: 99.9 },
      { marker: "vWA", value1: "17,18", value2: "17,18", match: true, confidence: 99.9 },
      { marker: "FGA", value1: "22,24", value2: "22,24", match: true, confidence: 99.9 },
      { marker: "D8S1179", value1: "13,14", value2: "13,14", match: true, confidence: 99.9 },
      { marker: "D21S11", value1: "29,31", value2: "29,31", match: true, confidence: 99.9 }
    ],
    notes: "Kết quả cho thấy có sự tương đồng cao về DNA giữa hai mẫu được xét nghiệm. Với độ tin cậy 99.99%, có thể khẳng định hai người có quan hệ huyết thống cha-con.",
    qualityScore: 95
  },
  {
    id: "RES002",
    testId: "XN002",
    customerName: "Trần Thị B",
    customerPhone: "0907654321",
    testType: "Xét nghiệm huyết thống hành chính",
    sampleId: "SMP002",
    analysisDate: "2024-03-19",
    completionDate: "2024-03-22",
    status: "reviewed",
    technician: "Lê Văn C",
    reviewer: "Dr. Phạm Thị D",
    confidence: 99.95,
    result: "positive",
    markers: [
      { marker: "D3S1358", value1: "15,17", value2: "15,17", match: true, confidence: 99.9 },
      { marker: "vWA", value1: "16,18", value2: "16,18", match: true, confidence: 99.9 },
      { marker: "FGA", value1: "21,23", value2: "21,23", match: true, confidence: 99.9 },
      { marker: "D8S1179", value1: "12,14", value2: "12,14", match: true, confidence: 99.9 },
      { marker: "D21S11", value1: "28,30", value2: "28,30", match: true, confidence: 99.9 }
    ],
    notes: "Kết quả xác nhận quan hệ huyết thống với độ tin cậy cao. Tất cả các marker DNA đều phù hợp.",
    qualityScore: 92
  },
  {
    id: "RES003",
    testId: "XN003",
    customerName: "Lê Văn C",
    customerPhone: "0909876543",
    testType: "Xét nghiệm huyết thống dân sự",
    sampleId: "SMP003",
    analysisDate: "2024-03-20",
    completionDate: "",
    status: "in_progress",
    technician: "Phạm Thị D",
    reviewer: "",
    confidence: 0,
    result: "inconclusive",
    markers: [],
    notes: "Đang trong quá trình phân tích",
    qualityScore: 0
  },
  {
    id: "RES004",
    testId: "XN004",
    customerName: "Phạm Thị D",
    customerPhone: "0908765432",
    testType: "Xét nghiệm huyết thống hành chính",
    sampleId: "SMP004",
    analysisDate: "2024-03-17",
    completionDate: "2024-03-19",
    status: "completed",
    technician: "Nguyễn Văn E",
    reviewer: "",
    confidence: 99.98,
    result: "positive",
    markers: [
      { marker: "D3S1358", value1: "14,16", value2: "14,16", match: true, confidence: 99.9 },
      { marker: "vWA", value1: "16,17", value2: "16,17", match: true, confidence: 99.9 },
      { marker: "FGA", value1: "20,22", value2: "20,22", match: true, confidence: 99.9 },
      { marker: "D8S1179", value1: "11,13", value2: "11,13", match: true, confidence: 99.9 },
      { marker: "D21S11", value1: "27,29", value2: "27,29", match: true, confidence: 99.9 }
    ],
    notes: "Kết quả xác nhận quan hệ huyết thống. Chờ phê duyệt từ chuyên gia.",
    qualityScore: 88
  }
];

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ phân tích" },
  { value: "in_progress", label: "Đang phân tích" },
  { value: "completed", label: "Hoàn thành" },
  { value: "reviewed", label: "Đã phê duyệt" },
  { value: "delivered", label: "Đã gửi" }
];

const resultOptions = [
  { value: "all", label: "Tất cả" },
  { value: "positive", label: "Dương tính" },
  { value: "negative", label: "Âm tính" },
  { value: "inconclusive", label: "Không xác định" }
];

export default function TestResultsManagement() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResult, setNewResult] = useState({
    testId: "",
    customerName: "",
    testType: "",
    sampleId: "",
    technician: "",
    notes: ""
  });

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await testResultAPI.getAll();
        setResults(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching results:", err);
        setError(`Không thể tải danh sách kết quả: ${err.message || 'Lỗi kết nối API'}`);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700">Đã gửi</Badge>;
      case "reviewed":
        return <Badge className="bg-blue-100 text-blue-700">Đã phê duyệt</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-700">Hoàn thành</Badge>;
      case "in_progress":
        return <Badge className="bg-orange-100 text-orange-700">Đang phân tích</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ phân tích</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "positive":
        return <Badge className="bg-green-100 text-green-700">Dương tính</Badge>;
      case "negative":
        return <Badge className="bg-red-100 text-red-700">Âm tính</Badge>;
      case "inconclusive":
        return <Badge className="bg-yellow-100 text-yellow-700">Không xác định</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Chưa có</Badge>;
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    const matchesResult = resultFilter === "all" || result.result === resultFilter;
    
    return matchesSearch && matchesStatus && matchesResult;
  });

  const updateResultStatus = async (resultId: string, newStatus: string) => {
    try {
      await testResultAPI.updateStatus(resultId, newStatus);
      setResults(prev => 
        prev.map(result => 
          result.id === resultId ? { ...result, status: newStatus as any } : result
        )
      );
    } catch (err: any) {
      console.error("Error updating result status:", err);
      alert(`Lỗi cập nhật trạng thái: ${err.message}`);
    }
  };

  const handleAddResult = async () => {
    if (!newResult.testId || !newResult.customerName) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const resultData = {
        testId: newResult.testId,
        customerName: newResult.customerName,
        testType: newResult.testType,
        sampleId: newResult.sampleId,
        technician: newResult.technician,
        notes: newResult.notes,
        status: "pending",
        result: "inconclusive",
        confidence: 0,
        qualityScore: 0
      };

      const newResultData = await testResultAPI.create(resultData);
      setResults(prev => [newResultData, ...prev]);
      setNewResult({
        testId: "",
        customerName: "",
        testType: "",
        sampleId: "",
        technician: "",
        notes: ""
      });
      setShowAddForm(false);
      alert("Thêm kết quả thành công!");
    } catch (err: any) {
      console.error("Error creating result:", err);
      alert(`Lỗi tạo kết quả: ${err.message}`);
    }
  };

  const handleDownloadReport = (resultId: string) => {
    // Logic để tải xuống báo cáo
    console.log('Downloading report for:', resultId);
  };

  const handleUploadReport = (resultId: string) => {
    // Logic để tải lên báo cáo
    console.log('Uploading report for:', resultId);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Quản lý kết quả xét nghiệm
            </CardTitle>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm kết quả mới
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
                  placeholder="Tìm kiếm theo tên khách hàng, mã kết quả..."
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
            <div className="w-full sm:w-48">
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo kết quả" />
                </SelectTrigger>
                <SelectContent>
                  {resultOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã kết quả</TableHead>
                  <TableHead>Mã xét nghiệm</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại xét nghiệm</TableHead>
                  <TableHead>Ngày hoàn thành</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Kết quả</TableHead>
                  <TableHead>Độ tin cậy</TableHead>
                  <TableHead>Chất lượng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.id}</TableCell>
                    <TableCell>{result.testId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{result.customerName}</div>
                        <div className="text-sm text-gray-500">{result.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{result.testType}</TableCell>
                    <TableCell>{result.completionDate || "Chưa hoàn thành"}</TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell>{getResultBadge(result.result)}</TableCell>
                    <TableCell>
                      {result.confidence > 0 ? `${result.confidence}%` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">{result.qualityScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedResult(result)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {result.status === "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(result.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy kết quả xét nghiệm nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Details Dialog */}
      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết kết quả xét nghiệm - {selectedResult?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và cập nhật trạng thái kết quả xét nghiệm
            </DialogDescription>
          </DialogHeader>
          
          {selectedResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Họ tên:</strong> {selectedResult.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {selectedResult.customerPhone}</p>
                    <p><strong>Mã xét nghiệm:</strong> {selectedResult.testId}</p>
                    <p><strong>Mã mẫu:</strong> {selectedResult.sampleId}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin xét nghiệm</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Loại xét nghiệm:</strong> {selectedResult.testType}</p>
                    <p><strong>Kỹ thuật viên:</strong> {selectedResult.technician}</p>
                    <p><strong>Người phê duyệt:</strong> {selectedResult.reviewer || "Chưa có"}</p>
                    <p><strong>Ngày phân tích:</strong> {selectedResult.analysisDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Kết quả phân tích</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Kết quả:</strong> {getResultBadge(selectedResult.result)}</p>
                  <p><strong>Độ tin cậy:</strong> {selectedResult.confidence}%</p>
                  <p><strong>Điểm chất lượng:</strong> {selectedResult.qualityScore}%</p>
                  <p><strong>Ngày hoàn thành:</strong> {selectedResult.completionDate || "Chưa hoàn thành"}</p>
                </div>
              </div>

              {selectedResult.markers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Chi tiết marker DNA</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Marker</TableHead>
                          <TableHead>Giá trị 1</TableHead>
                          <TableHead>Giá trị 2</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Độ tin cậy</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedResult.markers.map((marker, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{marker.marker}</TableCell>
                            <TableCell>{marker.value1}</TableCell>
                            <TableCell>{marker.value2}</TableCell>
                            <TableCell>
                              {marker.match ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </TableCell>
                            <TableCell>{marker.confidence}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                <p className="text-sm text-gray-600">{selectedResult.notes}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <Select
                  value={selectedResult.status}
                  onValueChange={(value) => {
                    updateResultStatus(selectedResult.id, value);
                    setSelectedResult({...selectedResult, status: value as any});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ phân tích</SelectItem>
                    <SelectItem value="in_progress">Đang phân tích</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="reviewed">Đã phê duyệt</SelectItem>
                    <SelectItem value="delivered">Đã gửi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedResult(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Result Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm kết quả xét nghiệm mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin kết quả xét nghiệm mới
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Mã xét nghiệm *</label>
                <Input
                  value={newResult.testId}
                  onChange={(e) => setNewResult({...newResult, testId: e.target.value})}
                  placeholder="XN001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tên khách hàng *</label>
                <Input
                  value={newResult.customerName}
                  onChange={(e) => setNewResult({...newResult, customerName: e.target.value})}
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Loại xét nghiệm</label>
                <Input
                  value={newResult.testType}
                  onChange={(e) => setNewResult({...newResult, testType: e.target.value})}
                  placeholder="Xét nghiệm huyết thống dân sự"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mã mẫu</label>
                <Input
                  value={newResult.sampleId}
                  onChange={(e) => setNewResult({...newResult, sampleId: e.target.value})}
                  placeholder="SMP001"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Kỹ thuật viên</label>
              <Input
                value={newResult.technician}
                onChange={(e) => setNewResult({...newResult, technician: e.target.value})}
                placeholder="Nguyễn Thị B"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Ghi chú</label>
              <Textarea
                value={newResult.notes}
                onChange={(e) => setNewResult({...newResult, notes: e.target.value})}
                placeholder="Ghi chú về kết quả..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAddResult}>Thêm kết quả</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 