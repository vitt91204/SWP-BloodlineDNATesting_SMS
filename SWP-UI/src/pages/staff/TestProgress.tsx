import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  TestTube, 
  Edit, 
  FileText
} from 'lucide-react';

interface TestProgress {
  id: string;
  testName: string;
  customerName: string;
  sampleDate: string;
  currentStatus: 'Sample Collected' | 'Processing' | 'Analysis' | 'Quality Check' | 'Completed';
  progress: number;
}

export default function TestProgress() {
  // Sample data for test progress
  const [testProgress, setTestProgress] = useState<TestProgress[]>([
    {
      id: 'TP001',
      testName: 'Xét nghiệm huyết thống dân sự',
      customerName: 'Nguyễn Văn D',
      sampleDate: '2024-01-10',
      currentStatus: 'Analysis',
      progress: 65
    },
    
    
  ]);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Sample Collected': { className: 'bg-blue-100 text-blue-800' },
      'Processing': { className: 'bg-yellow-100 text-yellow-800' },
      'Analysis': { className: 'bg-orange-100 text-orange-800' },
      'Quality Check': { className: 'bg-purple-100 text-purple-800' },
      'Completed': { className: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{status}</Badge>;
  };

  const handleUpdateProgress = (id: string) => {
    // Logic để cập nhật tiến độ - có thể mở modal hoặc navigate đến trang chi tiết
    console.log('Update progress for test:', id);
  };

  const handleViewDetails = (id: string) => {
    // Logic để xem chi tiết - có thể navigate đến trang chi tiết
    console.log('View details for test:', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Cập nhật tiến độ xét nghiệm
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testProgress.map((test) => (
            <Card key={test.id} className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{test.testName}</h3>
                    <p className="text-gray-600">Khách hàng: {test.customerName}</p>
                    <p className="text-sm text-gray-500">
                      Ngày lấy mẫu: {new Date(test.sampleDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(test.currentStatus)}
                    <p className="text-sm text-gray-500 mt-1">ID: {test.id}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tiến độ:</span>
                    <span className="text-sm text-gray-600">{test.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(test.progress)}`}
                      style={{ width: `${test.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateProgress(test.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Cập nhật tiến độ
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(test.id)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {testProgress.length === 0 && (
            <div className="text-center py-8">
              <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có xét nghiệm nào đang trong quá trình xử lý</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 