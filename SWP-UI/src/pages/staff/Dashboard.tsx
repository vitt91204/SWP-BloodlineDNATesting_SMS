import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Home, 
  TestTube, 
  FileText, 
  PenTool,
  LogOut,
  User
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import HomeCollections from './HomeCollections';
import TestProgress from './TestProgress';
import ResultsDelivery from './ResultsDelivery';
import BlogManagement from './BlogManagement';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Lấy thông tin staff từ localStorage
  const staffInfo = {
    name: localStorage.getItem('username') || 'Nhân viên',
    role: 'Staff',
    id: localStorage.getItem('userId') || 'ST001'
  };

  const handleLogout = () => {
    // Xóa thông tin đăng nhập từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    
    // Hiển thị thông báo
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống.",
    });
    
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header với thông tin staff và nút đăng xuất */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Xin chào, {staffInfo.name}</h1>
                  <p className="text-gray-600">Vai trò: {staffInfo.role} | ID: {staffInfo.id}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Nhân viên</h2>
          <p className="text-gray-600 mt-1">Quản lý công việc và nhiệm vụ hàng ngày</p>
        </div>

        <Tabs defaultValue="home-collections" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home-collections" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Lịch lấy mẫu tại nhà
            </TabsTrigger>
            <TabsTrigger value="test-progress" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Tiến độ xét nghiệm
            </TabsTrigger>
            <TabsTrigger value="results-delivery" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Trả kết quả
            </TabsTrigger>
            <TabsTrigger value="blog-management" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Quản lý Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home-collections" className="space-y-4">
            <HomeCollections />
          </TabsContent>

          <TabsContent value="test-progress" className="space-y-4">
            <TestProgress />
          </TabsContent>

          <TabsContent value="results-delivery" className="space-y-4">
            <ResultsDelivery />
          </TabsContent>

          <TabsContent value="blog-management" className="space-y-4">
            <BlogManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 