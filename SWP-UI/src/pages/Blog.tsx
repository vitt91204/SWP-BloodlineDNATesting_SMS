import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogSection } from "@/components/BlogSection";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with staggered animations */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="fadeIn" delay={100}>
            <Badge className="bg-orange-100 text-orange-700 mb-6">
              Blog & Kiến thức chuyên môn
            </Badge>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={200}>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Kiến thức & Kinh nghiệm
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Về xét nghiệm ADN
              </span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fadeInUp" delay={300}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cập nhật những thông tin mới nhất về xét nghiệm ADN, hướng dẫn thực hiện 
              và chia sẻ kiến thức từ đội ngũ chuyên gia hàng đầu.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog section with scale in animation */}
      <ScrollReveal animation="scaleIn" delay={150}>
        <BlogSection />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}
