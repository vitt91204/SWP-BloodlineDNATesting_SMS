import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  FileText, 

  Upload,
  Download,
  Send,
  Eye,
  TestTube,
  User,
  CheckSquare,
  Square
} from 'lucide-react';
import { testResultAPI, sampleAPI, staffAPI, testRequestAPI, subSampleAPI, userAPI, testServiceAPI } from '@/api/axios';

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
  // Thông tin mới từ API response
  serviceName?: string;
  userFullName?: string;
  appointmentDate?: string;
  sampleType?: string; // từ Sample
  subsampleType?: string; // từ subsample
  collectionType?: string;
  slotTime?: string;
  userId?: number;
  serviceId?: number;
  // Thông tin subsample chi tiết
  subSamples?: Array<{
    subSampleId: number;
    sampleId: number;
    description: string;
    createdAt: string;
    fullName: string;
    dateOfBirth: string;
    sampleType: string;
  }>;
}

export default function ResultsDelivery() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingResultId, setUploadingResultId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStaffInfo, setCurrentStaffInfo] = useState<any>(null);
  const [isMatch, setIsMatch] = useState(true); // Thêm state cho checkbox IsMatch

  // Helper function to get current staff ID from localStorage
  const getCurrentStaffId = (): number | null => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.userId || parsed.id || null;
      }
    } catch (e) {
      // Error parsing user data
    }
    return null;
  };





  const fetchTestRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current staff ID
      const currentStaffId = getCurrentStaffId();
      
      // Load current staff info if available
      if (currentStaffId) {
        try {
          const staffInfo = await staffAPI.getById(currentStaffId);
          setCurrentStaffInfo(staffInfo);
        } catch (error) {
          // Failed to load staff info
        }
      }
      
      let data;
      if (currentStaffId) {
        // Lấy test requests theo staff ID để đảm bảo bảo mật
        try {
          data = await testRequestAPI.getByStaffId(currentStaffId);
        } catch (error) {
          setError(`Không thể tải dữ liệu lịch hẹn cho nhân viên ID ${currentStaffId}. Vui lòng kiểm tra kết nối và thử lại.`);
          setLoading(false);
          return;
        }
      } else {
        // Fallback: lấy tất cả nếu không có staff ID (có thể là admin)
        try {
          data = await testRequestAPI.getAll();
        } catch (error) {
          setError('Không thể tải dữ liệu lịch hẹn. Vui lòng kiểm tra kết nối và thử lại.');
          setLoading(false);
          return;
        }
      }
      
      // Validate data structure
      if (!data) {
        setTestResults([]);
        setLoading(false);
        return;
      }
      
      if (!Array.isArray(data)) {
        // Try to handle single object case
        if (typeof data === 'object' && data !== null) {
          data = [data];
        } else {
          setTestResults([]);
          setLoading(false);
          return;
        }
      }

      // Fetch all users and services for lookup
      let allUsers = [];
      let allServices = [];
      
      try {
        allUsers = await userAPI.getAllUsers();
      } catch (error) {
        console.warn('Failed to fetch users:', error);
      }
      
      try {
        allServices = await testServiceAPI.getAll();
      } catch (error) {
        console.warn('Failed to fetch services:', error);
      }
      
      // Map dữ liệu lịch hẹn thành TestResult
      const mapped = await Promise.all(data.map(async (item: any, index: number) => {
        try {
          
          // Validate item has required fields
          if (!item) {
            return null;
          }
          
          // Extract service name with multiple fallbacks
          let serviceName = 'Chưa rõ';
          let serviceDetails = null;
          
          if (item.service) {
            // Direct service object from API response
            serviceName = item.service.name || item.service.serviceName || item.service.title || 'Chưa rõ';
            serviceDetails = item.service;
          } else if (item.serviceName) {
            // Service name directly from response
            serviceName = item.serviceName;
          } else if (item.serviceId) {
            // Try to find service in fetched services
            const foundService = allServices.find((s: any) => 
              s.serviceId === item.serviceId || s.id === item.serviceId
            );
            if (foundService) {
              serviceName = foundService.name || foundService.serviceName || foundService.title || 'Chưa rõ';
              serviceDetails = foundService;
            } else {
              serviceName = `Service ID: ${item.serviceId}`;
            }
          }
          
          // Extract customer name with multiple fallbacks
          let customerName = 'Chưa rõ';
          let userDetails = null;
          
          if (item.user) {
            // Direct user object from API response
            customerName = item.user.fullName || item.user.name || item.user.username || item.user.email || 'Chưa rõ';
            userDetails = item.user;
          } else if (item.userFullName) {
            // User full name directly from response
            customerName = item.userFullName;
          } else if (item.userId) {
            // Try to find user in fetched users
            const foundUser = allUsers.find((u: any) => 
              u.userId === item.userId || u.id === item.userId
            );
            if (foundUser) {
              customerName = foundUser.fullName || foundUser.name || foundUser.username || foundUser.email || 'Chưa rõ';
              userDetails = foundUser;
            } else {
              customerName = `User ID: ${item.userId}`;
            }
          }
          
          // Extract sample information directly from test request data
          let sampleId = null;
          let sampleType = null;
          let subsampleType = null;
          let sampleInfo = null;
          let subSamples = [];
          
          if (item.sample) {
            // Direct sample object from API response
            sampleId = item.sample.sampleId || item.sample.id;
            sampleType = item.sample.sampleType;
            sampleInfo = item.sample;
          } else if (item.samples && Array.isArray(item.samples) && item.samples.length > 0) {
            // Multiple samples array
            const firstSample = item.samples[0];
            sampleId = firstSample.sampleId || firstSample.id;
            sampleType = firstSample.sampleType;
            sampleInfo = firstSample;
          }

          // Extract subsample information
          if (item.subSamples && Array.isArray(item.subSamples)) {
            subSamples = item.subSamples;
          } else if (sampleId) {
            // Try to fetch subsamples for this sample
            try {
              const subsamplesData = await subSampleAPI.getBySampleId(sampleId);
              if (Array.isArray(subsamplesData)) {
                subSamples = subsamplesData;
              }
            } catch (error) {
              // No subsamples found for sample ID
            }
          }
          
          // Generate a unique ID for this item
          const possibleIds = [
            item.id,
            item.requestId,
            item.testRequestId,
            item.staffId,
            item.userId,
            item.serviceId,
            item.sampleId,
            item.resultId
          ].filter(id => id !== null && id !== undefined);
          
          // Create a truly unique ID by combining multiple fields or using index
          let uniqueId;
          if (possibleIds.length > 0) {
            // Combine the first available ID with the array index to ensure uniqueness
            uniqueId = `${possibleIds[0]}-${index}`;
          } else {
            // Fallback to timestamp + random + index for complete uniqueness
            uniqueId = `temp-${Date.now()}-${Math.random()}-${index}`;
          }
          
          return {
            id: String(uniqueId),
            testName: serviceName,
            customerName: customerName,
            testDate: item.appointmentDate || '',
            status: 'Pending Upload',
            // Store the original request data for later use
            requestData: item,
            // Store additional details
            relatedTestRequest: {
              serviceDetails,
              userDetails
            },
            // Thông tin mới từ API response
            serviceName: serviceName,
            userFullName: customerName,
            appointmentDate: item.appointmentDate,
            sampleType: sampleType,
            subsampleType: subsampleType, // Will be populated if available
            collectionType: item.collectionType,
            slotTime: item.slotTime,
            userId: item.userId,
            serviceId: item.serviceId,
            sampleId: sampleId,
            sampleInfo: sampleInfo,
            subSamples: subSamples
          } as TestResult;
        } catch (error) {
          return null;
        }
      }));
      
      // Filter out null results and sort by request ID (highest first)
      const validResults = mapped.filter(result => result !== null);
      
      // Sort by request ID in descending order (highest first)
      const sortedResults = validResults.sort((a, b) => {
        // Extract request IDs with fallbacks
        const aRequestId = a.requestData?.id || a.requestData?.requestId || a.requestData?.testRequestId || 0;
        const bRequestId = b.requestData?.id || b.requestData?.requestId || b.requestData?.testRequestId || 0;
        
        // Convert to numbers for proper sorting
        const aNum = typeof aRequestId === 'string' ? parseInt(aRequestId) || 0 : aRequestId;
        const bNum = typeof bRequestId === 'string' ? parseInt(bRequestId) || 0 : bRequestId;
        
        // Sort in descending order (highest first)
        return bNum - aNum;
      });
      
      setTestResults(sortedResults);
    } catch (err: any) {
      setError('Không thể tải dữ liệu lịch hẹn. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestRequests();
  }, []);



  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadResult = async (testId: string) => {
    if (!testId) {
      alert('Lỗi: Không tìm thấy ID yêu cầu xét nghiệm');
      return;
    }
    
    if (!selectedFile) {
      alert('Vui lòng chọn file PDF trước khi upload');
      return;
    }
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      alert('Vui lòng chọn file PDF hợp lệ');
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get current staff ID
      const currentStaffId = getCurrentStaffId();
      if (!currentStaffId) {
        throw new Error('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
      }

      // Tìm test result hiện tại để lấy thông tin request
      const currentResult = testResults.find(r => r.id === testId);
      if (!currentResult) {
        throw new Error('Không tìm thấy thông tin yêu cầu xét nghiệm');
      }

      // Lấy sampleId trực tiếp từ test request data
      let sampleId = null;
      try {
        // Lấy sample ID trực tiếp từ test request data
        if (currentResult.sampleId) {
          sampleId = currentResult.sampleId;
        } else if (currentResult.sampleInfo && currentResult.sampleInfo.id) {
          sampleId = currentResult.sampleInfo.id;
        } else if (currentResult.requestData && currentResult.requestData.sample && currentResult.requestData.sample.id) {
          sampleId = currentResult.requestData.sample.id;
        } else if (currentResult.requestData && currentResult.requestData.samples && currentResult.requestData.samples.length > 0) {
          sampleId = currentResult.requestData.samples[0].id || currentResult.requestData.samples[0].sampleId;
        }
        
        if (!sampleId) {
          throw new Error(`Không tìm thấy mẫu xét nghiệm cho yêu cầu này. Vui lòng tạo mẫu xét nghiệm trước trong phần "Quản lý mẫu".`);
        }
      } catch (err) {
        alert(`Lỗi khi tìm mẫu xét nghiệm: ${err.message}`);
        setIsUploading(false);
        return;
      }
      
      if (!sampleId) {
        const errorMessage = `Không tìm thấy mẫu xét nghiệm hợp lệ cho yêu cầu này!\n\n` +
          `Request ID: ${currentResult.requestData?.id || currentResult.requestData?.requestId || currentResult.requestData?.testRequestId}\n` +
          `Customer: ${currentResult.customerName || currentResult.userFullName}\n` +
          `Service: ${currentResult.testName || currentResult.serviceName}\n\n` +
          `Vui lòng:\n` +
          `1. Tạo mẫu xét nghiệm trước trong phần "Quản lý mẫu"\n` +
          `2. Đảm bảo mẫu có trạng thái "Collected" hoặc "Received"\n` +
          `3. Thử lại sau khi tạo mẫu\n\n` +
          `Hoặc liên hệ quản lý để được hỗ trợ.`;
        
        alert(errorMessage);
        setIsUploading(false);
        return;
      }

      // Final validation: Ensure sample exists and is valid
      try {
        const finalSampleValidation = await sampleAPI.getById(sampleId);
        if (!finalSampleValidation) {
          throw new Error('Sample validation failed - sample not found');
        }
        
        // Additional validation: Check if sample has valid status
        if (finalSampleValidation.status && !['Received', 'Collected', 'Tested'].includes(finalSampleValidation.status)) {
          // Sample has unexpected status
        }
        
      } catch (validationError) {
        // Check if it's a 404 error (sample not found)
        if (validationError.response?.status === 404) {
          alert(`Mẫu xét nghiệm với ID ${sampleId} không tồn tại trong hệ thống. Vui lòng tạo mẫu trước khi upload kết quả.`);
        } else {
          alert(`Lỗi validation mẫu xét nghiệm: ${validationError.message}. Vui lòng thử lại.`);
        }
        setIsUploading(false);
        return;
      }

      // Tạo FormData để gửi file theo đúng API specification
      const formData = new FormData();
      
      // Required fields theo API documentation - ensure proper field mapping
      formData.append('SampleId', sampleId);
      formData.append('UploadedBy', currentStaffId.toString());
      formData.append('StaffId', currentStaffId.toString());
      formData.append('IsMatch', isMatch.toString()); // Sử dụng giá trị từ checkbox
      formData.append('PdfFile', selectedFile);
      

      
      // Gọi API upload với FormData instance
      let response;
      try {
        response = await testResultAPI.createWithPdf(formData);
        
        // Validate response
        if (!response) {
          throw new Error('Không nhận được response từ server');
        }
        
      } catch (uploadError: any) {
        
        // Xử lý lỗi cụ thể theo HTTP status codes
        if (uploadError.response?.status === 404) {
          throw new Error('API endpoint không tồn tại. Vui lòng kiểm tra backend.');
        } else if (uploadError.response?.status === 400) {
          const errorMsg = uploadError.response?.data?.message || uploadError.message;
          
          // Check for foreign key constraint errors specifically
          if (errorMsg.includes('foreign key') || errorMsg.includes('sample_id') || errorMsg.includes('FK_')) {
            throw new Error(`Lỗi khóa ngoại: ${errorMsg}. Vui lòng kiểm tra mẫu xét nghiệm có tồn tại không.`);
          }
          
          throw new Error(`Dữ liệu không hợp lệ: ${errorMsg}`);
        } else if (uploadError.response?.status === 413) {
          throw new Error('File quá lớn. Vui lòng chọn file nhỏ hơn.');
        } else if (uploadError.response?.status === 415) {
          throw new Error('Định dạng file không được hỗ trợ. Vui lòng chọn file PDF.');
        } else if (uploadError.response?.status === 500) {
          const errorMsg = uploadError.response?.data?.message || uploadError.message;
          
          // Check for database constraint errors in 500 responses
          if (errorMsg.includes('foreign key') || errorMsg.includes('sample_id') || errorMsg.includes('FK_')) {
            throw new Error(`Lỗi khóa ngoại: Mẫu xét nghiệm với ID ${sampleId} không tồn tại hoặc không hợp lệ. Vui lòng tạo mẫu trước khi upload kết quả.`);
          }
          
          throw new Error(`Lỗi server: ${errorMsg}`);
        } else if (uploadError.response?.status === 0) {
          throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } else {
          const errorMsg = uploadError.response?.data?.message || uploadError.message;
          throw new Error(`Upload thất bại: ${errorMsg}`);
        }
      }
      
      // Get thông tin sample và staff
      let sampleInfo = null;
      let staffInfo = null;
      
      if (response.sampleId) {
        try {
          sampleInfo = await sampleAPI.getById(response.sampleId);
        } catch (error) {
          // Failed to get sample info
        }
      }
      
      if (response.staffId) {
        try {
          staffInfo = await staffAPI.getById(response.staffId);
        } catch (error) {
          // Failed to get staff info
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
                // Thêm thông tin từ response với safety checks
                resultId: response?.resultId || response?.id || 0,
                sampleId: response?.sampleId || sampleId,
                resultData: typeof response?.resultData === 'string' ? response.resultData : 'Test result data',
                uploadedBy: response?.uploadedBy || currentStaffId,
                approvedBy: response?.approvedBy || null,
                uploadedTime: response?.uploadedTime || new Date().toISOString(),
                approvedTime: response?.approvedTime || null,
                staffId: response?.staffId || currentStaffId,
                pdfFile: typeof response?.pdfFile === 'string' ? response.pdfFile : selectedFile.name,
                sampleInfo,
                staffInfo
              }
            : result
        )
      );
      
      setSelectedFile(null);
      setIsUploadMode(false);
      setUploadingResultId(null);
      setIsMatch(true); // Reset checkbox về true khi upload thành công
      
      // Hiển thị thông báo thành công
      alert(`✅ Upload thành công!\n\nFile: ${selectedFile.name}\nResult ID: ${response?.resultId || response?.id || 'N/A'}\nSample ID: ${response?.sampleId || sampleId}\nStaff ID: ${response?.staffId || currentStaffId}`);
      
    } catch (error: any) {
      // Hiển thị thông báo lỗi cho user
      const errorMessage = error.message || 'Upload thất bại';
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsUploading(false);
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
    // TODO: Implement download functionality
  };

  const handleViewResult = (testId: string) => {
    // Logic để xem trước kết quả
    // TODO: Implement view functionality
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Trả kết quả xét nghiệm
            </CardTitle>
            {currentStaffInfo && (
              <p className="text-sm text-gray-600 mt-1">
                Đang xem yêu cầu xét nghiệm của: {currentStaffInfo.fullName || currentStaffInfo.name || currentStaffInfo.username || `Staff ID: ${getCurrentStaffId()}`}
              </p>
            )}
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
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Tải lên kết quả xét nghiệm
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="result-file" className="text-sm font-medium">
                        Chọn file PDF kết quả
                      </Label>
                      <div className="mt-1">
                        <Input
                          id="result-file"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                          disabled={isUploading}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Chỉ chấp nhận file PDF, tối đa 10MB
                      </p>
                    </div>
                    
                    {selectedFile && (
                      <div className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          {selectedFile.type === 'application/pdf' ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              PDF hợp lệ
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              Không phải PDF
                            </Badge>
                          )}
                        </div>
                      </div>
                                         )}
                     
                     {/* Checkbox cho IsMatch */}
                     <div className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                       <button
                         type="button"
                         onClick={() => setIsMatch(!isMatch)}
                         className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                         disabled={isUploading}
                       >
                         {isMatch ? (
                           <CheckSquare className="w-5 h-5 text-blue-600" />
                         ) : (
                           <Square className="w-5 h-5 text-gray-400" />
                         )}
                         <span className="text-sm font-medium text-gray-700">
                           Kết quả khớp với mẫu xét nghiệm
                         </span>
                       </button>
                     </div>
                     
                     <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (uploadingResultId) {
                            handleUploadResult(uploadingResultId);
                          } else {
                            alert('Lỗi: Không tìm thấy ID yêu cầu xét nghiệm');
                          }
                        }}
                        disabled={!selectedFile || isUploading || !uploadingResultId || selectedFile.type !== 'application/pdf'}
                        className="flex-1"
                      >
                        {isUploading ? (
                          <>
                            <Upload className="w-4 h-4 mr-2 animate-spin" />
                            Đang tải lên...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Tải lên kết quả
                          </>
                        )}
                      </Button>
                                             <Button
                         variant="outline"
                         onClick={() => {
                           setIsUploadMode(false);
                           setSelectedFile(null);
                           setUploadingResultId(null);
                           setIsMatch(true); // Reset checkbox khi hủy
                         }}
                         disabled={isUploading}
                       >
                         Hủy
                       </Button>
                    </div>
                    
                    {isUploading && (
                      <div className="text-center py-2">
                        <div className="text-sm text-blue-600">
                          Đang xử lý file PDF...
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Vui lòng không đóng trang web trong quá trình upload
                        </div>
                      </div>
                    )}
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
                        <h3 className="font-semibold text-lg">{result.testName || result.serviceName || 'Unknown Test'}</h3>
                        <p className="text-gray-600">Khách hàng: {result.customerName || result.userFullName || 'Unknown Customer'}</p>
                        <p className="text-sm text-gray-500">
                          Ngày xét nghiệm: {result.testDate || result.appointmentDate ? new Date(result.testDate || result.appointmentDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </p>
                        {result.slotTime && (
                          <p className="text-sm text-gray-500">
                            Giờ hẹn: {result.slotTime}
                          </p>
                        )}
                        {result.collectionType && (
                          <p className="text-sm text-gray-500">
                            Loại lấy mẫu: {result.collectionType}
                          </p>
                        )}
                        {result.deliveryDate && (
                          <p className="text-sm text-green-600">
                            Đã gửi: {new Date(result.deliveryDate).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                        
                        {/* Hiển thị thông tin sample */}
                        {(result.sampleType || result.sampleId) && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <TestTube className="w-4 h-4 text-blue-600" />
                              </div>
                              <h4 className="font-semibold text-blue-900">Thông tin mẫu xét nghiệm</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {result.sampleId && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">Mã mẫu:</span>
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                    #{result.sampleId}
                                  </Badge>
                                </div>
                              )}
                              
                              {result.sampleType && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">Loại mẫu:</span>
                                  <Badge className="bg-green-100 text-green-800">
                                    {result.sampleType}
                                  </Badge>
                                </div>
                              )}
                              
                              {result.subsampleType && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">Loại mẫu con:</span>
                                  <Badge className="bg-purple-100 text-purple-800">
                                    {result.subsampleType}
                                  </Badge>
                                </div>
                              )}
                              
                              {result.sampleInfo && result.sampleInfo.status && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                                  <Badge className={
                                    result.sampleInfo.status === 'Tested' ? 'bg-green-100 text-green-800' :
                                    result.sampleInfo.status === 'Collected' ? 'bg-blue-100 text-blue-800' :
                                    result.sampleInfo.status === 'Received' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {result.sampleInfo.status}
                                  </Badge>
                                </div>
                              )}
                              
                              {result.sampleInfo && result.sampleInfo.collectionTime && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">Thời gian lấy:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(result.sampleInfo.collectionTime).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              )}
                              
                              {result.sampleInfo && result.sampleInfo.receivedTime && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">Thời gian nhận:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(result.sampleInfo.receivedTime).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Thông tin bổ sung */}
                            {result.sampleInfo && (result.sampleInfo.relationship || result.sampleInfo.sampleType) && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <div className="flex items-center gap-2 text-xs text-blue-700">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                  <span className="font-medium">Thông tin bổ sung:</span>
                                </div>
                                <div className="mt-1 text-xs text-gray-600">
                                  {result.sampleInfo.relationship && (
                                    <span className="inline-block mr-3">
                                      Quan hệ: <span className="font-medium">{result.sampleInfo.relationship}</span>
                                    </span>
                                  )}
                                  {result.sampleInfo.sampleType && result.sampleInfo.sampleType !== result.sampleType && (
                                    <span className="inline-block">
                                      Chi tiết: <span className="font-medium">{result.sampleInfo.sampleType}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Hiển thị thông tin subsample chi tiết */}
                        {result.subSamples && result.subSamples.length > 0 && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-purple-600" />
                              </div>
                              <h4 className="font-semibold text-purple-900">Thông tin người tham gia ({result.subSamples.length} người)</h4>
                            </div>
                            
                            <div className="space-y-3">
                              {result.subSamples.map((subSample, index) => (
                                <div key={subSample.subSampleId} className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-purple-700">{index + 1}</span>
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-purple-900 text-sm">{subSample.fullName}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                                            {subSample.sampleType}
                                          </Badge>
                                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs">
                                            #{subSample.subSampleId}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">
                                        Ngày sinh
                                      </div>
                                      <div className="text-sm font-medium text-gray-700">
                                        {new Date(subSample.dateOfBirth).toLocaleDateString('vi-VN')}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <span className="text-xs font-medium text-gray-700">Mã subsample:</span>
                                      <span className="text-xs text-gray-600 font-mono">#{subSample.subSampleId}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                      <span className="text-xs font-medium text-gray-700">Mã mẫu cha:</span>
                                      <span className="text-xs text-gray-600 font-mono">#{subSample.sampleId}</span>
                                    </div>
                                    
                                    {subSample.createdAt && (
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                        <span className="text-xs font-medium text-gray-700">Ngày tạo:</span>
                                        <span className="text-xs text-gray-600">
                                          {new Date(subSample.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-xs font-medium text-gray-700">Loại mẫu:</span>
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        {subSample.sampleType}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {subSample.description && (
                                    <div className="mt-3 pt-3 border-t border-purple-100">
                                      <div className="flex items-center gap-2 text-xs text-purple-700 mb-1">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                        <span className="font-medium">Mô tả:</span>
                                      </div>
                                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                                        {subSample.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            

                          </div>
                        )}
                        

                        
                        {/* Hiển thị thông tin từ response body */}
                        {result.resultId && (
                          <div className="text-xs bg-green-50 border border-green-200 p-2 rounded">
                            <p className="font-medium text-green-800 mb-1">✅ Kết quả đã upload</p>
                            <p className="text-green-700">Result ID: {result.resultId}</p>
                            <p className="text-green-700">Sample ID: {result.sampleId}</p>
                            {result.uploadedTime && (
                              <p className="text-green-700">
                                Uploaded: {new Date(result.uploadedTime).toLocaleDateString('vi-VN')} {new Date(result.uploadedTime).toLocaleTimeString('vi-VN')}
                              </p>
                            )}
                            {result.approvedTime && (
                              <p className="text-green-700">
                                Approved: {new Date(result.approvedTime).toLocaleDateString('vi-VN')} {new Date(result.approvedTime).toLocaleTimeString('vi-VN')}
                              </p>
                            )}
                            {result.pdfFile && (
                              <p className="text-green-700">File: {result.pdfFile}</p>
                            )}
                          </div>
                        )}
                        
                        {/* Hiển thị thông tin sample chi tiết */}
                        {result.sampleInfo && !result.sampleType && (
                          <div className="text-xs bg-gray-50 p-2 rounded">
                            <p className="font-medium">Sample Info:</p>
                            <p>Status: {result.sampleInfo.status || 'N/A'}</p>
                            <p>Type: {result.sampleInfo.sampleType || 'N/A'}</p>
                            {result.sampleInfo.collectionTime && (
                              <p>Collected: {new Date(result.sampleInfo.collectionTime).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>
                        )}
                        
                        {/* Hiển thị thông tin staff */}
                        {result.staffInfo && (
                          <div className="text-xs bg-blue-50 p-2 rounded">
                            <p className="font-medium">Staff Info:</p>
                            <p>Name: {result.staffInfo.name || result.staffInfo.fullName || 'N/A'}</p>
                            <p>Role: {result.staffInfo.role || 'N/A'}</p>
                            {result.staffInfo.email && <p>Email: {result.staffInfo.email}</p>}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {result.resultFile && (
                          <p className="text-xs text-blue-600 mt-1">
                            {typeof result.resultFile === 'string' ? result.resultFile : 'File uploaded'}
                          </p>
                        )}
                        {result.pdfFile && (
                          <p className="text-xs text-green-600 mt-1">
                            PDF: {typeof result.pdfFile === 'string' ? result.pdfFile : 'File uploaded'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                                        <div className="flex gap-2 flex-wrap">
                      
                      {result.status === 'Pending Upload' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setIsUploadMode(true);
                            setUploadingResultId(result.id);
                          }}
                          disabled={isUploading}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
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
                  <p className="text-gray-600">
                    {getCurrentStaffId() 
                      ? 'Không có yêu cầu xét nghiệm nào được gán cho bạn'
                      : 'Không có kết quả xét nghiệm nào'
                    }
                  </p>
                  {getCurrentStaffId() && (
                    <p className="text-sm text-gray-500 mt-2">
                      Liên hệ quản lý để được gán yêu cầu xét nghiệm
                    </p>
                  )}
                </div>
              )}
              
              {/* Add helpful information about sample creation */}
              {testResults.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Lưu ý quan trọng:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Để upload kết quả xét nghiệm, bạn cần tạo mẫu trước trong phần "Quản lý mẫu"</li>
                    <li>• Mẫu xét nghiệm được tạo riêng biệt với yêu cầu xét nghiệm</li>
                    <li>• Nếu không tìm thấy mẫu, vui lòng tạo mẫu thủ công trong phần "Quản lý mẫu"</li>
                    <li>• Nếu gặp lỗi khóa ngoại, vui lòng kiểm tra mẫu xét nghiệm có tồn tại không</li>
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/staff/samples'}
                      className="text-blue-700 border-blue-300 hover:bg-blue-100"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Đi đến Quản lý mẫu
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      Làm mới trang
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 