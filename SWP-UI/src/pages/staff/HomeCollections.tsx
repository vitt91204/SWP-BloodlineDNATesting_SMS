import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Package,
  Users,
  Loader2,
  Calendar,
  Clipboard
} from 'lucide-react';
import { testRequestAPI, userAPI, addressAPI } from '@/api/axios';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Interface cho địa chỉ
interface Address {
  street: string;
  district: string;
  city: string;
  country: string;
  postalCode?: string;
  addressLine?: string;
  fullAddress?: string;
}

interface HomeCollection {
  id: string;
  userId: string | number;
  customerName: string;
  phone: string;
  address: string;
  fullAddress?: Address | null;
  date: string;
  timeSlot: string;
  status: string;
  testType: string;
  collectionType: 'At Home' | 'Self';
  requestId?: number;
}

export default function HomeCollections() {
  const { toast } = useToast();
  const [allCollections, setAllCollections] = useState<HomeCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('at-home');
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // Lấy staff ID từ localStorage
  const getStaffId = (): number | null => {
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

  useEffect(() => {
    const fetchHomeCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const staffId = getStaffId();
        if (!staffId) {
          setError('Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.');
          return;
        }

        // Lấy các yêu cầu được phân công cho nhân viên
        const staffRequests = await testRequestAPI.getByStaffId(staffId);
        
        // Lọc các yêu cầu lấy mẫu tại nhà và tự thu mẫu
        const homeRequests = (staffRequests || []).filter(
          (req) => req.collectionType?.toLowerCase() === 'at home' || req.collectionType?.toLowerCase() === 'self'
        );
        
        // Lấy thông tin chi tiết của tất cả users
        const allUsers = await userAPI.getAllUsers();
        
        // Xử lý thông tin cơ bản cho mỗi yêu cầu
        const collectionsWithBasicInfo = homeRequests.map((req) => {
          // Tìm thông tin user chi tiết
          const userInfo = allUsers.find(user => 
            user.userId?.toString() === req.userId?.toString() || 
            user.id?.toString() === req.userId?.toString()
          );
          
          return {
            id: req.requestId?.toString() || req.id?.toString(),
            requestId: req.requestId || req.id,
            userId: req.userId || userInfo?.userId || userInfo?.id,
            customerName: req.userFullName || userInfo?.fullName || userInfo?.username || 'Khách hàng',
            phone: req.userPhoneNumber || req.user?.phone || userInfo?.phone || 'Chưa có số điện thoại',
            address: req.address?.street || req.address?.addressLine || req.address?.address || 'Chưa có địa chỉ',
            date: req.appointmentDate,
            timeSlot: req.slotTime,
            status: req.status,
            testType: req.serviceName || req.service?.name || 'Chưa rõ loại xét nghiệm',
            collectionType: req.collectionType as 'At Home' | 'Self',
            fullAddress: null
          };
        });

        // Lấy địa chỉ chi tiết cho mỗi user
        const collectionsWithFullAddress = await Promise.all(
          collectionsWithBasicInfo.map(async (collection) => {
            if (collection.userId) {
              try {
                const addressData = await addressAPI.getByUserId(collection.userId);
                
                if (addressData && addressData.length > 0) {
                  // Lấy địa chỉ đầu tiên hoặc địa chỉ mặc định
                  const primaryAddress = addressData.find(addr => addr.isDefault) || addressData[0];
                  
                  // Tạo địa chỉ đầy đủ
                  const fullAddressText = [
                    primaryAddress.addressLine || primaryAddress.street,
                    primaryAddress.district,
                    primaryAddress.city,
                    primaryAddress.country,
                    primaryAddress.postalCode
                  ].filter(Boolean).join(', ');
                  
                  return {
                    ...collection,
                    fullAddress: primaryAddress,
                    address: fullAddressText || collection.address
                  };
                }
              } catch (addressError) {
                console.error(`Error fetching address for user ${collection.userId}:`, addressError);
              }
            }
            return collection;
          })
        );
        
        setAllCollections(collectionsWithFullAddress);
      } catch (err) {
        console.error('Error fetching home collections:', err);
        setError('Không thể tải dữ liệu lịch lấy mẫu tại nhà');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCollections();
  }, []);

  // Lọc dữ liệu theo tab hiện tại và sắp xếp theo requestId giảm dần
  const getFilteredCollections = () => {
    let filteredCollections;
    if (activeTab === 'at-home') {
      filteredCollections = allCollections.filter(collection => collection.collectionType === 'At Home');
    } else {
      filteredCollections = allCollections.filter(collection => collection.collectionType === 'Self');
    }
    
    // Sắp xếp theo requestId giảm dần (lớn nhất lên đầu)
    return filteredCollections.sort((a, b) => {
      const requestIdA = a.requestId || 0;
      const requestIdB = b.requestId || 0;
      return requestIdB - requestIdA;
    });
  };

  const translateStatus = (status: string): string => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "Chờ xác nhận";
      case "sending":
        return "Đang gửi bộ kit";
      case "returning":
        return "Đang gửi về";
      case "collected":
        return "Đã nhận mẫu";
      case "arrived":
        return "Đã nhận được";
      case "on-going":
        return "Đang tới";
      case "testing":
        return "Đang xét nghiệm";
      case "completed":
        return "Hoàn thành";
      default:
        return status || "Không xác định";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>;
      case 'arrived':
        return <Badge className="bg-blue-100 text-blue-800">Đã nhận được</Badge>;
      case 'on-going':
        return <Badge className="bg-orange-100 text-orange-800">Đang tới</Badge>;
      case 'sending':
        return <Badge className="bg-orange-100 text-orange-800">Đang gửi bộ kit</Badge>;
      case 'returning':
        return <Badge className="bg-indigo-100 text-indigo-800">Đang gửi về</Badge>;
      case 'collected':
        return <Badge className="bg-purple-100 text-purple-800">Đã nhận mẫu</Badge>;
      case 'testing':
        return <Badge className="bg-cyan-100 text-cyan-800">Đang xét nghiệm</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      default:
        return <Badge>{status || "Không xác định"}</Badge>;
    }
  };

  const formatAddress = (collection: HomeCollection) => {
    if (collection.fullAddress) {
      const addr = collection.fullAddress;
      const parts = [
        addr.addressLine || addr.street,
        addr.district,
        addr.city,
        addr.country,
        addr.postalCode
      ].filter(Boolean);
      
      return (
        <div className="space-y-1">
          {parts.map((part, index) => (
            <div key={index} className="text-gray-600">{part}</div>
          ))}
        </div>
      );
    }
    
    return collection.address;
  };

  const handleStatusUpdate = async (id: string, newStatus: 'Pending' | 'Arrived' | 'On-going' | 'Collected' | 'Testing' | 'Completed' | 'Sending' | 'Returning') => {
    try {
      console.log(`Updating status for request ${id} to: ${newStatus}`);
      console.log('ID type:', typeof id, 'ID value:', id);
      console.log('Status type:', typeof newStatus, 'Status value:', newStatus);
      
      // Set loading state
      setUpdatingIds(prev => new Set(prev).add(id));
      
      // Gọi API để cập nhật status
      const response = await testRequestAPI.updateStatus(Number(id), newStatus);
      console.log('API response:', response);
      
      // Cập nhật UI nếu API call thành công
      if (response) {
        setAllCollections(prev => 
          prev.map(collection => 
            collection.id === id ? { ...collection, status: newStatus } : collection
          )
        );
        
        const statusMessage = translateStatus(newStatus);
        
        toast({
          title: "Cập nhật thành công",
          description: `Trạng thái lịch hẹn đã được cập nhật thành '${statusMessage}'`,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
      
      let errorMessage = "Không thể cập nhật trạng thái lịch hẹn. Vui lòng thử lại.";
      
      // Try to extract more specific error message
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorDetails = Object.values(validationErrors).flat().join(', ');
        errorMessage = `Lỗi validation: ${errorDetails}`;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      }
      
      toast({
        variant: "destructive",
        title: "Lỗi cập nhật",
        description: errorMessage,
      });
    } finally {
      // Clear loading state
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getCollectionTypeIcon = (type: 'At Home' | 'Self') => {
    if (type === 'At Home') {
      return <Users className="w-4 h-4 text-blue-600" />;
    } else {
      return <Package className="w-4 h-4 text-purple-600" />;
    }
  };

  const getCollectionTypeLabel = (type: 'At Home' | 'Self') => {
    if (type === 'At Home') {
      return <span className="text-blue-600 font-medium">Nhân viên thu mẫu</span>;
    } else {
      return <span className="text-purple-600 font-medium">Tự thu mẫu</span>;
    }
  };

  const filteredCollections = getFilteredCollections();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Lịch lấy mẫu tại nhà
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="at-home" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Lịch lấy mẫu tại nhà
              </TabsTrigger>
              <TabsTrigger value="self" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Lịch tự lấy mẫu tại nhà
              </TabsTrigger>
            </TabsList>

            <TabsContent value="at-home" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Lịch lấy mẫu tại nhà (Nhân viên thu mẫu)
                </h3>
                <p className="text-sm text-gray-600">
                  Các lịch hẹn có nhân viên đến tận nhà thu mẫu
                </p>
              </div>
              
              <div className="space-y-4">
                {filteredCollections.map((collection) => (
                  <Card key={collection.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">{collection.customerName}</span>
                            {getStatusBadge(collection.status)}
                            {getCollectionTypeIcon(collection.collectionType)}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{collection.phone}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                            <div className="flex-1">{formatAddress(collection)}</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{collection.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            {getCollectionTypeLabel(collection.collectionType)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-2">{collection.testType}</p>
                          <div className="flex gap-2">
                            {collection.status === 'Pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusUpdate(collection.id, 'On-going')}
                                disabled={updatingIds.has(collection.id)}
                              >
                                {updatingIds.has(collection.id) ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                )}
                                {updatingIds.has(collection.id) ? 'Đang cập nhật...' : 'Xác nhận đang tới'}
                              </Button>
                            )}
                            {collection.status === 'On-going' && (
                              <Button 
                                size="sm"
                                onClick={() => handleStatusUpdate(collection.id, 'Arrived')}
                                disabled={updatingIds.has(collection.id)}
                              >
                                {updatingIds.has(collection.id) ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                )}
                                {updatingIds.has(collection.id) ? 'Đang cập nhật...' : 'Xác nhận đã đến nhà'}
                              </Button>
                            )}
                            
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredCollections.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Không có lịch lấy mẫu tại nhà hôm nay</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Các lịch hẹn có nhân viên đến thu mẫu sẽ hiển thị ở đây
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="self" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Lịch tự lấy mẫu tại nhà (Gửi kit)
                </h3>
                <p className="text-sm text-gray-600">
                  Các yêu cầu gửi bộ kit tự thu mẫu đến nhà khách hàng
                </p>
              </div>
              
              <div className="space-y-4">
                {filteredCollections.map((collection) => (
                  <Card key={collection.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">{collection.customerName}</span>
                            {getStatusBadge(collection.status)}
                            {getCollectionTypeIcon(collection.collectionType)}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{collection.phone}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-1" />
                            <span>{collection.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{collection.timeSlot || 'Không cần lịch hẹn'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            {getCollectionTypeLabel(collection.collectionType)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-2">{collection.testType}</p>
                          <div className="flex gap-2">
                            {collection.status === 'Pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusUpdate(collection.id, 'Sending')}
                                disabled={updatingIds.has(collection.id)}
                              >
                                {updatingIds.has(collection.id) ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Package className="w-4 h-4 mr-1" />
                                )}
                                {updatingIds.has(collection.id) ? 'Đang cập nhật...' : 'Gửi bộ kit'}
                              </Button>
                            )}
                            {collection.status === 'Sending' && (
                              <Button 
                                size="sm"
                                onClick={() => handleStatusUpdate(collection.id, 'Collected')}
                                disabled={updatingIds.has(collection.id)}
                              >
                                {updatingIds.has(collection.id) ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Clipboard className="w-4 h-4 mr-1" />
                                )}
                                {updatingIds.has(collection.id) ? 'Đang cập nhật...' : 'Xác nhận đã thu lại kit'}
                              </Button>
                            )}
                            {collection.status === 'Returning' && (
                              <Button 
                                size="sm"
                                onClick={() => handleStatusUpdate(collection.id, 'Collected')}  
                                disabled={updatingIds.has(collection.id)}
                              >
                                {updatingIds.has(collection.id) ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Clipboard className="w-4 h-4 mr-1" />
                                )}
                                {updatingIds.has(collection.id) ? 'Đang cập nhật...' : 'Xác nhận đã thu lại kit'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredCollections.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Không có yêu cầu gửi kit tự thu mẫu</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Các yêu cầu gửi bộ kit tự thu mẫu sẽ hiển thị ở đây
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}