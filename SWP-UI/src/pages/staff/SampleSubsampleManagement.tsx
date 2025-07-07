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

interface TestRequest {
  requestId: number;
  userId: number;
  serviceId: number;
  collectionType: string;
  status: string;
  appointmentDate: string;
  slotTime: string;
  createdAt: string;
  staffId: number | null;
  addressId: number | null;
  feedbacks: any[];
  payments: any[];
  samples: any[];
  service: {
    serviceId: number;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    testKit: any;
  } | null;
  address: {
    addressId: number;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  } | null;
  user: {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    role: string;
  } | null;
}

interface Sample {
  id: number;
  sample_id: number;
  request_id: number;
  collected_by: number;
  collection_time: string;
  received_time: string;
  status: string;
  customer_name?: string;
  service_name?: string;
}

interface SubSample {
  id: number;
  sample_id: number;
  description: string;
  created_at: string;
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
    status: 'Waiting' as const
  });
  
  const [subSampleForm, setSubSampleForm] = useState({
    description: ''
  });

  const [users, setUsers] = useState<any[]>([]);

  // Get staff ID from localStorage (ưu tiên userId, sau đó id)
  let staffId: number | null = null;
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      staffId = parsed.userId || parsed.id || null;
    }
  } catch (e) {
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
      console.log('Fetching data for staff ID:', staffId);
      // Fetch users
      try {
        const userList = await userAPI.getAllUsers();
        setUsers(Array.isArray(userList) ? userList : []);
      } catch (err) {
        setUsers([]);
      }
      if (!staffId) {
        setTestRequests([]);
        setSamples([]);
        setSubSamples([]);
        setLoading(false);
        return;
      }
      // Sử dụng API lấy yêu cầu theo staffId
      const staffRequests = await testRequestAPI.getByStaffId(staffId);
      console.log('Test requests for staff:', staffRequests);
      setTestRequests(Array.isArray(staffRequests) ? staffRequests : []);
      
      // Fetch all samples
      try {
        const samplesData = await sampleAPI.getAll();
        console.log('Samples data:', samplesData);
        setSamples(Array.isArray(samplesData) ? samplesData : []);
      } catch (err) {
        console.error('Error fetching samples:', err);
        setSamples([]);
      }
      
      // Fetch all subsamples
      try {
        const subSamplesData = await subSampleAPI.getAll();
        console.log('SubSamples data:', subSamplesData);
        setSubSamples(Array.isArray(subSamplesData) ? subSamplesData : []);
      } catch (err) {
        console.error('Error fetching subsamples:', err);
        setSubSamples([]);
      }
      
    } catch (err: any) {
      console.error('Error fetching data:', err);
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
    
    try {
      const sampleData = {
        requestId: selectedRequest.requestId,
        collectedBy: staffId,
        collectionTime: sampleForm.collection_time ? new Date(sampleForm.collection_time).toISOString() : new Date().toISOString(),
        receivedTime: sampleForm.received_time ? new Date(sampleForm.received_time).toISOString() : undefined,
        status: sampleForm.status
      };
      
      console.log('Creating sample with data:', sampleData);
      
      await sampleAPI.create(sampleData);
      
      // Update test request status to 'Collected'
      await testRequestAPI.updateStatus(selectedRequest.requestId, 'Collected');
      
      // Refresh data
      await fetchData();
      
      // Close dialog and reset form
      setShowCreateSampleDialog(false);
      setSampleForm({
        collection_time: '',
        received_time: '',
        status: 'Waiting'
      });
      setSelectedRequest(null);
      
      alert('Tạo mẫu thành công!');
    } catch (err: any) {
      console.error('Error creating sample:', err);
      alert(`Lỗi tạo mẫu: ${err.message}`);
    }
  };

  const handleCreateSubSample = async () => {
    if (!selectedSample) return;
    
    try {
      const subSampleData = {
        sample_id: selectedSample.sample_id,
        description: subSampleForm.description
      };
      
      await subSampleAPI.create(subSampleData);
      
      // Refresh data
      await fetchData();
      
      // Close dialog and reset form
      setShowCreateSubSampleDialog(false);
      setSubSampleForm({
        description: ''
      });
      setSelectedSample(null);
      
      alert('Tạo mẫu con thành công!');
    } catch (err: any) {
      console.error('Error creating subsample:', err);
      alert(`Lỗi tạo mẫu con: ${err.message}`);
    }
  };

  const filteredRequests = testRequests.filter(request => {
    const matchesSearch = 
      request.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.requestId ? request.requestId.toString() : "").includes(searchTerm) ||
      request.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = 
      sample.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sample.sample_id ? sample.sample_id.toString() : "").includes(searchTerm) ||
      sample.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sample.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  // Helper để lấy tên khách hàng từ userId
  const getUserName = (userId: number) => {
    const user = users.find(u => u.userId === userId || u.id === userId);
    return user?.fullName || user?.username || `User ${userId}`;
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

          {/* Test Requests Tab */}
          {activeTab === 'requests' && (
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
                  {filteredRequests.map((request) => (
                    <TableRow key={request.requestId}>
                      <TableCell className="font-medium">YC{request.requestId}</TableCell>
                      <TableCell>{getUserName(request.userId)}</TableCell>
                      <TableCell>{request.service?.name || 'Chưa xác định'}</TableCell>
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
          )}

          {/* Samples Tab */}
          {activeTab === 'samples' && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã mẫu</TableHead>
                    <TableHead>Mã yêu cầu</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày thu</TableHead>
                    <TableHead>Ngày nhận</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSamples.map((sample) => (
                    <TableRow key={sample.sample_id}>
                      <TableCell className="font-medium">SP{sample.sample_id}</TableCell>
                      <TableCell>YC{sample.request_id}</TableCell>
                      <TableCell>{sample.customer_name || 'Chưa có tên'}</TableCell>
                      <TableCell>{sample.collection_time ? new Date(sample.collection_time).toLocaleDateString('vi-VN') : 'Chưa thu'}</TableCell>
                      <TableCell>{sample.received_time ? new Date(sample.received_time).toLocaleDateString('vi-VN') : 'Chưa nhận'}</TableCell>
                      <TableCell>{getStatusBadge(sample.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSample(sample);
                            setShowCreateSubSampleDialog(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Tạo mẫu con
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* SubSamples Tab */}
          {activeTab === 'subsamples' && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mã mẫu gốc</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subSamples.map((subSample) => (
                    <TableRow key={subSample.id}>
                      <TableCell className="font-medium">{subSample.id}</TableCell>
                      <TableCell>SP{subSample.sample_id}</TableCell>
                      <TableCell>{subSample.description}</TableCell>
                      <TableCell>{new Date(subSample.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Empty states */}
          {activeTab === 'requests' && filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có yêu cầu xét nghiệm nào được phân công cho bạn
            </div>
          )}
          {activeTab === 'samples' && filteredSamples.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có mẫu xét nghiệm nào
            </div>
          )}
          {activeTab === 'subsamples' && subSamples.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có mẫu con nào
            </div>
          )}
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
              Tạo mẫu con cho mẫu SP{selectedSample?.sample_id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Mô tả mẫu con</label>
              <Textarea
                value={subSampleForm.description}
                onChange={(e) => setSubSampleForm({...subSampleForm, description: e.target.value})}
                placeholder="Nhập mô tả chi tiết cho mẫu con..."
                rows={3}
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