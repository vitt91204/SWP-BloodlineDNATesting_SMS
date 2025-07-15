import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Home, 
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Package,
  Users
} from 'lucide-react';
import { testRequestAPI } from '@/api/axios';

interface HomeCollection {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  testType: string;
  collectionType: 'At Home' | 'Self';
}

export default function HomeCollections() {
  const [allCollections, setAllCollections] = useState<HomeCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('at-home');

  useEffect(() => {
    const fetchHomeCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        const allRequests = await testRequestAPI.getAll();
        
        // Lọc các yêu cầu lấy mẫu tại nhà (cả At Home và Self)
        const homeRequests = (allRequests || []).filter(
          (req) => req.collectionType?.toLowerCase() === 'at home' || req.collectionType?.toLowerCase() === 'self'
        );
        
        setAllCollections(
          homeRequests.map((req) => ({
            id: req.requestId || req.id,
            customerName: req.user?.fullName || req.user?.username || 'Khách hàng',
            phone: req.user?.phone || '',
            address: req.address?.street || req.address?.addressLine || '',
            date: req.appointmentDate,
            timeSlot: req.slotTime,
            status: req.status,
            testType: req.service?.name || '',
            collectionType: req.collectionType as 'At Home' | 'Self',
          }))
        );
      } catch (err) {
        setError('Không thể tải dữ liệu lịch lấy mẫu tại nhà');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCollections();
  }, []);

  // Lọc dữ liệu theo tab hiện tại
  const getFilteredCollections = () => {
    if (activeTab === 'at-home') {
      return allCollections.filter(collection => collection.collectionType === 'At Home');
    } else {
      return allCollections.filter(collection => collection.collectionType === 'Self');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>;
      case 'Confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Đã xác nhận</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleStatusUpdate = (id: string, newStatus: 'Pending' | 'Confirmed' | 'Completed') => {
    setAllCollections(prev => 
      prev.map(collection => 
        collection.id === id ? { ...collection, status: newStatus } : collection
      )
    );
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
                            <MapPin className="w-4 h-4 mt-1" />
                            <span>{collection.address}</span>
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
                                onClick={() => handleStatusUpdate(collection.id, 'Confirmed')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Xác nhận
                              </Button>
                            )}
                            {collection.status === 'Confirmed' && (
                              <Button 
                                size="sm"
                                onClick={() => handleStatusUpdate(collection.id, 'Completed')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Hoàn thành
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
                                onClick={() => handleStatusUpdate(collection.id, 'Confirmed')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Xác nhận gửi kit
                              </Button>
                            )}
                            {collection.status === 'Confirmed' && (
                              <Button 
                                size="sm"
                                onClick={() => handleStatusUpdate(collection.id, 'Completed')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Đã gửi kit
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