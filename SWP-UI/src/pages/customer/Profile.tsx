import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Edit3, 
  Save, 
  X,
  TestTube,
  Download,
  Eye
} from "lucide-react";

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  emergencyContact: string;
  emergencyContactName: string;
  notes: string;
}

interface TestHistory {
  id: string;
  testName: string;
  date: string;
  status: string;
  result: string;
  price: string;
}

type StatusType = "Hoàn thành" | "Đang xử lý" | "Đã lấy mẫu" | "Hủy";
type ResultType = "Có kết quả" | "Chờ kết quả" | "Đang phân tích";

export default function CustomerProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "KH001",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quần 1, TP.HCM",
    dateOfBirth: "1990-01-15",
    gender: "Nam",
    occupation: "Kỹ sư",
    emergencyContact: "0907654321",
    emergencyContactName: "Nguyễn Thị B",
    notes: ""
  });

  const [editData, setEditData] = useState<ProfileData>({ ...profileData });

  // Dữ liệu lịch sử xét nghiệm mẫu
  const [testHistory] = useState<TestHistory[]>([
    {
      id: "XN001",
      testName: "Xét nghiệm huyết thống dân sự",
      date: "2024-01-15",
      status: "Hoàn thành",
      result: "Có kết quả",
      price: "3,500,000 VNĐ"
    },
    {
      id: "XN002", 
      testName: "Xét nghiệm huyết thống pháp y",
      date: "2024-02-20",
      status: "Đang xử lý",
      result: "Chờ kết quả",
      price: "5,000,000 VNĐ"
    },
    {
      id: "XN003",
      testName: "Xét nghiệm ADN xác định giới tính thai nhi",
      date: "2024-03-10",
      status: "Đã lấy mẫu",
      result: "Đang phân tích",
      price: "2,500,000 VNĐ"
    }
  ]);

  const handleInputChange = (field: keyof ProfileData, value: string): void => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (): void => {
    setProfileData({ ...editData });
    setIsEditing(false);
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin cá nhân đã được cập nhật.",
    });
  };

  const handleCancel = (): void => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<StatusType, { variant: string; className: string }> = {
      "Hoàn thành": { variant: "default", className: "bg-green-100 text-green-800" },
      "Đang xử lý": { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      "Đã lấy mẫu": { variant: "outline", className: "bg-blue-100 text-blue-800" },
      "Hủy": { variant: "destructive", className: "bg-red-100 text-red-800" }
    };
    const config = statusConfig[status as StatusType] || { variant: "default", className: "" };
    return <Badge className={config.className}>{status}</Badge>;
  };

  const getResultBadge = (result: string) => {
    const resultConfig: Record<ResultType, { className: string }> = {
      "Có kết quả": { className: "bg-green-100 text-green-800" },
      "Chờ kết quả": { className: "bg-yellow-100 text-yellow-800" },
      "Đang phân tích": { className: "bg-blue-100 text-blue-800" }
    };
    const config = resultConfig[result as ResultType] || { className: "bg-gray-100 text-gray-800" };
    return <Badge className={config.className}>{result}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và lịch sử xét nghiệm</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="history">Lịch sử xét nghiệm</TabsTrigger>
          </TabsList>

          {/* Tab thông tin cá nhân */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Thông tin cá nhân
                    </CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        value={editData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    ) : (
                      <p className="flex items-center gap-2 text-gray-900">
                        <User className="w-4 h-4 text-gray-500" />
                        {profileData.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <p className="flex items-center gap-2 text-gray-900">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {profileData.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="flex items-center gap-2 text-gray-900">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {profileData.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={editData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    ) : (
                      <p className="flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    {isEditing ? (
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profileData.gender}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Nghề nghiệp</Label>
                    {isEditing ? (
                      <Input
                        id="occupation"
                        value={editData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.occupation}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="flex items-start gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      {profileData.address}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Liên hệ khẩn cấp</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Tên người liên hệ</Label>
                      {isEditing ? (
                        <Input
                          id="emergencyContactName"
                          value={editData.emergencyContactName}
                          onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.emergencyContactName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Số điện thoại khẩn cấp</Label>
                      {isEditing ? (
                        <Input
                          id="emergencyContact"
                          value={editData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.emergencyContact}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  {isEditing ? (
                    <Textarea
                      id="notes"
                      value={editData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Thêm ghi chú..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.notes || "Không có ghi chú"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab lịch sử xét nghiệm */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Lịch sử xét nghiệm
                </CardTitle>
                <CardDescription>
                  Danh sách các lần xét nghiệm của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testHistory.map((test) => (
                    <Card key={test.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{test.testName}</h3>
                            <p className="text-sm text-gray-600 mt-1">Mã: {test.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">{test.price}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(test.date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3">
                            {getStatusBadge(test.status)}
                            {getResultBadge(test.result)}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </Button>
                            {test.result === "Có kết quả" && (
                              <Button size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Tải kết quả
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {testHistory.length === 0 && (
                  <div className="text-center py-8">
                    <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có lịch sử xét nghiệm nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
