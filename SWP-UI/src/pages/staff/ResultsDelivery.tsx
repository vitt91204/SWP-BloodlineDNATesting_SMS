import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  FileText, 
  PlusCircle,
  Upload,
  Download,
  Send,
  Eye
} from 'lucide-react';
import { testResultAPI, sampleAPI, staffAPI, testRequestAPI } from '@/api/axios';

interface TestResult {
  id: string;
  testName: string;
  customerName: string;
  testDate: string;
  status: 'Ready' | 'Delivered' | 'Pending Upload';
  resultFile?: string;
  deliveryDate?: string;
  // Thêm thông tin từ response body
  resultId?: number;
  sampleId?: number;
  resultData?: string;
  uploadedBy?: number;
  approvedBy?: number;
  uploadedTime?: string;
  approvedTime?: string;
  staffId?: number;
  pdfFile?: string;
  // Thông tin chi tiết
  sampleInfo?: any;
  staffInfo?: any;
  // Store the original request data for later use
  requestData?: any;
  // Thông tin testRequest liên quan
  relatedTestRequest?: any;
}

export default function ResultsDelivery() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingResultId, setUploadingResultId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get current staff ID from localStorage
  const getCurrentStaffId = (): number | null => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.userId || parsed.id || null;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
    return null;
  };

  // Helper function to get sample ID from test request
  const getSampleIdFromRequest = async (requestId: string): Promise<number | null> => {
    console.log('Getting sample ID for request:', requestId);
    
    try {
      // First try to get sample by request ID
      console.log('Trying to get samples by request ID...');
      const samples = await sampleAPI.getByRequestId(parseInt(requestId));
      console.log('Samples from API:', samples);
      
      if (samples && samples.length > 0) {
        const sampleId = samples[0].id || samples[0].sampleId;
        console.log('Found sample ID from samples API:', sampleId);
        return sampleId;
      }
      
      // If no sample found, try to get test request details
      console.log('No samples found, trying to get test request details...');
      const testRequest = await testRequestAPI.getById(parseInt(requestId));
      console.log('Test request details:', testRequest);
      
      if (testRequest && testRequest.samples && testRequest.samples.length > 0) {
        const sampleId = testRequest.samples[0].id || testRequest.samples[0].sampleId;
        console.log('Found sample ID from test request:', sampleId);
        return sampleId;
      }
      
      // If still no sample found, check if we can create one or use a fallback
      console.log('No sample found in test request, checking if we can proceed without sample ID...');
      
      // For now, let's try to proceed without sample ID if the backend allows it
      // This might be a temporary solution until samples are properly created
      console.warn('No sample ID found, proceeding with request ID as fallback');
      return null; // Return null to trigger the error, but we'll handle it differently
      
    } catch (error) {
      console.error('Error getting sample ID:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchTestRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await testRequestAPI.getAll();
        console.log('Raw test request data:', data);
        
        // Log the first item structure if available
        if (Array.isArray(data) && data.length > 0) {
          console.log('First test request structure:', data[0]);
          console.log('Available fields:', Object.keys(data[0]));
        }
        
        // Map dữ liệu lịch hẹn thành TestResult
        const mapped = Array.isArray(data) ? data.map((item: any) => ({
          id: String(item.id || item.requestId || item.testRequestId),
          testName: item.service?.name || 'Chưa rõ',
          customerName: item.user?.fullName || item.user?.username || 'Chưa rõ',
          testDate: item.appointmentDate || '',
          status: 'Pending Upload',
          // Store the original request data for later use
          requestData: item,
        }) as TestResult) : [];
        setTestResults(mapped);
      } catch (err: any) {
        setError('Không thể tải dữ liệu lịch hẹn');
      } finally {
        setLoading(false);
      }
    };
    fetchTestRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Badge className="bg-blue-100 text-blue-800">Sẵn sàng gửi</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>;
      case 'Pending Upload':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ tải lên</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadResult = async (testId: string) => {
    if (selectedFile) {
      setIsUploading(true);
      console.log('Starting upload for testId:', testId);
      console.log('Selected file:', selectedFile);
      
      try {
        // Get current staff ID
        const currentStaffId = getCurrentStaffId();
        if (!currentStaffId) {
          throw new Error('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
        }

        // Lấy sampleId từ API /api/Sample (lọc theo requestId)
        let sampleId = null;
        try {
          const allSamples = await sampleAPI.getAll();
          const foundSample = allSamples.find(s => String(s.requestId) === String(testId));
          if (foundSample) {
            sampleId = foundSample.id || foundSample.sampleId;
            console.log('SampleId lấy từ API /api/Sample:', sampleId);
          }
        } catch (err) {
          console.error('Lỗi khi lấy sample từ API:', err);
        }
        if (!sampleId) {
          alert('Không tìm thấy mẫu xét nghiệm cho yêu cầu này!');
          setIsUploading(false);
          return;
        }

        // Tạo FormData để gửi file
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('sampleId', sampleId.toString()); // BẮT BUỘC
        formData.append('requestId', testId);
        formData.append('uploadedBy', currentStaffId.toString());
        formData.append('staffId', currentStaffId.toString());
        formData.append('resultData', 'Test result data');
        
        // Log FormData content
        console.log('FormData content:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        
        // Gọi API upload
        console.log('Calling testResultAPI.createWithPdf...');
        try {
          const response = await testResultAPI.createWithPdf(formData);
          console.log('Upload response:', response);
        } catch (uploadError) {
          console.error('Detailed upload error:', uploadError);
          console.error('Error response data:', uploadError.response?.data);
          console.error('Error response status:', uploadError.response?.status);
          console.error('Error response headers:', uploadError.response?.headers);
          throw uploadError; // Re-throw để xử lý ở catch block bên ngoài
        }
        const response = await testResultAPI.createWithPdf(formData);
        
        // Get thông tin sample và staff
        let sampleInfo = null;
        let staffInfo = null;
        
        if (response.sampleId) {
          try {
            sampleInfo = await sampleAPI.getById(response.sampleId);
          } catch (error) {
            console.error('Failed to get sample info:', error);
          }
        }
        
        if (response.staffId) {
          try {
            staffInfo = await staffAPI.getById(response.staffId);
          } catch (error) {
            console.error('Failed to get staff info:', error);
          }
        }
        
        // Cập nhật UI sau khi upload thành công
        setTestResults(prev =>
          prev.map(result =>
            result.id === testId
              ? { 
                  ...result, 
                  status: 'Ready', 
                  resultFile: selectedFile.name,
                  // Thêm thông tin từ response
                  resultId: response.resultId,
                  sampleId: response.sampleId,
                  resultData: response.resultData,
                  uploadedBy: response.uploadedBy,
                  approvedBy: response.approvedBy,
                  uploadedTime: response.uploadedTime,
                  approvedTime: response.approvedTime,
                  staffId: response.staffId,
                  pdfFile: response.pdfFile,
                  sampleInfo,
                  staffInfo
                  // XÓA relatedTestRequest
                }
              : result
          )
        );
        
        setSelectedFile(null);
        setIsUploadMode(false);
        setUploadingResultId(null);
        
        console.log('Upload successful:', response);
      } catch (error) {
        console.error('Upload failed:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        // Hiển thị thông báo lỗi cho user
        alert(`Upload failed: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsUploading(false);
      }
    } else {
      console.log('No file selected');
      alert('Vui lòng chọn file PDF trước khi upload');
    }
  };

  const handleDeliverResult = (testId: string) => {
    // Logic để gửi kết quả cho khách hàng
    setTestResults(prev =>
      prev.map(result =>
        result.id === testId
          ? { 
              ...result, 
              status: 'Delivered', 
              deliveryDate: new Date().toISOString().split('T')[0]
            }
          : result
      )
    );
  };

  const handleDownloadResult = (testId: string) => {
    // Logic để tải xuống file kết quả
    console.log('Download result for test:', testId);
  };

  const handleViewResult = (testId: string) => {
    // Logic để xem trước kết quả
    console.log('View result for test:', testId);
  };

  const loadResultDetails = async (testId: string) => {
    setLoadingDetails(testId);
    try {
      const result = testResults.find(r => r.id === testId);
      if (!result) return;

      let sampleInfo = null;
      let staffInfo = null;

      // Giả sử testId có thể dùng để get sample info
      if (result.sampleId) {
        try {
          sampleInfo = await sampleAPI.getById(result.sampleId);
        } catch (error) {
          console.error('Failed to get sample info:', error);
        }
      }

      if (result.staffId) {
        try {
          staffInfo = await staffAPI.getById(result.staffId);
        } catch (error) {
          console.error('Failed to get staff info:', error);
        }
      }

      // Cập nhật thông tin chi tiết
      setTestResults(prev =>
        prev.map(r =>
          r.id === testId
            ? { ...r, sampleInfo, staffInfo }
            : r
        )
      );
    } catch (error) {
      console.error('Failed to load result details:', error);
    } finally {
      setLoadingDetails(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Trả kết quả xét nghiệm
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setIsUploadMode(!isUploadMode)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Thêm kết quả mới
            </Button>
            <Button 
              variant="outline" 
              onClick={async () => {
                try {
                  console.log('Testing API connection...');
                  const response = await testResultAPI.getAll();
                  console.log('API test successful:', response);
                  alert('API connection OK');
                } catch (error) {
                  console.error('API test failed:', error);
                  alert('API connection failed: ' + error.message);
                }
              }}
            >
              Test API
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            {isUploadMode && (
              <Card className="mb-4 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Tải lên kết quả xét nghiệm</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="result-file">Chọn file PDF kết quả</Label>
                      <Input
                        id="result-file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="mt-1"
                      />
                    </div>
                    {selectedFile && (
                      <div className="text-sm text-gray-600">
                        File đã chọn: {selectedFile.name}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => uploadingResultId && handleUploadResult(uploadingResultId)}
                        disabled={!selectedFile || isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Upload className="w-4 h-4 mr-2 animate-spin" />
                            Đang tải lên...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Tải lên
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsUploadMode(false);
                          setSelectedFile(null);
                          setUploadingResultId(null);
                        }}
                        disabled={isUploading}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              {testResults.map((result) => (
                <Card key={result.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{result.testName}</h3>
                        <p className="text-gray-600">Khách hàng: {result.customerName}</p>
                        <p className="text-sm text-gray-500">
                          Ngày xét nghiệm: {new Date(result.testDate).toLocaleDateString('vi-VN')}
                        </p>
                        {result.deliveryDate && (
                          <p className="text-sm text-green-600">
                            Đã gửi: {new Date(result.deliveryDate).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                        
                        {/* Hiển thị thông tin từ response body */}
                        {result.resultId && (
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Result ID: {result.resultId}</p>
                            <p>Sample ID: {result.sampleId}</p>
                            {result.uploadedTime && (
                              <p>Uploaded: {new Date(result.uploadedTime).toLocaleDateString('vi-VN')}</p>
                            )}
                            {result.approvedTime && (
                              <p>Approved: {new Date(result.approvedTime).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>
                        )}
                        
                        {/* Hiển thị thông tin sample */}
                        {result.sampleInfo && (
                          <div className="text-xs bg-gray-50 p-2 rounded">
                            <p className="font-medium">Sample Info:</p>
                            <p>Status: {result.sampleInfo.status}</p>
                            <p>Type: {result.sampleInfo.sampleType}</p>
                            {result.sampleInfo.collectionTime && (
                              <p>Collected: {new Date(result.sampleInfo.collectionTime).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>
                        )}
                        
                        {/* Hiển thị thông tin staff */}
                        {result.staffInfo && (
                          <div className="text-xs bg-blue-50 p-2 rounded">
                            <p className="font-medium">Staff Info:</p>
                            <p>Name: {result.staffInfo.name || result.staffInfo.fullName}</p>
                            <p>Role: {result.staffInfo.role}</p>
                            {result.staffInfo.email && <p>Email: {result.staffInfo.email}</p>}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {getStatusBadge(result.status)}
                        <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>
                        {result.resultFile && (
                          <p className="text-xs text-blue-600 mt-1">{result.resultFile}</p>
                        )}
                        {result.pdfFile && (
                          <p className="text-xs text-green-600 mt-1">PDF: {result.pdfFile}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {/* Button load chi tiết */}
                      {!result.sampleInfo && !result.staffInfo && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => loadResultDetails(result.id)}
                          disabled={loadingDetails === result.id}
                        >
                          {loadingDetails === result.id ? (
                            <>
                              <Upload className="w-4 h-4 mr-1 animate-spin" />
                              Đang tải...
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-1" />
                              Tải chi tiết
                            </>
                          )}
                        </Button>
                      )}
                      
                      {result.status === 'Pending Upload' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setIsUploadMode(true);
                            setUploadingResultId(result.id);
                          }}
                          disabled={isUploading}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Tải lên kết quả
                        </Button>
                      )}
                      
                      {result.status === 'Ready' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewResult(result.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem trước
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleDeliverResult(result.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Gửi cho khách hàng
                          </Button>
                        </>
                      )}
                      
                      {result.status === 'Delivered' && result.resultFile && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadResult(result.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Tải xuống
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {testResults.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Không có kết quả xét nghiệm nào</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 