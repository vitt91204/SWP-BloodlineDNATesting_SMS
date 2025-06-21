import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { ContactSection } from "@/components/ContactSection";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      {/* Hero Section with staggered animations */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fadeIn" delay={100}>
            <Badge className="bg-blue-100 text-blue-700 mb-6">
              Dịch vụ xét nghiệm chuyên nghiệp
            </Badge>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={200}>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Dịch vụ xét nghiệm ADN
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Đa dạng & Chuyên nghiệp
              </span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={300}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá đầy đủ các dịch vụ xét nghiệm ADN từ dân sự đến hành chính, 
              đáp ứng mọi nhu cầu với độ chính xác cao nhất.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services section with slide from left */}
      <ScrollReveal animation="fadeInLeft" delay={100}>
        <ServicesSection />
      </ScrollReveal>
      
      {/* Process section with slide from right */}
      <ScrollReveal animation="fadeInRight" delay={150}>
        <ProcessSection />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}
