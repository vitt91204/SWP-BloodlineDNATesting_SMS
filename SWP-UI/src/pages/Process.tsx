import { Footer } from "@/components/Footer";
import { ProcessSection } from "@/components/ProcessSection";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function Process() {
  return (  
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      {/* Hero Section with staggered animations */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ScrollReveal animation="fadeIn" delay={100}>
            <Badge className="bg-blue-100 text-blue-700 mb-6">
              Quy trình xét nghiệm chuyên nghiệp
            </Badge>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={200}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Quy Trình Xét Nghiệm ADN
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Chuyên Nghiệp & Tin Cậy
              </span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={300}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Khám phá quy trình xét nghiệm ADN tiên tiến và chuyên nghiệp của chúng tôi, 
              từ thu mẫu đến phân tích kết quả với độ chính xác tuyệt đối
            </p>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Process section with slide from right */}
      <ScrollReveal animation="fadeInRight" delay={150}>
        <ProcessSection />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}