import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { userAPI } from "@/api/axios";

interface UserData {
  id?: string;
  userId?: number;
  username?: string;
  password?: string;
  role?: string;
}

export const Settings = () => {
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const authToken = localStorage.getItem('authToken');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const userDataStr = localStorage.getItem('userData');

    if (!isAuth || !userDataStr) {
      toast({
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để truy cập trang cài đặt.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Load dữ liệu người dùng từ API
    loadUserData();
  }, [navigate, toast]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Get user data from localStorage to find current user
      const userDataStr = localStorage.getItem('userData');
      const localUserData = userDataStr ? JSON.parse(userDataStr) : null;
      
      if (!localUserData) {
        throw new Error('No user data in localStorage');
      }

      // Call API to get all users (without userId parameter)
      const response = await userAPI.getUserInfo();
      console.log('API Response:', response);
      
      // Handle array response
      let users = Array.isArray(response) ? response : [response];
      
      // Find current user by userId or username
      let currentUser = null;
      
      if (localUserData.userId) {
        currentUser = users.find(user => user.userId === localUserData.userId);
      }
      
      if (!currentUser && localUserData.username) {
        currentUser = users.find(user => user.username === localUserData.username);
      }
      
      if (!currentUser && localUserData.id) {
        currentUser = users.find(user => user.userId === parseInt(localUserData.id));
      }
      
      // If still not found, use first user as fallback
      if (!currentUser && users.length > 0) {
        currentUser = users[0];
      }
      
      if (currentUser) {
        const userData = {
          id: currentUser.userId?.toString() || localUserData.id,
          userId: currentUser.userId,
          username: currentUser.username,
          password: currentUser.password,
          role: currentUser.role,
        };
        
        console.log('Setting user data:', userData);
        setUserData(userData);
        
        // Update localStorage with API data
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        throw new Error('User not found in API response');
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      
      // Fallback to localStorage data
      try {
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          const parsedUserData = JSON.parse(userDataStr);
          setUserData(parsedUserData);
        }
      } catch (localStorageError) {
        console.error('Error parsing localStorage data:', localStorageError);
      }
      
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin từ server. Sử dụng dữ liệu cục bộ.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    
    // Simple validation
    if (!userData.username?.trim()) {
      toast({
        title: "Lỗi validation",
        description: "Tên đăng nhập không được để trống.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate password fields if change password form is shown
    if (showChangePassword) {
      if (!oldPassword.trim()) {
        toast({
          title: "Lỗi validation", 
          description: "Mật khẩu cũ không được để trống.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!newPassword.trim()) {
        toast({
          title: "Lỗi validation", 
          description: "Mật khẩu mới không được để trống.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (newPassword !== repeatPassword) {
        toast({
          title: "Lỗi validation", 
          description: "Mật khẩu mới và nhập lại mật khẩu không khớp.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        toast({
          title: "Lỗi validation", 
          description: "Mật khẩu mới phải có ít nhất 6 ký tự.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      // If changing password, call API endpoint
      if (showChangePassword) {
        const userId = userData.userId?.toString() || userData.id || '';
        
        if (!userId) {
          throw new Error('Không tìm thấy ID người dùng');
        }

        console.log('Calling update password API for user:', userId);
        await userAPI.updatePassword(userId, oldPassword, newPassword);
        
        toast({
          title: "Cập nhật thành công",
          description: "Mật khẩu đã được thay đổi thành công.",
        });
        
        // Clear form and close change password form after successful update
        setOldPassword("");
        setNewPassword("");
        setRepeatPassword("");
        setShowChangePassword(false);
      } else {
        // For other updates, just update localStorage
        toast({
          title: "Cập nhật thành công", 
          description: "Thông tin tài khoản đã được cập nhật.",
        });
      }
      
      // Update localStorage with new data
      localStorage.setItem('userData', JSON.stringify(userData));
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Không thể cập nhật thông tin. Vui lòng thử lại.";
      
      toast({
        title: "Lỗi cập nhật",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cài đặt tài khoản</h1>
              <p className="text-gray-600 mt-2">Cập nhật thông tin cá nhân của bạn</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Về trang chủ
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={userData.username || ''}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {!showChangePassword && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowChangePassword(true)}
                      className="flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Thay đổi
                    </Button>
                  )}
                  {showChangePassword && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowChangePassword(false);
                        setOldPassword("");
                        setNewPassword("");
                        setRepeatPassword("");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Hủy
                    </Button>
                  )}
                </div>
{!showChangePassword ? (
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={userData.password || ''}
                      placeholder="Mật khẩu hiện tại"
                      className="pr-10 bg-gray-100"
                      disabled
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Old Password */}
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <div className="relative">
                        <Input
                          id="oldPassword"
                          type={showOldPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Nhập mật khẩu cũ"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Repeat Password */}
                    <div className="space-y-2">
                      <Label htmlFor="repeatPassword">Nhập lại mật khẩu mới</Label>
                      <div className="relative">
                        <Input
                          id="repeatPassword"
                          type={showRepeatPassword ? "text" : "password"}
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        >
                          {showRepeatPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Input
                  id="role"
                  value={userData.role || ''}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                  placeholder="Vai trò"
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 