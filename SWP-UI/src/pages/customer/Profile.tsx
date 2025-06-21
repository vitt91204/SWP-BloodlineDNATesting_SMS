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
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { userAPI } from "@/api/axios";
import TestHistory from "./TestHistory";
import Feedback from "./Feedback";
import AddressTab from "./Address"; // ✅ Thêm Address tab

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

export default function CustomerProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const [userInfoResponse, profileResponse] = await Promise.all([
        userAPI.getUserInfo().catch(() => null),
        userAPI.getProfile().catch(() => null),
      ]);

      const extractEmail = (data: any) =>
        data?.email || data?.Email || data?.emailAddress || data?.mail || "";
      const extractPhone = (data: any) =>
        data?.phone ||
        data?.Phone ||
        data?.phoneNumber ||
        data?.PhoneNumber ||
        data?.mobile ||
        data?.Mobile ||
        data?.telephone ||
        data?.tel ||
        "";

      const localUserData = localStorage.getItem("userData");
      const localUser = localUserData ? JSON.parse(localUserData) : null;

      const profile: ProfileData = {
        id:
          profileResponse?.id ||
          profileResponse?.userId ||
          userInfoResponse?.id ||
          userInfoResponse?.userId ||
          "",
        fullName:
          profileResponse?.fullName ||
          profileResponse?.name ||
          userInfoResponse?.fullName ||
          userInfoResponse?.name ||
          "",
        email:
          extractEmail(userInfoResponse) ||
          extractEmail(profileResponse) ||
          extractEmail(localUser) ||
          "",
        phone:
          extractPhone(userInfoResponse) ||
          extractPhone(profileResponse) ||
          extractPhone(localUser) ||
          "",
        dateOfBirth:
          profileResponse?.dateOfBirth || profileResponse?.birthDate || "",
        gender: profileResponse?.gender || "",
        notes: profileResponse?.notes || profileResponse?.description || "",
      };

      setProfileData(profile);
      setEditData(profile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin hồ sơ. Vui lòng thử lại.",
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
      const updateData = {
        ...editData,
        id: editData.id || profileData.id,
      };
      await userAPI.updateProfile(updateData);
      setProfileData({ ...editData });
      setIsEditing(false);
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
    } catch (error) {
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
          <p className="text-gray-600">Quản lý thông tin cá nhân và lịch sử xét nghiệm</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4"> {/* ✅ 4 cột */}
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="history">Lịch sử xét nghiệm</TabsTrigger>
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
                            onChange={(e) => handleInputChange("email", e.target.value)}
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
                            {new Date(profileData.dateOfBirth).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        {isEditing ? (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editData.gender}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
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

          <TabsContent value="history">
            <TestHistory />
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
