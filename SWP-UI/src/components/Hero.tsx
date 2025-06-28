import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TestTube, Shield, Clock, Award, ChevronRight } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-16 pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-green-500/10 to-blue-500/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                <TestTube className="w-4 h-4 mr-2" />
                Xét nghiệm ADN huyết thống
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Xét nghiệm ADN
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                  Chính xác & Nhanh chóng
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Cung cấp dịch vụ xét nghiệm ADN huyết thống chuyên nghiệp với độ chính xác cao. 
                Hỗ trợ thu mẫu tại nhà và tại cơ sở y tế.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600">Độ chính xác</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">5-7</div>
                <div className="text-sm text-gray-600">Ngày có kết quả</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-gray-600">Khách hàng</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8"
                onClick={() => navigate('/booking')}
              >
                Đặt lịch xét nghiệm
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Tư vấn miễn phí
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bảo mật tuyệt đối</h3>
                <p className="text-gray-600">Thông tin cá nhân và kết quả được bảo mật theo tiêu chuẩn quốc tế</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nhanh chóng</h3>
                <p className="text-gray-600">Kết quả chính xác trong 5-7 ngày làm việc</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chứng nhận</h3>
                <p className="text-gray-600">Phòng xét nghiệm đạt tiêu chuẩn ISO 15189</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TestTube className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Thu mẫu linh hoạt</h3>
                <p className="text-gray-600">Thu mẫu tại nhà hoặc tại cơ sở y tế theo yêu cầu</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
