import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TestTube, 
  Plus, 
  Eye, 
  Search,
  User,
  Calendar,
  Clock,
  Package,
  FileText,
  FlaskConical
} from 'lucide-react';
import { testRequestAPI, sampleAPI, subSampleAPI, userAPI } from '@/api/axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TestRequest {
  requestId?: number;
  userId: number;
  serviceId: number;
  collectionType: string;
  status: string;
  appointmentDate: string;
  slotTime: string;
  createdAt?: string;
  staffId: number | null;
  addressId?: number | null;
  feedbacks?: any[];
  payments?: any[];
  samples?: any[];
  // Direct fields from API response
  userFullName: string;
  serviceName: string;
  sample?: any | null;
  subSamples?: any[] | null;
  // Legacy fields for backward compatibility
  id?: number;
  testRequestId?: number;
  user?: any | null;
  service?: any | null;
  address?: any | null;
}

interface Sample {
  sampleId: number; // Primary field - backend expects this
  testRequestId: number; // Changed from requestId to testRequestId to avoid conflict
  collectedBy: number;
  collectionTime: string;
  receivedTime: string | null;
  status: string;
  sampleType: string | null;
  relationship: string | null;
  collectedByNavigation: any | null;
  request: any | null;
  subSamples: any[];
  testResults: any[];
  // Direct fields from API response
  serviceName?: string; // Tên dịch vụ từ API
  userFullName?: string; // Tên đầy đủ của user từ API
  // Legacy properties for backward compatibility (these should not be used for API calls)
  id?: number;
  sample_id?: number; // Legacy field - DO NOT USE for API calls
  requestId?: number; // Keep for backward compatibility
  request_id?: number;
  collected_by?: number;
  collection_time?: string;
  received_time?: string;
  customer_name?: string;
  service_name?: string;
  _customerNameLookupAttempted?: boolean; // Added for debugging
}

interface SubSample {
  sampleId: number; // Primary field - backend expects this
  description: string;
  createdAt: string;
  fullName: string;
  dateOfBirth: string;
  sampleType: string;
  // Legacy fields for backward compatibility (these should not be used for API calls)
  id?: number;
  sample_id?: number; // Legacy field - DO NOT USE for API calls
  created_at?: string;
}

