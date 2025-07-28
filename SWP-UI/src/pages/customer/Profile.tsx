import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Feedback from "./Feedback";
import AddressTab from "./Address"; // ✅ Thêm Address tab
import { userAPI } from "@/api/axios";

import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  Loader2,
} from "lucide-react";

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  notes: string;
}

// Gender mapping cho hiển thị
const genderDisplayMap: Record<string, string> = {
  "Male": "Nam",
  "Female": "Nữ", 
  "Other": "Khác",
};

// Gender options cho select
const genderOptions = [
  { value: "Male", label: "Nam" },
  { value: "Female", label: "Nữ" },
  { value: "Other", label: "Khác" }
];

// Helper function to get userId from localStorage
const getUserIdFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    console.log('Raw userData from localStorage:', userData);
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log('Parsed userData:', parsedData);
      
      // Try different possible field names for userId
      const userId = parsedData.id || 
                    parsedData.userId || 
                    parsedData.user_id || 
                    parsedData.ID ||
                    parsedData.UserId ||
                    '';
      console.log('Extracted userId:', userId);
      return userId.toString();
    }
    
    // Also try from authToken or other storage keys
    const authToken = localStorage.getItem('authToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log('AuthToken exists:', !!authToken);
    console.log('IsAuthenticated:', isAuthenticated);
    
    console.log('No userData in localStorage');
    return '';
  } catch (error) {
    console.error('Error parsing userData from localStorage:', error);
    return '';
  }
};

export default function CustomerProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    notes: "",
  });
  const [editData, setEditData] = useState<ProfileData>({ ...profileData });

  useEffect(() => {
    const userId = getUserIdFromLocalStorage();
    setCurrentUserId(userId);
    if (userId) {
      loadProfile(userId);
    } else {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy User ID. Vui lòng đăng nhập lại.",
      });
    }
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const userData = await userAPI.getProfile(userId);

      if (userData) {
        // Normalize gender value to be capitalized to match the display map and select options.
        const normalizedUserData = {
            ...userData,
            gender: userData.gender 
                ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
                : ""
        };

        console.log("Profile data loaded:", normalizedUserData);
        setProfileData(normalizedUserData);
        setEditData(normalizedUserData);
      } else {
        // Handle case where profile does not exist for the user
        const basicUserInfo = await userAPI.getUserInfo(userId);
        if (basicUserInfo) {
          const newProfileData = {
            id: basicUserInfo.id || userId,
            fullName: basicUserInfo.fullName || basicUserInfo.username || "",
            email: basicUserInfo.email || "",
            phone: basicUserInfo.phone || "",
            dateOfBirth: basicUserInfo.dateOfBirth || "",
            gender: basicUserInfo.gender || "",
            notes: basicUserInfo.notes || "",
          };
          setProfileData(newProfileData);
          setEditData(newProfileData);
          toast({
            title: "Chào mừng bạn",
            description: "Hãy cập nhật thông tin cá nhân của bạn.",
          });
        } else {
            toast({
              variant: "destructive",
              title: "Không tìm thấy dữ liệu",
              description: "Không thể tải thông tin người dùng.",
            });
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin từ máy chủ.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!editData.fullName.trim()) {
        toast({
          variant: "destructive",
          title: "Lỗi validation",
          description: "Họ và tên không được để trống.",
        });
        return;
      }

      if (!editData.email.trim()) {
        toast({
          variant: "destructive",
          title: "Lỗi validation", 
          description: "Email không được để trống.",
        });
        return;
      }

      // Use updateProfile function from userAPI
      await userAPI.updateProfile({
        ...editData,
        gender: editData.gender || "Other"
      }, currentUserId);
      
      setProfileData({ ...editData });
      setIsEditing(false);
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });

      // Reload profile to get latest data
      loadProfile(currentUserId);

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và các thiết đặt tài khoản</p>
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gray-400">Debug: User ID = {currentUserId || 'Not found'}</p>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3"> {/* ✅ 3 cột */}
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="feedback">Đánh giá dịch vụ</TabsTrigger>
            <TabsTrigger value="address">Địa chỉ</TabsTrigger> {/* ✅ tab mới */}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" /> Thông tin cá nhân
                    </CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa
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
                        <X className="w-4 h-4 mr-2" /> Hủy
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
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="Nhập họ và tên"
                          />
                        ) : (
                          <p className="flex items-center gap-2 text-gray-900">
                            <User className="w-4 h-4 text-gray-500" />
                            {profileData.fullName || "Chưa có thông tin"}
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
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Nhập email"
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
                            onChange={(e) => handleInputChange("phone", e.target.value)}
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
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          />
                        ) : (
                          <p className="flex items-center gap-2 text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {profileData.dateOfBirth ? 
                              new Date(profileData.dateOfBirth).toLocaleDateString("vi-VN") : 
                              "Chưa có thông tin"
                            }
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        {isEditing ? (
                          <Select
                            value={editData.gender}
                            onValueChange={(value) => handleInputChange("gender", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                              {genderOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-gray-900">
                            {genderDisplayMap[profileData.gender] || "Chưa xác định"}
                          </p>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="notes">Ghi chú</Label>
                      {isEditing ? (
                        <Textarea
                          id="notes"
                          value={editData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Thêm ghi chú..."
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profileData.notes || "Không có ghi chú"}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Feedback />
          </TabsContent>

          <TabsContent value="address">
            <AddressTab /> {/* ✅ Nội dung tab địa chỉ */}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
