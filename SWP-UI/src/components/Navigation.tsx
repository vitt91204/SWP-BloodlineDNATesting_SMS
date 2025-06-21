import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Microscope, UserPlus, LogIn, Home, TestTube, BookOpen, Phone, User, LogOut, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const userDataStr = localStorage.getItem('userData');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      // Debug logs
      console.log('Navigation checkAuth:', {
        authToken: !!authToken,
        userDataStr: !!userDataStr,
        isAuth,
        hasUserData: !!userDataStr
      });
      
      // Temporarily allow authentication without token for testing
      if (isAuth && userDataStr) {
        const parsedUserData = JSON.parse(userDataStr);
        setIsAuthenticated(true);
        setUserData(parsedUserData);
        console.log('User authenticated:', parsedUserData);
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        console.log('User not authenticated');
      }
    };

    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAuthenticated');
      
      setIsAuthenticated(false);
      setUserData(null);
      
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = (userData: any) => {
    if (userData?.fullName) {
      return userData.fullName.split(' ').map((name: string) => name[0]).join('').toUpperCase();
    }
    if (userData?.username) {
      return userData.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const navItems = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Dịch vụ", href: "/services", icon: TestTube },
    { name: "Quy trình", href: "/process", icon: Microscope },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Liên hệ", href: "/contact", icon: Phone },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DNA Health</h1>
              <p className="text-xs text-gray-600">Xét nghiệm ADN chuyên nghiệp</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === item.href ? "text-blue-600" : "text-gray-700"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData?.avatar} alt={userData?.fullName || userData?.username} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                        {getUserInitials(userData)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {userData?.fullName && (
                        <p className="font-medium">{userData.fullName}</p>
                      )}
                      {userData?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userData.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                  </DropdownMenuItem>
                  {(userData?.role === 'admin' || userData?.role === 'Admin' || userData?.role === 'ADMIN' || userData?.userRole === 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Quản trị</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(userData?.role === 'staff' || userData?.role === 'Staff' || userData?.role === 'STAFF' || userData?.userRole === 'staff') && (
                    <DropdownMenuItem asChild>
                      <Link to="/staff" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Bảng điều khiển nhân viên</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onSelect={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  asChild
                >
                  <Link to="/register">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Đăng ký
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Xét nghiệm ADN chuyên nghiệp
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                        location.pathname === item.href ? "text-blue-600" : "text-gray-700"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <div className="pt-4 flex flex-col space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={userData?.avatar} alt={userData?.fullName || userData?.username} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                              {getUserInitials(userData)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            {userData?.fullName && (
                              <p className="font-medium text-sm">{userData.fullName}</p>
                            )}
                            {userData?.email && (
                              <p className="text-xs text-muted-foreground">{userData.email}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <User className="w-4 h-4 mr-2" />
                            Hồ sơ cá nhân
                          </Link>
                        </Button>
                        {(userData?.role === 'admin' || userData?.role === 'Admin' || userData?.role === 'ADMIN' || userData?.userRole === 'admin') && (
                          <Button variant="outline" asChild>
                            <Link to="/admin" onClick={() => setIsOpen(false)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Quản trị
                            </Link>
                          </Button>
                        )}
                        {(userData?.role === 'staff' || userData?.role === 'Staff' || userData?.role === 'STAFF' || userData?.userRole === 'staff') && (
                          <Button variant="outline" asChild>
                            <Link to="/staff" onClick={() => setIsOpen(false)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Bảng điều khiển nhân viên
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" asChild>
                          <Link to="/settings" onClick={() => setIsOpen(false)}>
                            <Settings className="w-4 h-4 mr-2" />
                            Cài đặt
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Đăng xuất
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild>
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            <LogIn className="w-4 h-4 mr-2" />
                            Đăng nhập
                          </Link>
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                          asChild
                        >
                          <Link to="/register" onClick={() => setIsOpen(false)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Đăng ký
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
