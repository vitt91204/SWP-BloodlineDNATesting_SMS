import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Home, 
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle
} from 'lucide-react';

interface HomeCollection {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  testType: string;
}

export default function HomeCollections() {
  // Sample data for home collections
  const [homeCollections, setHomeCollections] = useState<HomeCollection[]>([
    {
      id: 'HC001',
      customerName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      date: '2024-01-15',
      timeSlot: '09:00 - 10:00',
      status: 'Confirmed',
      testType: 'Xét nghiệm huyết thống dân sự'
    },
    {
      id: 'HC002',
      customerName: 'Trần Thị B',
      phone: '0912345678',
      address: '456 Đường DEF, Quận 3, TP.HCM',
      date: '2024-01-15',
      timeSlot: '14:00 - 15:00',
      status: 'Pending',
      testType: 'Xét nghiệm ADN xác định giới tính thai nhi'
    },
    {
      id: 'HC003',
      customerName: 'Lê Văn C',
      phone: '0923456789',
      address: '789 Đường GHI, Quận 7, TP.HCM',
      date: '2024-01-16',
      timeSlot: '10:30 - 11:30',
      status: 'Confirmed',
      testType: 'Xét nghiệm huyết thống pháp y'
    }
  ]);

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
    setHomeCollections(prev => 
      prev.map(collection => 
        collection.id === id ? { ...collection, status: newStatus } : collection
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Lịch lấy mẫu tại nhà hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {homeCollections.map((collection) => (
            <Card key={collection.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{collection.customerName}</span>
                      {getStatusBadge(collection.status)}
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
          {homeCollections.length === 0 && (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có lịch lấy mẫu tại nhà hôm nay</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 