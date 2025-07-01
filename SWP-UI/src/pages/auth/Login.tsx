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
  ArrowRight,
  Shield
} from "lucide-react";
import { authAPI } from "@/api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the actual login API
      const response = await authAPI.login(username, password);
      
      // Debug: Log the API response
      console.log('Login API Response:', response);
      console.log('Response keys:', Object.keys(response));
      console.log('Response type:', typeof response);
      
      
      const token = response.token;
      const user = response.user;
      
      console.log('Extracted token:', token);
      console.log('Extracted user:', user);
      
      if (token) {
        localStorage.setItem('authToken', token);  
        console.log('Token saved to localStorage:', token);
      } else {
        console.log('No token found in response, setting dummy token');
        localStorage.setItem('authToken', 'dummy-token-for-testing');
      }
      
      // Store user data with username for later identification
      const userData = {
        username: username, // Store the login username for identification
        fullName: user?.fullName || user?.name || username,
        id: user?.id || user?.userId || user?.user_id,
        email: user?.email,
        phone: user?.phone,
        role: user?.role || user?.userRole,
        ...user // Spread any additional user data from API
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('User data saved to localStorage:', userData);
      
      localStorage.setItem('isAuthenticated', 'true');
      
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
      });

      // Trigger a storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      // Check user role and redirect accordingly
      const userRole = userData?.role || userData?.userRole || user?.role || user?.userRole;
      console.log('User role:', userRole);
      
      // Wait a bit then navigate based on role
      setTimeout(() => {
        if (userRole === 'admin' || userRole === 'Admin' || userRole === 'ADMIN') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else if (userRole === 'staff' || userRole === 'Staff' || userRole === 'STAFF') {
          console.log('Redirecting to staff dashboard');
          navigate('/staff');
        } else {
          console.log('Redirecting to home page');
          navigate('/');
        }
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Tên đăng nhập hoặc mật khẩu không chính xác.";
      
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50"></div>

      <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen">
        {/* Logo Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <ScrollReveal animation="scaleIn" delay={100}>
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110">
                  <Microscope className="w-10 h-10 text-white" />
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                </div>
                {/* Simple medical symbols */}
                <div className="absolute -top-2 -right-2 w-6 h-6 text-red-400">
                  <div className="w-full h-1.5 bg-current absolute top-2"></div>
                  <div className="w-1.5 h-full bg-current absolute left-2"></div>
                </div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full opacity-80"></div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeInUp" delay={200}>
            <h2 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-800 bg-clip-text text-transparent">
              DNA Health
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fadeInUp" delay={300}>
            <p className="mt-2 text-center text-sm text-gray-600 flex items-center justify-center">
              <Shield className="w-4 h-4 mr-2 text-emerald-400" />
              Xét nghiệm ADN chuyên nghiệp & bảo mật
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5"></div>
                
                <div className="relative z-10">
                  {/* Tab Navigation */}
                  <div className="flex bg-gray-100 rounded-xl p-1 mb-8 relative z-20">
                    <button
                      type="button"
                      className="flex-1 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-emerald-400 shadow-lg py-2 px-4 cursor-default"
                      disabled
                    >
                      <User className="w-4 h-4 mr-2 inline" />
                      Đăng nhập
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="flex-1 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200 py-2 px-4 cursor-pointer"
                    >
                      Đăng ký
                    </button>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="relative">
                      <Label htmlFor="username" className="text-gray-700 font-medium">
                        Tên đăng nhập
                      </Label>
                      <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === 'username' ? 'text-emerald-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onFocus={() => setFocusedField('username')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Nhập tên đăng nhập"
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
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                    </div>

                    

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Đang đăng nhập...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center group-hover:gap-2 transition-all duration-200">
                          Đăng nhập
                          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Register Link */}
                  <div className="mt-6 text-center">
                    <span className="text-sm text-gray-600">
                      Chưa có tài khoản?{" "}
                      <Link
                        to="/register"
                        className="font-medium text-emerald-500 hover:text-emerald-600 transition-colors duration-200"
                      >
                        Đăng ký ngay
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
                Bảo mật SSL 256-bit
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
} 