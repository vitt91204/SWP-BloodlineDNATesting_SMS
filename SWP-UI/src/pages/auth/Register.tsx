import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { 
  Microscope, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  ArrowRight,
  Shield,
  UserPlus,
  Calendar,
  Users
} from "lucide-react";
import { authAPI } from "@/api/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    password: "",
    repeatPassword: "",
    phone: "",
    role: "", 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password validation - minimum 8 characters
    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 8 ký tự.",
      });
      setIsLoading(false);
      return;
    }

    // Age validation - must be 18 or older
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // If birthday hasn't occurred this year, subtract 1 from age
        if (age - 1 < 18) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Bạn phải từ 18 tuổi trở lên để đăng ký.",
          });
          setIsLoading(false);
          return;
        }
      } else if (age < 18) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Bạn phải từ 18 tuổi trở lên để đăng ký.",
        });
        setIsLoading(false);
        return;
      }
    }

    if (formData.password !== formData.repeatPassword) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp.",
      });
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.register({
        username: formData.username,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        repeatPassword: formData.repeatPassword,
        phone: formData.phone,
        role: formData.role,
      });

      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập để tiếp tục.",
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50"></div>

      <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
        {/* Logo Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <ScrollReveal animation="scaleIn" delay={100}>
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110">
                  <Microscope className="w-10 h-10 text-white" />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                </div>
                {/* Simple medical symbols */}
                <div className="absolute -top-2 -right-2 w-6 h-6 text-emerald-400">
                  <div className="w-full h-1.5 bg-current absolute top-2"></div>
                  <div className="w-1.5 h-full bg-current absolute left-2"></div>
                </div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full opacity-80"></div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeInUp" delay={200}>
            <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-blue-900 bg-clip-text text-transparent">
              DNA Health
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fadeInUp" delay={300}>
            <p className="mt-2 text-center text-sm text-gray-600 flex items-center justify-center">
              <Shield className="w-4 h-4 mr-2 text-emerald-400" />
              Tạo tài khoản xét nghiệm ADN
            </p>
          </ScrollReveal>
        </div>

        {/* Form Section */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <ScrollReveal animation="fadeInUp" delay={400}>
            <div className="relative">
              {/* Glassmorphism Card */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl py-8 px-6 sm:px-10 relative overflow-hidden">
                {/* Card Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5"></div>
                
                <div className="relative z-10">
                  {/* Tab Navigation */}
                  <div className="flex bg-gray-100 rounded-xl p-1 mb-8 relative z-20">
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="flex-1 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200 py-2 px-4 cursor-pointer"
                    >
                      Đăng nhập
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg py-2 px-4 cursor-default"
                      disabled
                    >
                      <UserPlus className="w-4 h-4 mr-2 inline" />
                      Đăng ký
                    </button>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="relative">
                      <Label htmlFor="username" className="text-gray-700 font-medium">
                        Tên người dùng
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'username' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('username')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Nhập tên người dùng"
                          required
                          className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70"
                        />
                      </div>
                    </div>

                    {/* Full Name Field */}
                    <div className="relative">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">
                        Họ và tên
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'fullName' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('fullName')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Nhập họ và tên"
                          required
                          className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70"
                        />
                      </div>
                    </div>

                    {/* Date of Birth Field */}
                    <div className="relative">
                      <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                        Ngày sinh
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'dateOfBirth' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('dateOfBirth')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70"
                        />
                      </div>
                    </div>

                    {/* Gender Field */}
                    <div className="relative">
                      <Label htmlFor="gender" className="text-gray-700 font-medium">
                        Giới tính
                      </Label>
                      <div className="relative mt-2">
                        <Select value={formData.gender} onValueChange={handleGenderChange}>
                          <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70">
                            <div className="flex items-center">
                              <Users className="w-5 h-5 mr-2 text-gray-400" />
                              <SelectValue placeholder="Chọn giới tính" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'email' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="name@example.com"
                          required
                          className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="relative">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Số điện thoại
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'phone' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="0123 456 789"
                          required
                          className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <Label htmlFor="password" className="text-gray-700 font-medium">
                        Mật khẩu
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'password' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••"
                          required
                          className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Mật khẩu phải có ít nhất 8 ký tự
                      </p>
                    </div>

                    {/* Repeat Password Field */}
                    <div className="relative">
                      <Label htmlFor="repeatPassword" className="text-gray-700 font-medium">
                        Xác nhận mật khẩu
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'repeatPassword' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="repeatPassword"
                          name="repeatPassword"
                          type={showRepeatPassword ? "text" : "password"}
                          value={formData.repeatPassword}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('repeatPassword')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••"
                          required
                          className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-300/20 transition-all duration-200 hover:bg-white/70"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showRepeatPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="text-sm text-gray-600">
                      Bằng cách đăng ký, bạn đồng ý với{" "}
                      <Link to="/terms" className="font-medium text-emerald-500 hover:text-emerald-600 transition-colors duration-200">
                        Điều khoản dịch vụ
                      </Link>{" "}
                      và{" "}
                      <Link to="/privacy" className="font-medium text-emerald-500 hover:text-emerald-600 transition-colors duration-200">
                        Chính sách bảo mật
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Đang đăng ký...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center group-hover:gap-2 transition-all duration-200">
                          Đăng ký
                          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Login Link */}
                  <div className="mt-6 text-center">
                    <span className="text-sm text-gray-600">
                      Đã có tài khoản?{" "}
                      <Link
                        to="/login"
                        className="font-medium text-emerald-500 hover:text-emerald-600 transition-colors duration-200"
                      >
                        Đăng nhập ngay
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Security Badge */}
        <ScrollReveal animation="fadeIn" delay={600}>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <Shield className="w-4 h-4 text-emerald-400 mr-2" />
              <span className="text-sm text-gray-600 font-medium">
                Thông tin được mã hóa & bảo mật
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
