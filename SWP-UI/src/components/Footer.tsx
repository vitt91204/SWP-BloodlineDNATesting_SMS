
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Microscope, MapPin, Phone, Mail, Facebook, Youtube, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const footerSections = [
    {
      title: "Dịch vụ",
      links: [
        { name: "Xét nghiệm huyết thống dân sự", href: "/services/civil" },
        { name: "Xét nghiệm huyết thống hành chính", href: "/services/legal" },
      ]
    },
    {
      title: "Hỗ trợ",
      links: [
        { name: "Hướng dẫn thu mẫu", href: "/guide/sampling" },
        { name: "Tra cứu kết quả", href: "/results" },
        { name: "Câu hỏi thường gặp", href: "/faq" },
        { name: "Chính sách bảo mật", href: "/privacy" },
      ]
    },
    {
      title: "Về chúng tôi",
      links: [
        { name: "Giới thiệu", href: "/about" },
        { name: "Đội ngũ chuyên gia", href: "/team" },
        { name: "Chứng nhận chất lượng", href: "/certifications" },
        { name: "Tuyển dụng", href: "/careers" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Microscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DNA Health</h1>
                <p className="text-sm text-gray-400">Xét nghiệm ADN chuyên nghiệp</p>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Đơn vị xét nghiệm ADN huyết thống hàng đầu Việt Nam với hơn 15 năm kinh nghiệm. 
              Cam kết mang đến kết quả chính xác 99.99% và dịch vụ tốt nhất cho khách hàng.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Hotline: 1900 1234 (24/7)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-gray-300">info@dnahealth.vn</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 border-gray-600 hover:border-blue-400 hover:bg-blue-400/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 border-gray-600 hover:border-red-400 hover:bg-red-400/10">
                <Youtube className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 border-gray-600 hover:border-yellow-400 hover:bg-yellow-400/10">
                <Zap className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-700" />

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2024 DNA Health. Bảo lưu mọi quyền.
          </div>
          
          <div className="flex flex-wrap items-center space-x-6 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Chính sách Cookie
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Được phát triển tại Việt Nam</span>   
          </div>
        </div>
      </div>
    </footer>
  );
};
