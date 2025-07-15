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
  Eye,
  TestTube
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
  const [currentStaffInfo, setCurrentStaffInfo] = useState<any>(null);

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



  // Helper function to get service details
  const getServiceDetails = async (serviceId: number): Promise<any> => {
    try {
      console.log('Fetching service details for service ID:', serviceId);
      const response = await fetch(`/api/TestService/${serviceId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Service details fetched:', data);
        return data;
      } else {
        console.warn(`Service API returned ${response.status} for service ID:`, serviceId);
        return null;
      }
    } catch (error) {
      console.warn('Error fetching service details for service ID:', serviceId, error);
      return null;
    }
  };

  // Helper function to get user details
  const getUserDetails = async (userId: number): Promise<any> => {
    try {
      console.log('Fetching user details for user ID:', userId);
      const response = await fetch(`/api/User`);
      if (response.ok) {
        const users = await response.json();
        const foundUser = users.find((user: any) => user.userId === userId || user.id === userId);
        console.log('User details found:', foundUser);
        return foundUser || null;
      } else {
        console.warn(`User API returned ${response.status} for user ID:`, userId);
        return null;
      }
    } catch (error) {
      console.warn('Error fetching user details for user ID:', userId, error);
      return null;
    }
  };





  // Helper function to refresh sample info for all test results
  const refreshAllSampleInfo = async () => {
    console.log('Refreshing sample info for all test results...');
    
    // No need to fetch samples separately - the sample info should already be included
    // in the test request data from /api/TestRequest/staff/{staffId}
    console.log('Sample info refresh completed - using data from test request');
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
          console.error('Failed to load staff info:', error);
        }
      }
      
      let data;
      if (currentStaffId) {
        // Lấy test requests theo staff ID để đảm bảo bảo mật
        console.log('Fetching test requests for staff ID:', currentStaffId);
        try {
          data = await testRequestAPI.getByStaffId(currentStaffId);
          console.log('Test requests fetched successfully:', data);
        } catch (error) {
          console.error('Failed to fetch test requests for staff ID:', currentStaffId, error);
          setError(`Không thể tải dữ liệu lịch hẹn cho nhân viên ID ${currentStaffId}. Vui lòng kiểm tra kết nối và thử lại.`);
          setLoading(false);
          return;
        }
      } else {
        // Fallback: lấy tất cả nếu không có staff ID (có thể là admin)
        console.log('No staff ID found, fetching all test requests');
        try {
          data = await testRequestAPI.getAll();
          console.log('All test requests fetched successfully:', data);
        } catch (error) {
          console.error('Failed to fetch all test requests:', error);
          setError('Không thể tải dữ liệu lịch hẹn. Vui lòng kiểm tra kết nối và thử lại.');
          setLoading(false);
          return;
        }
      }
      
      console.log('Raw test request data:', data);
      
      // Validate data structure
      if (!data) {
        console.warn('No data received from API');
        setTestResults([]);
        setLoading(false);
        return;
      }
      
      if (!Array.isArray(data)) {
        console.warn('API returned non-array data:', typeof data, data);
        // Try to handle single object case
        if (typeof data === 'object' && data !== null) {
          data = [data];
        } else {
          setTestResults([]);
          setLoading(false);
          return;
        }
      }
      
      // Log the first item structure if available
      if (data.length > 0) {
        console.log('First test request structure:', data[0]);
        console.log('Available fields:', Object.keys(data[0]));
      }
      
      // Map dữ liệu lịch hẹn thành TestResult
      const mapped = await Promise.all(data.map(async (item: any, index: number) => {
        try {
          console.log(`Processing test request item ${index}:`, item);
          console.log('Service info:', item.service);
          console.log('User info:', item.user);
          console.log('Sample info:', item.sample);
          console.log('All available fields:', Object.keys(item));
          console.log('ID fields check:', {
            id: item.id,
            requestId: item.requestId,
            testRequestId: item.testRequestId,
            staffId: item.staffId,
            userId: item.userId,
            serviceId: item.serviceId
          });
          
          // Validate item has required fields
          if (!item) {
            console.warn(`Item ${index} is null or undefined`);
            return null;
          }
          
          // Extract service name with multiple fallbacks
          let serviceName = 'Chưa rõ';
          let serviceDetails = null;
          
          if (item.service) {
            serviceName = item.service.name || item.service.serviceName || item.service.title || 'Chưa rõ';
            serviceDetails = item.service;
          } else if (item.serviceId) {
            // Try to fetch service details if not included
            try {
              serviceDetails = await getServiceDetails(item.serviceId);
              if (serviceDetails) {
                serviceName = serviceDetails.name || serviceDetails.serviceName || serviceDetails.title || `Service ID: ${item.serviceId}`;
              } else {
                serviceName = `Service ID: ${item.serviceId}`;
              }
            } catch (error) {
              console.warn('Failed to fetch service details for service ID:', item.serviceId, error);
              serviceName = `Service ID: ${item.serviceId}`;
            }
          }
          
          // Extract customer name with multiple fallbacks
          let customerName = 'Chưa rõ';
          let userDetails = null;
          
          if (item.user) {
            customerName = item.user.fullName || item.user.name || item.user.username || item.user.email || 'Chưa rõ';
            userDetails = item.user;
          } else if (item.userId) {
            // Try to fetch user details if not included
            try {
              userDetails = await getUserDetails(item.userId);
              if (userDetails) {
                customerName = userDetails.fullName || userDetails.name || userDetails.username || userDetails.email || `User ID: ${item.userId}`;
              } else {
                customerName = `User ID: ${item.userId}`;
              }
            } catch (error) {
              console.warn('Failed to fetch user details for user ID:', item.userId, error);
              customerName = `User ID: ${item.userId}`;
            }
          }
          
          // Extract sample information directly from test request data
          let sampleId = null;
          let sampleType = null;
          let subsampleType = null;
          let sampleInfo = null;
          
          if (item.sample) {
            // Direct sample object from API response
            sampleId = item.sample.sampleId || item.sample.id;
            sampleType = item.sample.sampleType;
            sampleInfo = item.sample;
            console.log('Found sample from item.sample:', { sampleId, sampleType });
          } else if (item.samples && Array.isArray(item.samples) && item.samples.length > 0) {
            // Multiple samples array
            const firstSample = item.samples[0];
            sampleId = firstSample.sampleId || firstSample.id;
            sampleType = firstSample.sampleType;
            sampleInfo = firstSample;
            console.log('Found sample from item.samples array:', { sampleId, sampleType });
          } else {
            console.log('No sample information found in test request data');
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
            sampleInfo: sampleInfo
          } as TestResult;
        } catch (error) {
          console.error(`Error processing item ${index}:`, error);
          return null;
        }
      }));
      
      // Filter out null results
      const validResults = mapped.filter(result => result !== null);
      console.log(`Successfully processed ${validResults.length} out of ${data.length} items`);
      setTestResults(validResults);
      
      // Auto-refresh sample info after setting test results
      setTimeout(() => {
        refreshAllSampleInfo();
      }, 1000);
      
      // Auto-refresh sample info after setting test results
      setTimeout(() => {
        refreshAllSampleInfo();
      }, 1000);
    } catch (err: any) {
      console.error('Error fetching test requests:', err);
      setError('Không thể tải dữ liệu lịch hẹn. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          console.log('Using sample ID from test result data:', sampleId);
        } else if (currentResult.sampleInfo && currentResult.sampleInfo.id) {
          sampleId = currentResult.sampleInfo.id;
          console.log('Using sample ID from sample info:', sampleId);
        } else if (currentResult.requestData && currentResult.requestData.sample && currentResult.requestData.sample.id) {
          sampleId = currentResult.requestData.sample.id;
          console.log('Using sample ID from request data sample:', sampleId);
        } else if (currentResult.requestData && currentResult.requestData.samples && currentResult.requestData.samples.length > 0) {
          sampleId = currentResult.requestData.samples[0].id || currentResult.requestData.samples[0].sampleId;
          console.log('Using sample ID from request data samples array:', sampleId);
        }
        
        if (!sampleId) {
          throw new Error(`Không tìm thấy mẫu xét nghiệm cho yêu cầu này. Vui lòng tạo mẫu xét nghiệm trước trong phần "Quản lý mẫu".`);
        }
        
        console.log('Found sample ID:', sampleId);
      } catch (err) {
        console.error('Lỗi khi lấy sample ID:', err);
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
        console.log('Final sample validation successful:', finalSampleValidation);
        
        // Additional validation: Check if sample has valid status
        if (finalSampleValidation.status && !['Received', 'Collected', 'Tested'].includes(finalSampleValidation.status)) {
          console.warn('Sample has unexpected status:', finalSampleValidation.status);
        }
        
        // Log sample details for debugging
        console.log('Sample details for upload:', {
          sampleId: sampleId,
          sampleStatus: finalSampleValidation.status,
          sampleRequestId: finalSampleValidation.requestId || finalSampleValidation.request_id,
          sampleCollectedBy: finalSampleValidation.collectedBy || finalSampleValidation.collected_by,
          sampleType: finalSampleValidation.sampleType
        });
        
      } catch (validationError) {
        console.error('Final sample validation failed:', validationError);
        
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
              formData.append('SampleId', sampleId); // Try lowercase with underscore first
              formData.append('UploadedBy', currentStaffId.toString()); // Try lowercase with underscore
              formData.append('StaffId', currentStaffId.toString()); // Try lowercase with underscore
              formData.append('PdfFile', selectedFile);
      
      // Debug: Log FormData content
      console.log('=== FORMDATA DEBUG ===');
      console.log('SampleId:', sampleId);
      console.log('UploadedBy:', currentStaffId);
      console.log('StaffId:', currentStaffId);
      console.log('File name:', selectedFile.name);
      console.log('File size:', selectedFile.size);
      console.log('File type:', selectedFile.type);
      
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
        if (value instanceof File) {
          console.log(`${key} file info:`, {
            name: value.name,
            size: value.size,
            type: value.type
          });
        }
      }
      console.log('=== END FORMDATA DEBUG ===');
      
      // Gọi API upload với FormData instance
      let response;
      try {
        console.log('Calling testResultAPI.createWithPdf with sampleId:', sampleId);
        response = await testResultAPI.createWithPdf(formData);
        
        // Debug: Log response để kiểm tra
        console.log('=== API RESPONSE DEBUG ===');
        console.log('API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Response is null/undefined:', response === null || response === undefined);
        console.log('Response is empty object:', response && Object.keys(response).length === 0);
        console.log('Response keys:', response ? Object.keys(response) : 'No response');
        console.log('Response stringified:', JSON.stringify(response, null, 2));
        console.log('=== END DEBUG ===');
        
        // Validate response
        if (!response) {
          throw new Error('Không nhận được response từ server');
        }
        
      } catch (uploadError: any) {
        console.error('=== UPLOAD ERROR DEBUG ===');
        console.error('Upload error:', uploadError);
        console.error('Error message:', uploadError.message);
        console.error('Error response status:', uploadError.response?.status);
        console.error('Error response data:', uploadError.response?.data);
        console.error('Error response headers:', uploadError.response?.headers);
        console.error('=== END ERROR DEBUG ===');
        
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
            console.error('Foreign key constraint error detected:', errorMsg);
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
      
      // Hiển thị thông báo thành công
      alert(`✅ Upload thành công!\n\nFile: ${selectedFile.name}\nResult ID: ${response?.resultId || response?.id || 'N/A'}\nSample ID: ${response?.sampleId || sampleId}\nStaff ID: ${response?.staffId || currentStaffId}`);
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      
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

  const refreshTestResultDetails = async (testId: string) => {
    setLoadingDetails(testId);
    try {
      const result = testResults.find(r => r.id === testId);
      if (!result || !result.requestData) return;

      const item = result.requestData;
      let serviceName = result.testName || result.serviceName;
      let customerName = result.customerName || result.userFullName;
      let serviceDetails = result.relatedTestRequest?.serviceDetails;
      let userDetails = result.relatedTestRequest?.userDetails;
      let sampleInfo = result.sampleInfo;
      let sampleType = result.sampleType;
      let sampleId = result.sampleId;

      // Try to fetch service details if still showing "Chưa rõ"
      if (serviceName === 'Chưa rõ' && item.serviceId) {
        try {
          serviceDetails = await getServiceDetails(item.serviceId);
          if (serviceDetails) {
            serviceName = serviceDetails.name || serviceDetails.serviceName || serviceDetails.title || `Service ID: ${item.serviceId}`;
          }
        } catch (error) {
          console.error('Failed to fetch service details:', error);
        }
      }

      // Try to fetch user details if still showing "Chưa rõ"
      if (customerName === 'Chưa rõ' && item.userId) {
        try {
          userDetails = await getUserDetails(item.userId);
          if (userDetails) {
            customerName = userDetails.fullName || userDetails.name || userDetails.username || userDetails.email || `User ID: ${item.userId}`;
          }
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      }

      // Sample info should already be available from the test request data
      // No need to fetch separately

      // Update the test result with new details
      setTestResults(prev =>
        prev.map(r =>
          r.id === testId
            ? {
                ...r,
                testName: serviceName,
                customerName: customerName,
                serviceName: serviceName,
                userFullName: customerName,
                sampleType: sampleType,
                sampleId: sampleId,
                sampleInfo: sampleInfo,
                relatedTestRequest: {
                  ...r.relatedTestRequest,
                  serviceDetails,
                  userDetails
                }
              }
            : r
        )
      );
    } catch (error) {
      console.error('Failed to refresh test result details:', error);
    } finally {
      setLoadingDetails(null);
    }
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
                          <div className="text-xs bg-gray-50 p-2 rounded">
                            <p className="font-medium">Thông tin mẫu:</p>
                            {result.sampleId && <p>Sample ID: {result.sampleId}</p>}
                            {result.sampleType && <p>Loại mẫu: {result.sampleType}</p>}
                            {result.subsampleType && <p>Loại mẫu con: {result.subsampleType}</p>}
                            {result.sampleInfo && result.sampleInfo.status && (
                              <p>Trạng thái mẫu: {result.sampleInfo.status}</p>
                            )}
                            {result.sampleInfo && result.sampleInfo.collectionTime && (
                              <p>Thời gian lấy: {new Date(result.sampleInfo.collectionTime).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>
                        )}
                        
                        {/* Hiển thị cảnh báo nếu chưa có sample */}
                        {!result.sampleId && !result.sampleType && (
                          <div className="text-xs bg-yellow-50 border border-yellow-200 p-2 rounded">
                            <p className="font-medium text-yellow-800 flex items-center gap-1">
                              <TestTube className="w-3 h-3" />
                              ⚠️ Chưa có mẫu xét nghiệm
                            </p>
                            <p className="text-yellow-700 text-xs mt-1">
                              Cần tạo mẫu trước khi upload kết quả. Vui lòng tạo mẫu trong phần "Quản lý mẫu".
                            </p>
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
                        {getStatusBadge(result.status)}
                        <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>
                        {result.userId && (
                          <p className="text-xs text-gray-500">User ID: {result.userId}</p>
                        )}
                        {result.serviceId && (
                          <p className="text-xs text-gray-500">Service ID: {result.serviceId}</p>
                        )}
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
                      {/* Button refresh details if showing "Chưa rõ" */}
                      {(result.testName === 'Chưa rõ' || result.customerName === 'Chưa rõ' || 
                        result.serviceName === 'Chưa rõ' || result.userFullName === 'Chưa rõ' ||
                        !result.sampleType || !result.sampleId) && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => refreshTestResultDetails(result.id)}
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
                              Làm mới thông tin
                            </>
                          )}
                        </Button>
                      )}
                      
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