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
  FlaskConical,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { testRequestAPI, sampleAPI, subSampleAPI, userAPI } from '@/api/axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const [testRequests, setTestRequests] = useState<TestRequest[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [subSamples, setSubSamples] = useState<SubSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('at-home');
  
  // Dialog states
  const [showCreateSampleDialog, setShowCreateSampleDialog] = useState(false);
  const [showSampleDetailsDialog, setShowSampleDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  
  // Form states
  const [sampleForm, setSampleForm] = useState({
    sampleType: '',
    fullName: '',
    dateOfBirth: '',
    notes: ''
  });
  
  const [subSampleForm, setSubSampleForm] = useState({
    fullName: '',
    dateOfBirth: '',
    sampleType: ''
  });

  // New state for form flow
  const [isCreatingSubSample, setIsCreatingSubSample] = useState(false);
  const [createdSampleId, setCreatedSampleId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample type options
  const sampleTypes = [
    { value: "Máu", label: "Máu" },
    { value: "Niêm mạc miệng", label: "Niêm mạc miệng" },
    { value: "Tóc", label: "Tóc" },
    { value: "Móng tay/móng chân", label: "Móng tay/móng chân" },
    { value: "Cuống rốn", label: "Cuống rốn" },
    { value: "Nước ối", label: "Nước ối" },
  ];

 

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
        const samplesData = await sampleAPI.getAll();
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

  const validateMainSample = () => {
    if (!sampleForm.sampleType.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại mẫu",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const validateSubSample = () => {
    if (!subSampleForm.sampleType.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại mẫu con",
        variant: "destructive",
      });
      return false;
    }
    if (!subSampleForm.fullName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mẫu con",
        variant: "destructive",
      });
      return false;
    }
    if (!subSampleForm.dateOfBirth) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ngày sinh mẫu con",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate date of birth
    const birthDate = new Date(subSampleForm.dateOfBirth);
    const today = new Date();
    if (birthDate > today) {
      toast({
        title: "Lỗi",
        description: "Ngày sinh không thể là ngày trong tương lai",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleCreateSample = async () => {
    if (!selectedRequest) return;
    
    if (!validateMainSample()) {
      return;
    }
    
    // Validate staffId
    if (!staffId || typeof staffId !== 'number') {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.",
        variant: "destructive",
      });
      return;
    }
    
    // Get requestId from the selected request - API returns requestId directly
    const requestId = selectedRequest.requestId;
    
    // Validate requestId exists and is valid
    if (!requestId || requestId <= 0) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID yêu cầu xét nghiệm hợp lệ. Vui lòng chọn lại yêu cầu.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Show progress toast
      toast({
        title: "Đang xử lý...",
        description: "Đang tạo mẫu chính...",
      });

      // Prepare sample data according to API specification
      const sampleData = {
        requestId: requestId,
        collectedBy: staffId,
        collectionTime: new Date().toISOString(),
        receivedTime: new Date().toISOString(), // Set to current time by default
        status: 'Waiting',
        relationship: 'Self', // Default to Self since we removed the field
        sampleType: sampleForm.sampleType || ''
      };
      
      console.log('Creating sample with data:', sampleData);
      console.log('Staff ID being used:', staffId);
      
      // Call the API using sampleAPI.create
      const response = await sampleAPI.create(sampleData);
      console.log('Sample creation response:', response);
      
      // Show progress toast for getting sample info
      toast({
        title: "Đang xử lý...",
        description: "Đang lấy thông tin mẫu...",
      });
      
      // Add delay to ensure server has saved the sample
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all samples to find the newly created one
      const allSamples = await sampleAPI.getAll();
      console.log('All samples:', allSamples);
      
      // Find the newly created sample based on requestId and other criteria
      const createdSample = allSamples.find((sample: any) => {
        const matchesRequestId = sample.requestId === requestId;
        const matchesSampleType = sample.sampleType === sampleForm.sampleType;
        const matchesCollectedBy = sample.collectedBy === staffId;
        
        console.log(`Sample ${sample.sampleId}:`, {
          requestId: sample.requestId,
          sampleType: sample.sampleType,
          collectedBy: sample.collectedBy,
          matches: { matchesRequestId, matchesSampleType, matchesCollectedBy }
        });
        
        return matchesRequestId && matchesSampleType && matchesCollectedBy;
      });
      
      console.log('Found created sample:', createdSample);
      
      if (createdSample && createdSample.sampleId) {
        const sampleId = createdSample.sampleId;
        setCreatedSampleId(sampleId);
        console.log('Successfully extracted sampleId:', sampleId);
        
        toast({
          title: "Thành công",
          description: `Đã tạo mẫu chính thành công (ID: ${sampleId})`,
        });
      } else {
        console.error('Could not find created sample in the list');
        console.log('Available samples for this requestId:', 
          allSamples.filter((s: any) => s.requestId === requestId)
        );
        // Fallback: use requestId as temporary sampleId
        setCreatedSampleId(requestId);
        console.warn('Using requestId as fallback sampleId:', requestId);
        
        toast({
          title: "Thành công",
          description: "Đã tạo mẫu chính thành công",
        });
      }
      
      // Refresh data
      await fetchData();
      
      // Transition to subsample creation
      setIsCreatingSubSample(true);
      
    } catch (err: any) {
      console.error('Error creating sample:', err);
      
      let errorMessage = "Có lỗi xảy ra khi tạo mẫu chính";
      
      if (err.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (err.response?.status === 404) {
        errorMessage = "Không tìm thấy thông tin đặt dịch vụ.";
      } else if (err.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      } else if (err.response?.data?.message) {
        errorMessage += `: ${err.response.data.message}`;
      } else if (err.response?.data?.errors) {
        // Handle validation errors from ASP.NET Core
        const errors = err.response.data.errors;
        const errorDetails = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`).join('; ');
        errorMessage += `: ${errorDetails}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

 

  const handleFinishSampleCreation = () => {
    // Close dialog and reset all forms
    setShowCreateSampleDialog(false);
    setSampleForm({
      sampleType: '',
      fullName: '',
      dateOfBirth: '',
      notes: ''
    });
    setSubSampleForm({
      fullName: '',
      dateOfBirth: '',
      sampleType: ''
    });
    setIsCreatingSubSample(false);
    setCreatedSampleId(null);
    setSelectedRequest(null);
  };

  const handleCreateSubSample = async () => {
    // Use createdSampleId if available, otherwise use selectedSample
    let sampleId: number;
    
    if (createdSampleId) {
      sampleId = createdSampleId;
    } else if (selectedSample) {
      // Handle different possible property names for sample ID (prioritize sampleId for backend)
      if (selectedSample.sampleId) {
        sampleId = selectedSample.sampleId;
      } else if (selectedSample.id) {
        sampleId = selectedSample.id;
      } else if (selectedSample.sample_id) {
        sampleId = selectedSample.sample_id;
      } else {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy ID của mẫu gốc",
          variant: "destructive",
        });
        return;
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mẫu gốc",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateSubSample()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Show progress toast
      toast({
        title: "Đang xử lý...",
        description: "Đang tạo mẫu con...",
      });

      // Verify the sample exists by fetching it first
      try {
        await sampleAPI.getById(sampleId);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Mẫu gốc không tồn tại trong hệ thống. Vui lòng làm mới trang và thử lại.",
          variant: "destructive",
        });
        return;
      }
      
      const subSampleData = {
        sampleId: sampleId, // Ensure this is sampleId, not sample_id
        description: [
          `Tên: ${subSampleForm.fullName.trim()}`,
          `Ngày sinh: ${subSampleForm.dateOfBirth}`
        ].filter(Boolean).join(' | '),
        createdAt: new Date().toISOString(),
        fullName: subSampleForm.fullName.trim(),
        dateOfBirth: subSampleForm.dateOfBirth,
        sampleType: subSampleForm.sampleType || ''
      };
      
      await subSampleAPI.create(subSampleData);
      
      // Refresh data
      await fetchData();
      
      toast({
        title: "Thành công",
        description: "Đã tạo mẫu con thành công!",
      });
      
      // Close dialog and reset form
      setSubSampleForm({ 
        fullName: '',
        dateOfBirth: '',
        sampleType: ''
      });
      setSelectedSample(null);
      setIsCreatingSubSample(false);
      setCreatedSampleId(null);
      
    } catch (err: any) {
      console.error('Error creating subsample:', err);
      
      let errorMessage = "Có lỗi xảy ra khi tạo mẫu con";
      
      if (err.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (err.response?.status === 404) {
        errorMessage = "Không tìm thấy thông tin mẫu gốc.";
      } else if (err.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      } else if (err.response?.data?.message) {
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
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Function to populate sample form with user info from test request
  const populateSampleFormFromRequest = (request: TestRequest) => {
    // Try to get user info from the request
    const userInfo = request.user || {};
    
    setSampleForm({
      sampleType: '',
      fullName: request.userFullName || userInfo.fullName || '',
      dateOfBirth: userInfo.dateOfBirth || userInfo.dateOfBirth || '',
      notes: ''
    });
  };

  const handleUpdateStatus = async (requestId: number | undefined, newStatus: "Pending" | "Arrived" | "Collected" | "Testing" | "Completed") => {
    if (!requestId) return;
    
    try {
      // Cập nhật trạng thái yêu cầu xét nghiệm
      await testRequestAPI.updateStatus(requestId, newStatus);
      
      // Refresh data
      await fetchData();
      
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái thành công!",
      });
    } catch (err: any) {
      let errorMessage = 'Lỗi cập nhật trạng thái';
      if (err.response?.data?.message) {
        errorMessage += `: ${err.response.data.message}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleViewSampleDetails = (request: TestRequest) => {
    setSelectedRequest(request);
    setShowSampleDetailsDialog(true);
  };

  const filteredRequests = testRequests.filter(request => {
    const matchesSearch = 
      request.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.requestId ? request.requestId.toString() : "").includes(searchTerm) ||
      request.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    // Filter by collection type based on active tab
    let matchesCollectionType = true;
    if (activeTab === 'at-home') {
      matchesCollectionType = request.collectionType?.toLowerCase() === 'at home';
    } else if (activeTab === 'at-clinic') {
      matchesCollectionType = request.collectionType?.toLowerCase() === 'at clinic';
    } else if (activeTab === 'self-collection') {
      matchesCollectionType = request.collectionType?.toLowerCase() === 'self';
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
                  <SelectItem value="On-going">Đang tới</SelectItem>
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
               <TabsTrigger value="at-home" className="flex items-center gap-2">
                 <Package className="w-4 h-4" />
                 Thu mẫu tại nhà
               </TabsTrigger>
               <TabsTrigger value="at-clinic" className="flex items-center gap-2">
                 <TestTube className="w-4 h-4" />
                 Tại cơ sở
               </TabsTrigger>
               <TabsTrigger value="self-collection" className="flex items-center gap-2">
                 <UserCheck className="w-4 h-4" />
                 Thu mẫu tự nhận
               </TabsTrigger>
             </TabsList>



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
                                  populateSampleFormFromRequest(request);
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
                                  populateSampleFormFromRequest(request);
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

              <TabsContent value="self-collection" className="mt-6">
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
                              onClick={() => handleViewSampleDetails(request)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Không có yêu cầu xét nghiệm thu mẫu tự nhận nào
                  </div>
                )}
              </TabsContent>

            
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Sample Dialog */}
      <Dialog open={showCreateSampleDialog} onOpenChange={setShowCreateSampleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCreatingSubSample ? (
                <>
                  <TestTube className="w-5 h-5" />
                  Tạo mẫu con
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Tạo mẫu xét nghiệm
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isCreatingSubSample 
                ? `Tạo mẫu con cho mẫu SP${createdSampleId}`
                : `Tạo mẫu cho yêu cầu xét nghiệm YC${selectedRequest?.requestId}`
              }
            </DialogDescription>
          </DialogHeader>
          
          {!isCreatingSubSample ? (
            // Sample creation form
            <div className="space-y-6">
              {/* Display user info from test request */}
              {selectedRequest && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Thông tin khách hàng từ yêu cầu xét nghiệm</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Họ và tên:</span>
                      <span className="ml-2 text-blue-700">{selectedRequest.userFullName || 'Chưa có thông tin'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Dịch vụ:</span>
                      <span className="ml-2 text-blue-700">{selectedRequest.serviceName || 'Chưa có thông tin'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Loại mẫu <span className="text-red-500">*</span></label>
                  <Select 
                    value={sampleForm.sampleType} 
                    onValueChange={(value) => setSampleForm({...sampleForm, sampleType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại mẫu" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Ghi chú</label>
                <Textarea
                  value={sampleForm.notes}
                  onChange={e => setSampleForm({ ...sampleForm, notes: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            // SubSample creation form
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Loại mẫu con <span className="text-red-500">*</span></label>
                  <Select 
                    value={subSampleForm.sampleType} 
                    onValueChange={(value) => setSubSampleForm({...subSampleForm, sampleType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại mẫu con" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Họ và tên <span className="text-red-500">*</span></label>
                  <Input
                    value={subSampleForm.fullName}
                    onChange={e => setSubSampleForm({ ...subSampleForm, fullName: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Ngày sinh <span className="text-red-500">*</span></label>
                  <Input
                    type="date"
                    value={subSampleForm.dateOfBirth}
                    onChange={e => setSubSampleForm({ ...subSampleForm, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            {!isCreatingSubSample ? (
              <>
                <Button 
                  onClick={handleCreateSample}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Đang xử lý..." : "Tạo mẫu"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateSampleDialog(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleCreateSubSample}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Đang xử lý..." : "Tạo mẫu con"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleFinishSampleCreation}
                  disabled={isSubmitting}
                >
                  Hoàn thành
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sample Details Dialog */}
      <Dialog open={showSampleDetailsDialog} onOpenChange={setShowSampleDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Chi tiết mẫu và mẫu con
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về mẫu và mẫu con cho yêu cầu xét nghiệm YC{selectedRequest?.requestId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Test Request Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Thông tin yêu cầu xét nghiệm</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Mã yêu cầu:</span>
                    <span className="ml-2 text-blue-700">YC{selectedRequest.requestId}</span>
                  </div>
                  <div>
                    <span className="font-medium">Loại thu mẫu:</span>
                    <span className="ml-2 text-blue-700">{getCollectionTypeVN(selectedRequest.collectionType)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Ngày hẹn:</span>
                    <span className="ml-2 text-blue-700">{selectedRequest.appointmentDate}</span>
                  </div>
                  <div>
                    <span className="font-medium">Giờ hẹn:</span>
                    <span className="ml-2 text-blue-700">{selectedRequest.slotTime}</span>
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span>
                    <span className="ml-2">{getStatusBadge(selectedRequest.status)}</span>
                  </div>
                </div>
              </div>

              {/* Sample Information */}
              {selectedRequest.sample && selectedRequest.sample.sampleId ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <TestTube className="w-4 h-4" />
                    Thông tin mẫu chính
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Khách hàng:</span>
                      <span className="ml-2 text-green-700">{selectedRequest.userFullName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Dịch vụ:</span>
                      <span className="ml-2 text-green-700">{selectedRequest.serviceName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Loại mẫu:</span>
                      <span className="ml-2 text-green-700">{selectedRequest.sample.sampleType || 'Chưa xác định'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Thời gian nhận mẫu:</span>
                      <span className="ml-2 text-green-700">
                        {selectedRequest.sample.receivedTime ? 
                          new Date(selectedRequest.sample.receivedTime).toLocaleString('vi-VN') : 
                          'Chưa có thông tin'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Chưa có mẫu
                  </h4>
                  <p className="text-sm text-yellow-700">Chưa có thông tin mẫu cho yêu cầu xét nghiệm này.</p>
                </div>
              )}

              {/* SubSamples Information */}
              {selectedRequest.subSamples && selectedRequest.subSamples.length > 0 ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    Thông tin mẫu con ({selectedRequest.subSamples.length} mẫu)
                  </h4>
                  <div className="space-y-3">
                    {selectedRequest.subSamples.map((subSample, index) => (
                      <div key={index} className="bg-white border border-purple-100 rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium">Tên:</span>
                            <span className="ml-2 text-purple-700">{subSample.fullName || 'Chưa xác định'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Ngày sinh:</span>
                            <span className="ml-2 text-purple-700">{subSample.dateOfBirth || 'Chưa xác định'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Loại mẫu:</span>
                            <span className="ml-2 text-purple-700">{subSample.sampleType || 'Chưa xác định'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Ngày tạo:</span>
                            <span className="ml-2 text-purple-700">
                              {subSample.createdAt ? 
                                new Date(subSample.createdAt).toLocaleString('vi-VN') : 
                                'Chưa có thông tin'
                              }
                            </span>
                          </div>
                          {subSample.description && (
                            <div className="col-span-2">
                              <span className="font-medium">Mô tả:</span>
                              <span className="ml-2 text-purple-700">{subSample.description}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Mẫu con
                  </h4>
                  <p className="text-sm text-gray-700">Chưa có mẫu con cho yêu cầu xét nghiệm này.</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSampleDetailsDialog(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}