export default function SampleSubsampleManagement() {
  const [testRequests, setTestRequests] = useState<TestRequest[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [subSamples, setSubSamples] = useState<SubSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('requests');
  
  // Dialog states
  const [showCreateSampleDialog, setShowCreateSampleDialog] = useState(false);
  const [showCreateSubSampleDialog, setShowCreateSubSampleDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  
  // Form states
  const [sampleForm, setSampleForm] = useState({
    collection_time: '',
    received_time: '',
    status: 'Waiting' as const,
    relationship: '',
    sampleType: ''
  });
  
  const [subSampleForm, setSubSampleForm] = useState({
    description: '',
    createdAt: '',
    fullName: '',
    dateOfBirth: '',
    sampleType: ''
  });



  // Get staff ID from localStorage (ưu tiên userId, sau đó id)
  let staffId: number | null = null;
  try {
    const userData = localStorage.getItem('userData');
    console.log('Raw userData from localStorage:', userData);
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log('Parsed userData:', parsed);
      staffId = parsed.userId || parsed.id || null;
      console.log('Extracted staffId:', staffId);
    }
  } catch (e) {
    console.error('Error parsing userData:', e);
    staffId = null;
  }





  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!staffId) {
        setTestRequests([]);
        setSamples([]);
        setSubSamples([]);
        setLoading(false);
        return;
      }
      
      // Fetch test requests assigned to this staff - ONLY API call needed
      try {
        const staffRequests = await testRequestAPI.getByStaffId(staffId);
        
        if (Array.isArray(staffRequests)) {
          // Process test requests with direct fields from API
          const validRequests = staffRequests.map(request => {
            const processedRequest = {
              ...request,
              // API returns requestId directly, no need for fallbacks
              requestId: request.requestId,
              userId: request.userId,
              serviceId: request.serviceId,
              status: request.status || 'Pending',
              appointmentDate: request.appointmentDate || request.createdAt?.split('T')[0] || '',
              slotTime: request.slotTime || '',
              collectionType: request.collectionType || 'At Clinic',
              // Direct fields from API response
              userFullName: request.userFullName || 'Không có tên',
              serviceName: request.serviceName || 'Chưa xác định',
              staffId: request.staffId || staffId,
              sample: request.sample || null,
              subSamples: request.subSamples || null
            };
            
            return processedRequest;
          });
          
          setTestRequests(validRequests);
        } else {
          setTestRequests([]);
        }
      } catch (err) {
        setError('Không thể tải danh sách yêu cầu xét nghiệm');
        setTestRequests([]);
      }
      
      // Fetch samples by staff ID using client-side filtering
      try {
        console.log('Fetching samples for staff ID:', staffId);
        const samplesData = await sampleAPI.getByRequestIdOrCollectedBy(undefined, staffId);
        console.log('Raw samples data from API:', samplesData);
        
        // Validate samples data structure
        if (Array.isArray(samplesData)) {
          const validSamples = samplesData.filter(sample => {
            // Prioritize sampleId (backend field) over legacy fields
            const hasValidId = sample.sampleId || sample.id || sample.sample_id;
            return hasValidId;
          });
          
          console.log('Valid samples after filtering:', validSamples);
          console.log('Current staff ID:', staffId);
          console.log('Samples belonging to current staff:', validSamples);
          
          setSamples(validSamples);
        } else {
          console.log('Samples data is not an array:', samplesData);
          setSamples([]);
        }
      } catch (err) {
        console.error('Error fetching samples:', err);
        setSamples([]);
      }
      
      // Fetch all subsamples
      try {
        const subSamplesData = await subSampleAPI.getAll();
        setSubSamples(Array.isArray(subSamplesData) ? subSamplesData : []);
      } catch (err) {
        setSubSamples([]);
      }
      
    } catch (err: any) {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
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
      'Waiting': { className: 'bg-yellow-100 text-yellow-800', text: 'Chờ thu mẫu' },
      'Received': { className: 'bg-blue-100 text-blue-800', text: 'Đã nhận mẫu' },
      'Tested': { className: 'bg-green-100 text-green-800', text: 'Đã xét nghiệm' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { className: 'bg-gray-100 text-gray-800', text: status };
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const handleCreateSample = async () => {
    if (!selectedRequest) return;
    
    // Validation
    if (!sampleForm.collection_time && sampleForm.status !== 'Waiting') {
      alert('Vui lòng nhập thời gian thu mẫu hoặc chọn trạng thái "Chờ thu mẫu"');
      return;
    }
    
    // Validate staffId
    if (!staffId || typeof staffId !== 'number') {
      alert('Lỗi: Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
      return;
    }
    
    // Get requestId from the selected request - API returns requestId directly
    const requestId = selectedRequest.requestId;
    
    // Validate requestId exists and is valid
    if (!requestId || requestId <= 0) {
      alert('Lỗi: Không tìm thấy ID yêu cầu xét nghiệm hợp lệ. Vui lòng chọn lại yêu cầu.');
      return;
    }
    
    try {
      // Prepare sample data according to API specification
      const sampleData = {
        requestId: requestId,
        collectedBy: staffId,
        collectionTime: sampleForm.collection_time 
          ? new Date(sampleForm.collection_time).toISOString() 
          : new Date().toISOString(),
        receivedTime: sampleForm.received_time 
          ? new Date(sampleForm.received_time).toISOString() 
          : null,
        status: sampleForm.status,
        relationship: sampleForm.relationship || '',
        sampleType: sampleForm.sampleType || ''
      };
      
      console.log('Creating sample with data:', sampleData);
      console.log('Staff ID being used:', staffId);
      
      // Call the API using sampleAPI.create
      const response = await sampleAPI.create(sampleData);
      console.log('Sample creation response:', response);
      
      // Refresh data
      await fetchData();
      
      // Close dialog and reset form
      setShowCreateSampleDialog(false);
      setSampleForm({
        collection_time: '',
        received_time: '',
        status: 'Waiting',
        relationship: '',
        sampleType: ''
      });
      setSelectedRequest(null);
      
      alert('Tạo mẫu thành công!');
      
    } catch (err: any) {
      let errorMessage = 'Lỗi tạo mẫu';
      if (err.response?.data?.message) {
        errorMessage += `: ${err.response.data.message}`;
      } else if (err.response?.data?.errors) {
        // Handle validation errors from ASP.NET Core
        const errors = err.response.data.errors;
        const errorDetails = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`).join('; ');
        errorMessage += `: ${errorDetails}`;
      } else if (err.response?.status === 400) {
        errorMessage += ': Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else if (err.response?.status === 500) {
        errorMessage += ': Lỗi máy chủ. Vui lòng thử lại sau.';
      } else {
        errorMessage += `: ${err.message || 'Lỗi không xác định'}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleCreateSubSample = async () => {
    if (!selectedSample) return;
    
    // Validation
    if (!subSampleForm.description.trim()) {
      alert('Vui lòng nhập mô tả mẫu con');
      return;
    }
    
    try {
      // Verify that the sample exists and get the correct ID
      let sampleId: number;
      
      // Handle different possible property names for sample ID (prioritize sampleId for backend)
      if (selectedSample.sampleId) {
        sampleId = selectedSample.sampleId;
      } else if (selectedSample.id) {
        sampleId = selectedSample.id;
      } else if (selectedSample.sample_id) {
        sampleId = selectedSample.sample_id;
      } else {
        throw new Error('Không tìm thấy ID của mẫu gốc');
      }

      // Verify the sample exists by fetching it first
      try {
        await sampleAPI.getById(sampleId);
      } catch (error) {
        throw new Error('Mẫu gốc không tồn tại trong hệ thống. Vui lòng làm mới trang và thử lại.');
      }
      

      
      const subSampleData = {
        sampleId: sampleId, // Ensure this is sampleId, not sample_id
        description: subSampleForm.description.trim(),
        createdAt: subSampleForm.createdAt ? new Date(subSampleForm.createdAt).toISOString() : new Date().toISOString(),
        fullName: subSampleForm.fullName.trim() || undefined,
        dateOfBirth: subSampleForm.dateOfBirth || undefined,
        sampleType: subSampleForm.sampleType.trim() || undefined
      };
      
      await subSampleAPI.create(subSampleData);
      
      // Refresh data
      await fetchData();
      
      // Close dialog and reset form
      setShowCreateSubSampleDialog(false);
      setSubSampleForm({ 
        description: '', 
        createdAt: '', 
        fullName: '', 
        dateOfBirth: '', 
        sampleType: '' 
      });
      setSelectedSample(null);
      
      alert('Tạo mẫu con thành công!');
    } catch (err: any) {
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = 'Lỗi tạo mẫu con';
      if (err.response?.data?.message) {
        errorMessage += `: ${err.response.data.message}`;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        const errorDetails = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`).join('; ');
        errorMessage += `: ${errorDetails}`;
      } else if (err.response?.data) {
        errorMessage += `: ${JSON.stringify(err.response.data)}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const filteredRequests = testRequests.filter(request => {
    const matchesSearch = 
      request.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.requestId ? request.requestId.toString() : "").includes(searchTerm) ||
      request.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSamples = samples.filter(sample => {
    // Since we're already fetching samples by staff ID, no need to filter by staff again
    // Allow searching by multiple possible identifiers (prioritize sampleId for backend)
    const sampleId = sample.sampleId || sample.id || sample.sample_id || '';
    const customerName = sample.userFullName || sample.customer_name || '';
    const serviceName = sample.serviceName || sample.service_name || '';
    const requestId = sample.testRequestId || sample.requestId || sample.request_id || '';
    
    const matchesSearch = searchTerm === '' || 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sampleId.toString().includes(searchTerm) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestId.toString().includes(searchTerm) ||
      `SP${sampleId}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `YC${requestId}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sample.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to get display name for customer
  const getCustomerDisplayName = (sample: Sample) => {
    // 1. Check if sample has direct userFullName from API
    if (sample.userFullName) {
      return sample.userFullName;
    }
    
    // 2. Check if sample has direct customer_name (legacy)
    if (sample.customer_name) {
      return sample.customer_name;
    }
    
    // 3. Try to get name from request if available in testRequests
    const requestId = sample.testRequestId || sample.requestId || sample.request_id;
    if (requestId) {
      const request = testRequests.find(r => {
        const rId = r.requestId || r.id || r.testRequestId;
        return String(rId) === String(requestId);
      });
      
      if (request?.userFullName) {
        return request.userFullName;
      }
    }
    
    // 4. Try to get from embedded request object if available
    if (sample.request?.userFullName) {
      return sample.request.userFullName;
    }
    
    // 5. Fallback: show sample ID
    const sampleId = sample.sampleId || sample.id || sample.sample_id;
    return `Mẫu ${sampleId}`;
  };

  // Helper function to get service name
  const getServiceDisplayName = (sample: Sample) => {
    // 1. Check if sample has direct serviceName from API
    if (sample.serviceName) {
      return sample.serviceName;
    }
    
    // 2. Check if sample has direct service_name (legacy)
    if (sample.service_name) {
      return sample.service_name;
    }
    
    // 3. Try to get service from request if available in testRequests
    const requestId = sample.testRequestId || sample.requestId || sample.request_id;
    if (requestId) {
      const request = testRequests.find(r => r.requestId === requestId);
      if (request?.serviceName) {
        return request.serviceName;
      }
    }
    
    // 4. Try to get from embedded request object if available
    if (sample.request?.serviceName) {
      return sample.request.serviceName;
    }
    
    return 'Chưa xác định';
  };

  // Helper để chuyển đổi loại thu mẫu sang tiếng Việt
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

  // Helper function để kiểm tra xem sample đã có subsample chưa
  const hasSubSample = (sample: Sample) => {
    const sampleId = sample.sampleId || sample.id || sample.sample_id;
    if (!sampleId) return false;
    
    // Kiểm tra trong danh sách subsamples hiện tại
    return subSamples.some(subSample => {
      const subSampleId = subSample.sampleId || subSample.id || subSample.sample_id;
      return subSampleId === sampleId;
    });
  };



  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Quản lý mẫu và mẫu con
          </CardTitle>
          <div className="text-sm text-gray-600">
            Staff ID: {staffId} | Số yêu cầu: {testRequests.length} | Số mẫu: {samples.length} | Số mẫu con: {subSamples.length}
          </div>
        </CardHeader>
        <CardContent>
          
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm..."
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
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Pending">Chờ xử lý</SelectItem>
                  <SelectItem value="On-going">Đang xử lý</SelectItem>
                  <SelectItem value="Arrived">Đã đến</SelectItem>
                  <SelectItem value="Collected">Đã thu mẫu</SelectItem>
                  <SelectItem value="Testing">Đang xét nghiệm</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Yêu cầu xét nghiệm
              </TabsTrigger>
              <TabsTrigger value="samples" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Mẫu xét nghiệm
              </TabsTrigger>
              <TabsTrigger value="subsamples" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Mẫu con
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã yêu cầu</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Loại thu mẫu</TableHead>
                      <TableHead>Ngày hẹn</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request, index) => (
                      <TableRow key={request.requestId || `request-${index}`}>
                        <TableCell className="font-medium">YC{request.requestId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.userFullName}</div>
                            <div className="text-xs text-gray-500">
                              User ID: {request.userId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{request.serviceName}</TableCell>
                        <TableCell>{getCollectionTypeVN(request.collectionType)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{request.appointmentDate}</div>
                            <div className="text-gray-500">{request.slotTime}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowCreateSampleDialog(true);
                            }}
                            disabled={request.status === 'Completed' || request.status === 'Collected'}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Tạo mẫu
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không có yêu cầu xét nghiệm nào được phân công cho bạn
                </div>
              )}
            </TabsContent>

            <TabsContent value="samples" className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã mẫu</TableHead>
                      <TableHead>Mã yêu cầu</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Ngày thu</TableHead>
                      <TableHead>Ngày nhận</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSamples.map((sample, index) => {
                      const sampleId = sample.sampleId || sample.id || sample.sample_id;
                      const requestId = sample.testRequestId || sample.requestId || sample.request_id;
                      const collectionTime = sample.collectionTime || sample.collection_time;
                      const receivedTime = sample.receivedTime || sample.received_time;
                      
                      return (
                        <TableRow key={sampleId || `sample-${index}`}>
                          <TableCell className="font-medium">SP{sampleId}</TableCell>
                          <TableCell>YC{requestId}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{getCustomerDisplayName(sample)}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getServiceDisplayName(sample)}</TableCell>
                          <TableCell>{collectionTime ? new Date(collectionTime).toLocaleDateString('vi-VN') : 'Chưa thu'}</TableCell>
                          <TableCell>{receivedTime ? new Date(receivedTime).toLocaleDateString('vi-VN') : 'Chưa nhận'}</TableCell>
                          <TableCell>{getStatusBadge(sample.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSample(sample);
                                setShowCreateSubSampleDialog(true);
                              }}
                              disabled={!sampleId || hasSubSample(sample)}
                              className={hasSubSample(sample) ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {hasSubSample(sample) ? 'Đã tạo mẫu con' : 'Tạo mẫu con'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredSamples.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {samples.length === 0 ? 'Không có mẫu xét nghiệm nào' : 'Không tìm thấy mẫu phù hợp với bộ lọc'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="subsamples" className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã mẫu gốc</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Ngày sinh</TableHead>
                      <TableHead>Loại mẫu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subSamples.map((subSample, index) => (
                      <TableRow key={subSample.sampleId || subSample.id || subSample.sample_id || `subsample-${index}`}>
                        <TableCell>SP{subSample.sampleId || subSample.id || subSample.sample_id}</TableCell>
                        <TableCell>{subSample.description}</TableCell>
                        <TableCell>{new Date(subSample.createdAt || subSample.created_at).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{subSample.fullName}</TableCell>
                        <TableCell>{subSample.dateOfBirth}</TableCell>
                        <TableCell>{subSample.sampleType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {subSamples.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không có mẫu con nào
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Sample Dialog */}
      <Dialog open={showCreateSampleDialog} onOpenChange={setShowCreateSampleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo mẫu xét nghiệm</DialogTitle>
            <DialogDescription>
              Tạo mẫu cho yêu cầu xét nghiệm YC{selectedRequest?.requestId}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Thời gian thu mẫu</label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={sampleForm.collection_time}
                  onChange={(e) => setSampleForm({...sampleForm, collection_time: e.target.value})}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setSampleForm({...sampleForm, collection_time: localDateTime});
                  }}
                >
                  Hiện tại
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Để trống sẽ tự động sử dụng thời gian hiện tại</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Thời gian nhận mẫu (tùy chọn)</label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={sampleForm.received_time}
                  onChange={(e) => setSampleForm({...sampleForm, received_time: e.target.value})}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setSampleForm({...sampleForm, received_time: localDateTime});
                  }}
                >
                  Hiện tại
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Chỉ điền khi mẫu đã được nhận</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Trạng thái</label>
              <Select value={sampleForm.status} onValueChange={(value) => setSampleForm({...sampleForm, status: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Waiting">Chờ thu mẫu</SelectItem>
                  <SelectItem value="Received">Đã nhận mẫu</SelectItem>
                  <SelectItem value="Tested">Đã xét nghiệm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Mối quan hệ (relationship)</label>
              <Input
                type="text"
                value={sampleForm.relationship}
                onChange={e => setSampleForm({ ...sampleForm, relationship: e.target.value })}
                placeholder="Nhập mối quan hệ (nếu có)"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Loại mẫu (sampleType)</label>
              <Input
                type="text"
                value={sampleForm.sampleType}
                onChange={e => setSampleForm({ ...sampleForm, sampleType: e.target.value })}
                placeholder="Nhập loại mẫu (nếu có)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCreateSample}>Tạo mẫu</Button>
            <Button variant="outline" onClick={() => setShowCreateSampleDialog(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create SubSample Dialog */}
      <Dialog open={showCreateSubSampleDialog} onOpenChange={setShowCreateSubSampleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo mẫu con</DialogTitle>
            <DialogDescription>
              Tạo mẫu con cho mẫu SP{selectedSample?.sampleId || selectedSample?.id || selectedSample?.sample_id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Mô tả mẫu con <span className="text-red-500">*</span></label>
              <Textarea
                value={subSampleForm.description}
                onChange={e => setSubSampleForm({ ...subSampleForm, description: e.target.value })}
                placeholder="Nhập mô tả mẫu con... (bắt buộc)"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Thời gian tạo</label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={subSampleForm.createdAt}
                  onChange={e => setSubSampleForm({ ...subSampleForm, createdAt: e.target.value })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setSubSampleForm({...subSampleForm, createdAt: localDateTime});
                  }}
                >
                  Hiện tại
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Để trống sẽ tự động sử dụng thời gian hiện tại</p>
            </div>
            <div>
              <label className="text-sm font-medium">Họ tên (tùy chọn)</label>
              <Input
                type="text"
                value={subSampleForm.fullName}
                onChange={e => setSubSampleForm({ ...subSampleForm, fullName: e.target.value })}
                placeholder="Nhập họ tên (tùy chọn)"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ngày sinh (tùy chọn)</label>
              <Input
                type="date"
                value={subSampleForm.dateOfBirth}
                onChange={e => setSubSampleForm({ ...subSampleForm, dateOfBirth: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Loại mẫu (tùy chọn)</label>
              <Input
                type="text"
                value={subSampleForm.sampleType}
                onChange={e => setSubSampleForm({ ...subSampleForm, sampleType: e.target.value })}
                placeholder="Nhập loại mẫu (tùy chọn)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCreateSubSample}>Tạo mẫu con</Button>
            <Button variant="outline" onClick={() => setShowCreateSubSampleDialog(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 