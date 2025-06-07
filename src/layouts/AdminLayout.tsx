// import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Calendar,
  LogOut,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    name: "Khách hàng",
    href: "/admin/customers",
    icon: Users
  },
  {
    name: "Đơn xét nghiệm",
    href: "/admin/tests",
    icon: FileText
  },
  {
    name: "Lịch hẹn",
    href: "/admin/appointments",
    icon: Calendar
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings
  }
];

export const AdminLayout = () => {
  const location = useLocation();

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
          <div className="border-t border-sidebar-border p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:bg-sidebar-accent/50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
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