import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ContactSection } from "@/components/ContactSection";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Badge } from "@/components/ui/badge";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fadeIn" delay={100}>
            <Badge className="bg-green-100 text-green-700 mb-6">
              Liên hệ hỗ trợ 24/7
            </Badge>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={200}>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Liên hệ với chúng tôi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Hỗ trợ chuyên nghiệp
              </span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={300}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. 
              Liên hệ ngay để được tư vấn miễn phí về dịch vụ xét nghiệm ADN.
            </p>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Contact section with fade in from left */}
      <ScrollReveal animation="fadeInLeft" delay={100}>
        <ContactSection />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}