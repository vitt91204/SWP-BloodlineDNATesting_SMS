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
import { userAPI } from "@/api/axios";
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
  Eye,
  Loader2
} from "lucide-react";

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    notes: ""
  });

  const [editData, setEditData] = useState<ProfileData>({ ...profileData });

  // Load profile data from API
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      
      // Load data from both APIs
      const [userInfoResponse, profileResponse] = await Promise.all([
        userAPI.getUserInfo().catch(err => {
          console.log('User info API failed:', err);
          return null;
        }),
        userAPI.getProfile().catch(err => {
          console.log('Profile API failed:', err);
          return null;
        })
      ]);
      
      console.log('User Info API Response:', userInfoResponse);
      console.log('Profile API Response:', profileResponse);
      
      // Function to extract email from various possible field names
      const extractEmail = (data: any) => {
        return data?.email || data?.Email || data?.emailAddress || data?.mail || "";
      };
      
      // Function to extract phone from various possible field names  
      const extractPhone = (data: any) => {
        return data?.phone || data?.Phone || data?.phoneNumber || data?.PhoneNumber || 
               data?.mobile || data?.Mobile || data?.telephone || data?.tel || "";
      };
      
      // Get email/phone from localStorage if available
      const localUserData = localStorage.getItem('userData');
      const localUser = localUserData ? JSON.parse(localUserData) : null;
      
      // Combine data from all sources
      const profile: ProfileData = {
        id: profileResponse?.id || profileResponse?.userId || userInfoResponse?.id || userInfoResponse?.userId || "",
        fullName: profileResponse?.fullName || profileResponse?.name || userInfoResponse?.fullName || userInfoResponse?.name || "",
        email: extractEmail(userInfoResponse) || extractEmail(profileResponse) || extractEmail(localUser) || "", // Try User API, Profile API, then localStorage
        phone: extractPhone(userInfoResponse) || extractPhone(profileResponse) || extractPhone(localUser) || "", // Try User API, Profile API, then localStorage  
        address: profileResponse?.address || "",
        dateOfBirth: profileResponse?.dateOfBirth || profileResponse?.birthDate || "",
        gender: profileResponse?.gender || "",
        notes: profileResponse?.notes || profileResponse?.description || ""
      };
      
      console.log('=== FINAL COMBINED PROFILE DATA ===');
      console.log('Raw User Info Response:', userInfoResponse);
      console.log('Raw Profile Response:', profileResponse);
      
      console.log('Email sources:', {
        fromUserAPI: userInfoResponse?.email,
        fromProfileAPI: profileResponse?.email,
        finalEmail: profile.email
      });
      console.log('Phone sources:', {
        fromUserAPI: userInfoResponse?.phone || userInfoResponse?.phoneNumber,
        fromProfileAPI: profileResponse?.phone || profileResponse?.phoneNumber,
        finalPhone: profile.phone
      });
      
      // Check all possible field names
      console.log('All User API fields:', userInfoResponse ? Object.keys(userInfoResponse) : 'null');
      console.log('All Profile API fields:', profileResponse ? Object.keys(profileResponse) : 'null');
      
      console.log('Final profile:', profile);
      console.log('=== END DEBUG ===');
      
      setProfileData(profile);
      setEditData(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin hồ sơ. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSave = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Prepare data for API - ensure all required fields are included
      const updateData = {
        ...editData,
        // Make sure we have an ID for the update
        id: editData.id || profileData.id
      };
      
      console.log('Saving profile data:', updateData);
      
      // Call API to update profile
      const result = await userAPI.updateProfile(updateData);
      
      setProfileData({ ...editData });
      setIsEditing(false);
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
      
      console.log('Profile update successful:', result);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
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
                      <Button onClick={handleSave} size="sm" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? "Đang lưu..." : "Lưu"}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" disabled={isLoading}>
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                ) : (
                  <>
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
                        placeholder="Nhập email của bạn"
                      />
                    ) : (
                      <p className="flex items-center gap-2 text-gray-900">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {profileData.email || "Chưa có email"}
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
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="flex items-center gap-2 text-gray-900">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {profileData.phone || "Chưa có số điện thoại"}
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
                  </>
                )}
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
