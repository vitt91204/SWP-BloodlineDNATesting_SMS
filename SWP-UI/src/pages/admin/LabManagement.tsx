import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TestTube, 
  FileText, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Package,
  Microscope
} from "lucide-react";
import { Link } from "react-router-dom";
import { labAPI } from "@/api/axios";

interface LabStats {
  totalSamples: number;
  pendingSamples: number;
  processingSamples: number;
  completedSamples: number;
  totalResults: number;
  pendingResults: number;
  completedResults: number;
  deliveredResults: number;
  averageProcessingTime: number;
  qualityScore: number;
  technicianCount: number;
  activeKits: number;
}

const sampleStats: LabStats = {
  totalSamples: 156,
  pendingSamples: 23,
  processingSamples: 45,
  completedSamples: 88,
  totalResults: 142,
  pendingResults: 18,
  completedResults: 124,
  deliveredResults: 98,
  averageProcessingTime: 3.2,
  qualityScore: 94.5,
  technicianCount: 8,
  activeKits: 12
};

export default function LabManagement() {
  const [stats, setStats] = useState<LabStats>(sampleStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lab stats from API
  useEffect(() => {
    const fetchLabStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await labAPI.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        console.error("Error fetching lab stats:", err);
        setError(`Không thể tải thống kê phòng lab: ${err.message || 'Lỗi kết nối API'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchLabStats();
  }, []);

  const getSampleProgress = () => {
    return (stats.completedSamples / stats.totalSamples) * 100;
  };

  const getResultProgress = () => {
    return (stats.completedResults / stats.totalResults) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý phòng lab</h1>
        <p className="text-gray-600">Tổng quan về hoạt động phòng xét nghiệm</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng mẫu</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSamples}</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kết quả hoàn thành</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedResults}</div>
            <p className="text-xs text-muted-foreground">
              +8% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProcessingTime} ngày</div>
            <p className="text-xs text-muted-foreground">
              -0.5 ngày so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm chất lượng</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualityScore}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Tiến độ xử lý mẫu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Hoàn thành</span>
              <span className="text-sm text-gray-600">{stats.completedSamples}/{stats.totalSamples}</span>
            </div>
            <Progress value={getSampleProgress()} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingSamples}</div>
                <div className="text-xs text-gray-600">Chờ xử lý</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.processingSamples}</div>
                <div className="text-xs text-gray-600">Đang xử lý</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.completedSamples}</div>
                <div className="text-xs text-gray-600">Hoàn thành</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Tiến độ kết quả
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Hoàn thành</span>
              <span className="text-sm text-gray-600">{stats.completedResults}/{stats.totalResults}</span>
            </div>
            <Progress value={getResultProgress()} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingResults}</div>
                <div className="text-xs text-gray-600">Chờ phân tích</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.completedResults}</div>
                <div className="text-xs text-gray-600">Hoàn thành</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.deliveredResults}</div>
                <div className="text-xs text-gray-600">Đã gửi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Nhân viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.technicianCount}</div>
            <p className="text-sm text-gray-600">Kỹ thuật viên đang làm việc</p>
            <Button className="w-full mt-4" asChild>
              <Link to="/admin/customers">Quản lý nhân viên</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Bộ kit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeKits}</div>
            <p className="text-sm text-gray-600">Bộ kit đang hoạt động</p>
            <Button className="w-full mt-4" asChild>
              <Link to="/admin/test-kits">Quản lý bộ kit</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Mẫu xét nghiệm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSamples}</div>
            <p className="text-sm text-gray-600">Mẫu đang xử lý</p>
            <Button className="w-full mt-4" asChild>
              <Link to="/admin/samples">Quản lý mẫu</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="w-5 h-5" />
              Kết quả
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResults}</div>
            <p className="text-sm text-gray-600">Kết quả đã tạo</p>
            <Button className="w-full mt-4" asChild>
              <Link to="/admin/test-results">Quản lý kết quả</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Hoàn thành xét nghiệm XN001</p>
                <p className="text-sm text-gray-600">Kết quả đã được phê duyệt và gửi cho khách hàng</p>
              </div>
              <span className="text-sm text-gray-500">2 giờ trước</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <TestTube className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">Nhận mẫu mới SMP023</p>
                <p className="text-sm text-gray-600">Mẫu từ khách hàng Nguyễn Văn C đã được nhận</p>
              </div>
              <span className="text-sm text-gray-500">4 giờ trước</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium">Cần kiểm tra chất lượng</p>
                <p className="text-sm text-gray-600">Mẫu SMP020 cần kiểm tra lại chất lượng</p>
              </div>
              <span className="text-sm text-gray-500">6 giờ trước</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium">Cập nhật tiến độ</p>
                <p className="text-sm text-gray-600">5 mẫu đã chuyển sang giai đoạn phân tích</p>
              </div>
              <span className="text-sm text-gray-500">8 giờ trước</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 