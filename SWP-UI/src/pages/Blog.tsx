import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogSection } from "@/components/BlogSection";
import { Badge } from "@/components/ui/badge";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-orange-100 text-orange-700 mb-6">
            Blog & Kiến thức chuyên môn
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Kiến thức & Kinh nghiệm
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              Về xét nghiệm ADN
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cập nhật những thông tin mới nhất về xét nghiệm ADN, hướng dẫn thực hiện 
            và chia sẻ kiến thức từ đội ngũ chuyên gia hàng đầu.
          </p>
        </div>
      </section>

      <BlogSection />
      <Footer />
    </div>
  );
}
