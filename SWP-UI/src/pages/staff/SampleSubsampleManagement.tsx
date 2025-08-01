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
  const [activeTab, setActiveTab] = useState('self');
  
  // Dialog states
  const [showCreateSampleDialog, setShowCreateSampleDialog] = useState(false);
  const [showCreateSubSampleDialog, setShowCreateSubSampleDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  
  // Form states
  const [sampleForm, setSampleForm] = useState({
    sampleType: '',
    fullName: ''
  });
  
  const [subSampleForm, setSubSampleForm] = useState({
    fullName: '',
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
    if (!sampleForm.sampleType.trim()) {
      alert('Vui lòng chọn loại mẫu');
      return;
    }
    
    if (!sampleForm.fullName.trim()) {
      alert('Vui lòng nhập tên mẫu');
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
        collectionTime: new Date().toISOString(),
        receivedTime: null,
        status: 'Waiting',
        relationship: '',
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
        sampleType: '',
        fullName: ''
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

     const handleUpdateStatus = async (requestId: number | undefined, newStatus: "Pending" | "On-going" | "Arrived" | "Collected" | "Testing" | "Completed") => {
     if (!requestId) return;
     
     try {
       // Cập nhật trạng thái yêu cầu xét nghiệm
       await testRequestAPI.updateStatus(requestId, newStatus);
       
       // Refresh data
       await fetchData();
       
       alert('Cập nhật trạng thái thành công!');
     } catch (err: any) {
       let errorMessage = 'Lỗi cập nhật trạng thái';
       if (err.response?.data?.message) {
         errorMessage += `: ${err.response.data.message}`;
       } else if (err.message) {
         errorMessage += `: ${err.message}`;
       }
       alert(errorMessage);
     }
   };

   const handleCreateSubSample = async () => {
     if (!selectedSample) return;
     
     // Validation
     if (!subSampleForm.fullName.trim()) {
       alert('Vui lòng nhập tên mẫu con');
       return;
     }
     
     if (!subSampleForm.sampleType.trim()) {
       alert('Vui lòng chọn loại mẫu');
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
        description: `Mẫu con của ${subSampleForm.fullName.trim()}`,
        createdAt: new Date().toISOString(),
        fullName: subSampleForm.fullName.trim(),
        dateOfBirth: undefined,
        sampleType: subSampleForm.sampleType || undefined
      };
      
      await subSampleAPI.create(subSampleData);
      
      // Refresh data
      await fetchData();
      
      // Close dialog and reset form
      setShowCreateSubSampleDialog(false);
      setSubSampleForm({ 
        fullName: '',
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
    
    // Filter by collection type based on active tab
    let matchesCollectionType = true;
    if (activeTab === 'self') {
      matchesCollectionType = request.collectionType?.toLowerCase() === 'self';
    } else if (activeTab === 'at-home') {
      matchesCollectionType = request.collectionType?.toLowerCase() === 'at home';
    } else if (activeTab === 'at-clinic') {
      matchesCollectionType = request.collectionType?.toLowerCase() === 'at clinic';
    }
    
    return matchesSearch && matchesStatus && matchesCollectionType;
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
        return 'Thu mẫu tại nhà';
      case 'self':
        return 'Tự thu mẫu';
      default:
        return type || 'Không xác định';
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
               <TabsTrigger value="self" className="flex items-center gap-2">
                 <User className="w-4 h-4" />
                 Tự thu mẫu
               </TabsTrigger>
               <TabsTrigger value="at-home" className="flex items-center gap-2">
                 <Package className="w-4 h-4" />
                 Thu mẫu tại nhà
               </TabsTrigger>
               <TabsTrigger value="at-clinic" className="flex items-center gap-2">
                 <TestTube className="w-4 h-4" />
                 Tại cơ sở
               </TabsTrigger>
             </TabsList>

                         <TabsContent value="self" className="mt-6">
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
                           {/* Không có thao tác cho tự thu mẫu */}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </div>
               {filteredRequests.length === 0 && (
                 <div className="text-center py-8 text-gray-500">
                   Không có yêu cầu xét nghiệm tự thu mẫu nào
                 </div>
               )}
             </TabsContent>

                                         <TabsContent value="at-home" className="mt-6">
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
                            {request.sample ? (
                              <div className="text-sm">
                                <div className="font-medium">Loại mẫu: {request.sample.sampleType || 'Chưa xác định'}</div>
                                <div className="text-gray-500">Tên mẫu: {request.sample.fullName || 'Chưa xác định'}</div>
                                {request.status === 'Testing' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleUpdateStatus(request.requestId, 'Completed')}
                                  >
                                    Hoàn thành xét nghiệm
                                  </Button>
                                )}
                              </div>
                            ) : (
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
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Không có yêu cầu xét nghiệm thu mẫu tại nhà nào
                  </div>
                )}
              </TabsContent>

                                                       <TabsContent value="at-clinic" className="mt-6">
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
                            {request.sample ? (
                              <div className="text-sm">
                                <div className="font-medium">Loại mẫu: {request.sample.sampleType || 'Chưa xác định'}</div>
                                <div className="text-gray-500">Tên mẫu: {request.sample.fullName || 'Chưa xác định'}</div>
                                {request.status === 'Testing' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleUpdateStatus(request.requestId, 'Completed')}
                                  >
                                    Hoàn thành xét nghiệm
                                  </Button>
                                )}
                              </div>
                            ) : (
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
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Không có yêu cầu xét nghiệm tại cơ sở nào
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
              <label className="text-sm font-medium">Loại mẫu <span className="text-red-500">*</span></label>
              <Select 
                value={sampleForm.sampleType || ''} 
                onValueChange={(value) => setSampleForm({...sampleForm, sampleType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại mẫu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Máu">Máu</SelectItem>
                  <SelectItem value="Niêm mạc miệng">Niêm mạc miệng</SelectItem>
                  <SelectItem value="Tóc">Tóc</SelectItem>
                  <SelectItem value="Móng tay/móng chân">Móng tay/móng chân</SelectItem>
                  <SelectItem value="Cuống rốn">Cuống rốn</SelectItem>
                  <SelectItem value="Nước ối">Nước ối</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Tên mẫu <span className="text-red-500">*</span></label>
              <Input
                type="text"
                value={sampleForm.fullName}
                onChange={e => setSampleForm({ ...sampleForm, fullName: e.target.value })}
                placeholder="Nhập tên mẫu..."
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
              <label className="text-sm font-medium">Loại mẫu <span className="text-red-500">*</span></label>
              <Select 
                value={subSampleForm.sampleType || ''} 
                onValueChange={(value) => setSubSampleForm({...subSampleForm, sampleType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại mẫu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Máu">Máu</SelectItem>
                  <SelectItem value="Niêm mạc miệng">Niêm mạc miệng</SelectItem>
                  <SelectItem value="Tóc">Tóc</SelectItem>
                  <SelectItem value="Móng tay/móng chân">Móng tay/móng chân</SelectItem>
                  <SelectItem value="Cuống rốn">Cuống rốn</SelectItem>
                  <SelectItem value="Nước ối">Nước ối</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Tên mẫu con <span className="text-red-500">*</span></label>
              <Input
                type="text"
                value={subSampleForm.fullName}
                onChange={e => setSubSampleForm({ ...subSampleForm, fullName: e.target.value })}
                placeholder="Nhập tên mẫu con..."
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