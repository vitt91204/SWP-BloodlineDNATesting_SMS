import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Package, 
  TestTube, 
  Truck, 
  Microscope, 
  FileText, 
  Home,
  Building2,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

export const ProcessSection = () => {
  const homeTestingSteps = [
    {
      step: 1,
      icon: Calendar,
      title: "Đăng ký đặt hẹn",
      description: "Đăng ký dịch vụ xét nghiệm ADN trực tuyến, chọn ngày giờ phù hợp",
      details: [
        "Chọn loại xét nghiệm",
        "Cung cấp thông tin cá nhân",
        "Chọn thời gian nhận kit"
      ],
      timeframe: "5-10 phút"
    },
    {
      step: 2,
      icon: Package,
      title: "Nhận bộ kit xét nghiệm",
      description: "Bộ kit xét nghiệm được giao tận nhà theo lịch hẹn",
      details: [
        "Kit thu mẫu chuyên dụng",
        "Hướng dẫn chi tiết",
        "Phiếu thông tin mẫu"
      ],
      timeframe: "1-2 ngày"
    },
    {
      step: 3,
      icon: TestTube,
      title: "Thu thập mẫu xét nghiệm",
      description: "Tự thu mẫu tại nhà theo hướng dẫn trong kit",
      details: [
        "Làm theo hướng dẫn",
        "Dán nhãn mẫu chính xác",
        "Bảo quản mẫu đúng cách"
      ],
      timeframe: "15-30 phút"
    },
    {
      step: 4,
      icon: Truck,
      title: "Chuyển mẫu đến cơ sở",
      description: "Đóng gói và gửi mẫu về phòng xét nghiệm",
      details: [
        "Đóng gói theo hướng dẫn",
        "Vận chuyển nhanh",
        "Theo dõi tiến độ"
      ],
      timeframe: "1-2 ngày"
    },
    {
      step: 5,
      icon: Microscope,
      title: "Thực hiện xét nghiệm",
      description: "Phân tích mẫu và ghi nhận kết quả tại phòng xét nghiệm",
      details: [
        "Phân tích chuyên sâu",
        "Kiểm tra chất lượng",
        "Xác nhận kết quả"
      ],
      timeframe: "3-5 ngày"
    },
    {
      step: 6,
      icon: FileText,
      title: "Trả kết quả xét nghiệm",
      description: "Nhận kết quả qua hệ thống trực tuyến hoặc bản cứng",
      details: [
        "Kết quả trực tuyến",
        "Báo cáo chi tiết",
        "Tư vấn kết quả"
      ],
      timeframe: "Ngay sau khi có KQ"
    }
  ];

  const facilityTestingSteps = [
    {
      step: 1,
      icon: Calendar,
      title: "Đăng ký đặt hẹn",
      description: "Đăng ký dịch vụ và đặt lịch hẹn đến cơ sở y tế",
      details: [
        "Chọn loại xét nghiệm",
        "Đặt lịch hẹn",
        "Chuẩn bị giấy tờ"
      ],
      timeframe: "5-10 phút"
    },
    {
      step: 2,
      icon: Building2,
      title: "Thu mẫu tại cơ sở",
      description: "Nhân viên y tế thu mẫu và cập nhật thông tin",
      details: [
        "Xác minh danh tính",
        "Thu mẫu chuyên nghiệp",
        "Cập nhật hồ sơ"
      ],
      timeframe: "30-60 phút"
    },
    {
      step: 3,
      icon: Microscope,
      title: "Thực hiện xét nghiệm",
      description: "Xử lý và phân tích mẫu tại phòng xét nghiệm",
      details: [
        "Xử lý mẫu ngay",
        "Phân tích ADN",
        "Kiểm tra chất lượng"
      ],
      timeframe: "5-7 ngày"
    },
    {
      step: 4,
      icon: FileText,
      title: "Trả kết quả",
      description: "Thông báo và trả kết quả cho khách hàng",
      details: [
        "Thông báo qua SMS/Email",
        "Nhận kết quả trực tiếp",
        "Tư vấn miễn phí"
      ],
      timeframe: "Ngay sau khi có KQ"
    }
  ];

  const ProcessStep = ({ step, isLast = false }: { step: any; isLast?: boolean }) => {
    const Icon = step.icon;
    
    return (
      <div className="relative">
        <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className="text-xs">
                Bước {step.step}
              </Badge>
            </div>
            <CardTitle className="text-lg text-gray-900">
              {step.title}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {step.description}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-blue-600">
                <Clock className="w-4 h-4 mr-2" />
                {step.timeframe}
              </div>
              
              <ul className="space-y-2">
                {step.details.map((detail: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {!isLast && (
          <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
            <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-700 mb-4">
            Quy trình xét nghiệm
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Quy trình xét nghiệm ADN
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi có 2 hình thức xét nghiệm linh hoạt để phục vụ nhu cầu đa dạng của khách hàng
          </p>
        </div>

        {/* Process Tabs */}
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Thu mẫu tại nhà</span>
            </TabsTrigger>
            <TabsTrigger value="facility" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Thu mẫu tại cơ sở</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thu mẫu tại nhà (Dịch vụ ADN dân sự)
              </h3>
              <p className="text-gray-600">
                Tiện lợi và riêng tư - thực hiện xét nghiệm từ sự thoải mái của ngôi nhà bạn
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {homeTestingSteps.map((step, index) => (
                <ProcessStep 
                  key={step.step} 
                  step={step} 
                  isLast={index === homeTestingSteps.length - 1}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facility" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thu mẫu tại cơ sở y tế
              </h3>
              <p className="text-gray-600">
                Chuyên nghiệp và đảm bảo - thực hiện bởi đội ngũ y tế giàu kinh nghiệm
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {facilityTestingSteps.map((step, index) => (
                <ProcessStep 
                  key={step.step} 
                  step={step} 
                  isLast={index === facilityTestingSteps.length - 1}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Bắt đầu quy trình xét nghiệm ADN ngay hôm nay
            </h3>
            <p className="text-gray-600 mb-6">
              Chọn hình thức phù hợp với bạn và bắt đầu hành trình tìm hiểu về mối quan hệ huyết thống
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600">
                  Đặt lịch thu mẫu tại nhà
                </Button>
              </Link>
              <Link to="/booking">
                <Button size="lg" variant="outline">
                  Đặt lịch hẹn tại cơ sở
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};