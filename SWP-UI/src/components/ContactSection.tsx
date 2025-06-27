import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "123 Đường ABC, Quận 1, TP.HCM",
      color: "blue"
    },
    {
      icon: Phone,
      title: "Hotline",
      content: "1900 1234 (24/7)",
      color: "green"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@dnahealth.vn",
      color: "purple"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "T2-CN: 8:00 - 20:00",
      color: "orange"
    }
  ];

  const quickContact = [
    {
      icon: Phone,
      title: "Gọi điện",
      description: "Tư vấn trực tiếp qua điện thoại",
      action: "Gọi ngay",
      color: "green"
    },
    {
      icon: MessageCircle,
      title: "Chat online",
      description: "Hỗ trợ trực tuyến 24/7",
      action: "Chat ngay",
      color: "blue"
    },
    {
      icon: Mail,
      title: "Gửi email",
      description: "Phản hồi trong vòng 24h",
      action: "Gửi email",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; icon: string } } = {
      blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "bg-blue-100" },
      green: { bg: "bg-green-50", text: "text-green-700", icon: "bg-green-100" },
      purple: { bg: "bg-purple-50", text: "text-purple-700", icon: "bg-purple-100" },
      orange: { bg: "bg-orange-50", text: "text-orange-700", icon: "bg-orange-100" }
    };
    return colorMap[color];
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-700 mb-4">
            Liên hệ với chúng tôi
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kết nối với DNA Health
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn. Hãy liên hệ qua các kênh dưới đây 
            hoặc để lại thông tin để được tư vấn miễn phí.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const colors = getColorClasses(info.color);
                
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      <p className="text-gray-600">
                        {info.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Contact Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Liên hệ nhanh
            </h3>
            {quickContact.map((contact, index) => {
              const Icon = contact.icon;
              const colors = getColorClasses(contact.color);
              
              return (
                <Card key={index} className={`${colors.bg} border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {contact.title}
                        </h4>
                        <p className="text-gray-600 text-xs">
                          {contact.description}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        {contact.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Map Section */}
          <Card className="shadow-lg border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                Bản đồ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Bản đồ vị trí</p>
                  <p className="text-xs">123 Đường ABC, Quận 1, TP.HCM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
