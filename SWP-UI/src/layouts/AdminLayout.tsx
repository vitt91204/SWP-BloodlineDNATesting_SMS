// import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Calendar,
  LogOut,
  Home,
  Package,
  TestTube,
  BarChart3,
  Microscope,
  TrendingUp,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp
  },
  {
    name: "Khách hàng",
    href: "/admin/customers",
    icon: Users
  },
  {
    name: "Lịch hẹn",
    href: "/admin/appointments",
    icon: Calendar
  },
  // {
  //   name: "Quản lý mẫu",
  //   href: "/admin/samples",
  //   icon: TestTube
  // },
  // {
  //   name: "Kết quả xét nghiệm",
  //   href: "/admin/test-results",
  //   icon: BarChart3
  // },
  {
    name: "Quản lý loại dịch vụ",
    href: "/admin/test-services",
    icon: Settings
  },
  {
    name: "Quản lý bộ kit",
    href: "/admin/test-kits",
    icon: Package
  },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Xóa thông tin đăng nhập từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminSession');
    
    // Xóa thông tin từ sessionStorage (nếu có)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('adminSession');
    
    // Hiển thị thông báo
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống admin",
    });
    
    // Chuyển hướng về trang đăng nhập
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center border-b border-sidebar-border px-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-sidebar-foreground">DNA Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="grid gap-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all
                      ${
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4 space-y-2">
            {/* Nút về trang chủ */}
            <Link to="/">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:bg-sidebar-accent/50"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>

            {/* Nút đăng xuất */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:bg-sidebar-accent/50"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị? 
                    Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Đăng xuất
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-background">   
        <Outlet />
      </div>
    </div>
  );
};