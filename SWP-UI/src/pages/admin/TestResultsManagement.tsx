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

// Updated interface to match actual API structure
interface TestResult {
  id?: number;
  resultId?: number;
  sampleId?: number;
  requestId?: number;
  resultData?: string;
  approvedBy?: number;
  uploadedBy?: number;
  uploadedTime?: string;
  approvedTime?: string;
  staffId?: number;
  // Additional fields that might be present in API response
  status?: string;
  customerName?: string;
  customerPhone?: string;
  testType?: string;
  testId?: string;
  analysisDate?: string;
  completionDate?: string;
  technician?: string;
  reviewer?: string;
  confidence?: number;
  result?: string;
  notes?: string;
  reportFile?: string;
  qualityScore?: number;
  // Related data
  user?: any;
  service?: any;
  staff?: any;
  sample?: any;
}

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
    resultId: 0,
    sampleId: 0,
    requestId: 0,
    resultData: "",
    approvedBy: 0,
    uploadedBy: 0,
    uploadedTime: "",
    approvedTime: "",
    staffId: 0
  });

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await testResultAPI.getAll();
        console.log('Fetched test results:', data);
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
    const customerName = result.customerName || result.user?.fullName || result.user?.name || '';
    const resultId = result.id?.toString() || result.resultId?.toString() || '';
    const testId = result.testId || result.requestId?.toString() || '';
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resultId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    const matchesResult = resultFilter === "all" || result.result === resultFilter;
    
    return matchesSearch && matchesStatus && matchesResult;
  });

  const updateResultStatus = async (resultId: string, newStatus: string) => {
    try {
      // Use the update method instead of non-existent updateStatus
      await testResultAPI.update(parseInt(resultId), { status: newStatus });
      setResults(prev => 
        prev.map(result => 
          (result.id?.toString() === resultId || result.resultId?.toString() === resultId) 
            ? { ...result, status: newStatus } 
            : result
        )
      );
    } catch (err: any) {
      console.error("Error updating result status:", err);
      alert(`Lỗi cập nhật trạng thái: ${err.message}`);
    }
  };

  const handleAddResult = async () => {
    if (!newResult.sampleId || !newResult.requestId) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (Sample ID và Request ID)");
      return;
    }

    try {
      const resultData = {
        resultId: newResult.resultId,
        sampleId: newResult.sampleId,
        requestId: newResult.requestId,
        resultData: newResult.resultData || "Test result data",
        approvedBy: newResult.approvedBy,
        uploadedBy: newResult.uploadedBy,
        uploadedTime: newResult.uploadedTime || new Date().toISOString(),
        approvedTime: newResult.approvedTime || "",
        staffId: newResult.staffId
      };

      const newResultData = await testResultAPI.create(resultData);
      setResults(prev => [newResultData, ...prev]);
      setNewResult({
        resultId: 0,
        sampleId: 0,
        requestId: 0,
        resultData: "",
        approvedBy: 0,
        uploadedBy: 0,
        uploadedTime: "",
        approvedTime: "",
        staffId: 0
      });
      setShowAddForm(false);
      alert("Thêm kết quả thành công!");
    } catch (err: any) {
      console.error("Error creating result:", err);
      alert(`Lỗi tạo kết quả: ${err.message}`);
    }
  };

  const handleDownloadReport = async (resultId: string) => {
    try {
      const blob = await testResultAPI.downloadReport(parseInt(resultId));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-result-${resultId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error("Error downloading report:", err);
      alert(`Lỗi tải xuống báo cáo: ${err.message}`);
    }
  };

  const handleUploadReport = (resultId: string) => {
    // Logic để tải lên báo cáo
    console.log('Uploading report for:', resultId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center text-red-600">
              <AlertCircle className="w-8 h-8 mx-auto mb-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                {filteredResults.map((result) => {
                  const resultId = result.id?.toString() || result.resultId?.toString() || '';
                  const customerName = result.customerName || result.user?.fullName || result.user?.name || 'N/A';
                  const customerPhone = result.customerPhone || result.user?.phone || result.user?.phoneNumber || '';
                  const testType = result.testType || result.service?.name || 'N/A';
                  const completionDate = result.completionDate || result.approvedTime || 'Chưa hoàn thành';
                  const confidence = result.confidence || 0;
                  const qualityScore = result.qualityScore || 0;
                  
                  return (
                    <TableRow key={resultId}>
                      <TableCell className="font-medium">{resultId}</TableCell>
                      <TableCell>{result.requestId || result.testId || 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customerName}</div>
                          <div className="text-sm text-gray-500">{customerPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{testType}</TableCell>
                      <TableCell>{completionDate}</TableCell>
                      <TableCell>{getStatusBadge(result.status || 'pending')}</TableCell>
                      <TableCell>{getResultBadge(result.result || 'inconclusive')}</TableCell>
                      <TableCell>
                        {confidence > 0 ? `${confidence}%` : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm">{qualityScore}%</span>
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
                              onClick={() => handleDownloadReport(resultId)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            <DialogTitle>Chi tiết kết quả xét nghiệm - {selectedResult?.id || selectedResult?.resultId}</DialogTitle>
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
                    <p><strong>Họ tên:</strong> {selectedResult.customerName || selectedResult.user?.fullName || selectedResult.user?.name || 'N/A'}</p>
                    <p><strong>Số điện thoại:</strong> {selectedResult.customerPhone || selectedResult.user?.phone || selectedResult.user?.phoneNumber || 'N/A'}</p>
                    <p><strong>Mã xét nghiệm:</strong> {selectedResult.requestId || selectedResult.testId || 'N/A'}</p>
                    <p><strong>Mã mẫu:</strong> {selectedResult.sampleId || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin xét nghiệm</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Loại xét nghiệm:</strong> {selectedResult.testType || selectedResult.service?.name || 'N/A'}</p>
                    <p><strong>Kỹ thuật viên:</strong> {selectedResult.technician || selectedResult.staff?.name || 'N/A'}</p>
                    <p><strong>Người phê duyệt:</strong> {selectedResult.reviewer || selectedResult.approvedBy || "Chưa có"}</p>
                    <p><strong>Ngày phân tích:</strong> {selectedResult.analysisDate || selectedResult.uploadedTime || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Kết quả phân tích</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Kết quả:</strong> {getResultBadge(selectedResult.result || 'inconclusive')}</p>
                  <p><strong>Độ tin cậy:</strong> {selectedResult.confidence || 0}%</p>
                  <p><strong>Điểm chất lượng:</strong> {selectedResult.qualityScore || 0}%</p>
                  <p><strong>Ngày hoàn thành:</strong> {selectedResult.completionDate || selectedResult.approvedTime || "Chưa hoàn thành"}</p>
                </div>
              </div>

              {selectedResult.resultData && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dữ liệu kết quả</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">{selectedResult.resultData}</pre>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                <p className="text-sm text-gray-600">{selectedResult.notes || 'Không có ghi chú'}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <Select
                  value={selectedResult.status || 'pending'}
                  onValueChange={(value) => {
                    const resultId = selectedResult.id?.toString() || selectedResult.resultId?.toString() || '';
                    if (resultId) {
                      updateResultStatus(resultId, value);
                      setSelectedResult({...selectedResult, status: value});
                    }
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
                <label className="text-sm font-medium">Sample ID *</label>
                <Input
                  type="number"
                  value={newResult.sampleId || ''}
                  onChange={(e) => setNewResult({...newResult, sampleId: parseInt(e.target.value) || 0})}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Request ID *</label>
                <Input
                  type="number"
                  value={newResult.requestId || ''}
                  onChange={(e) => setNewResult({...newResult, requestId: parseInt(e.target.value) || 0})}
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Staff ID</label>
                <Input
                  type="number"
                  value={newResult.staffId || ''}
                  onChange={(e) => setNewResult({...newResult, staffId: parseInt(e.target.value) || 0})}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Uploaded By</label>
                <Input
                  type="number"
                  value={newResult.uploadedBy || ''}
                  onChange={(e) => setNewResult({...newResult, uploadedBy: parseInt(e.target.value) || 0})}
                  placeholder="1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Result Data</label>
              <Textarea
                value={newResult.resultData}
                onChange={(e) => setNewResult({...newResult, resultData: e.target.value})}
                placeholder="Enter test result data..."
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