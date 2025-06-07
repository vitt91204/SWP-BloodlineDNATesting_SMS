
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Users, Building, Microscope, Shield, Clock } from "lucide-react";

export const AboutSection = () => {
  const achievements = [
    {
      icon: Award,
      title: "Chứng nhận ISO 15189",
      description: "Phòng xét nghiệm đạt tiêu chuẩn quốc tế về chất lượng"
    },
    {
      icon: Users,
      title: "10,000+ Khách hàng",
      description: "Phục vụ hàng ngàn khách hàng tin tưởng trên toàn quốc"
    },
    {
      icon: Building,
      title: "15+ Năm kinh nghiệm",
      description: "Đi đầu trong lĩnh vực xét nghiệm ADN tại Việt Nam"
    },
    {
      icon: Microscope,
      title: "Công nghệ hiện đại",
      description: "Trang bị máy móc và công nghệ xét nghiệm tiên tiến nhất"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description: "Thông tin và kết quả được bảo mật theo tiêu chuẩn quốc tế, đảm bảo riêng tư cho khách hàng"
    },
    {
      icon: Clock,
      title: "Nhanh chóng chính xác",
      description: "Kết quả xét nghiệm trong 5-7 ngày với độ chính xác lên đến 99.99%"
    },
    {
      icon: Users,
      title: "Đội ngũ chuyên gia",
      description: "Bác sĩ và kỹ thuật viên giàu kinh nghiệm, được đào tạo chuyên sâu"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-700 mb-4">
            Về chúng tôi
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            DNA Health - Đơn vị xét nghiệm ADN hàng đầu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Với hơn 15 năm kinh nghiệm trong lĩnh vực xét nghiệm ADN, chúng tôi cam kết mang đến 
            dịch vụ chất lượng cao nhất với độ chính xác tuyệt đối.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Sứ mệnh của chúng tôi
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                DNA Health được thành lập với sứ mệnh cung cấp các dịch vụ xét nghiệm ADN 
                chính xác, nhanh chóng và đáng tin cậy. Chúng tôi hiểu rằng mỗi xét nghiệm 
                không chỉ là một con số, mà là câu trả lời cho những câu hỏi quan trọng 
                trong cuộc sống của mỗi gia đình.
              </p>
              <p className="text-lg text-gray-600">
                Với đội ngũ chuyên gia giàu kinh nghiệm và trang thiết bị hiện đại, 
                chúng tôi cam kết mang đến sự an tâm và tin cậy cho mỗi khách hàng.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600">
              Tìm hiểu thêm về chúng tôi
            </Button>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.99%</div>
              <div className="text-blue-100">Độ chính xác</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Khách hàng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5-7</div>
              <div className="text-blue-100">Ngày có kết quả</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
