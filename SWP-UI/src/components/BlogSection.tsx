
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

export const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Tìm hiểu về xét nghiệm ADN huyết thống",
      excerpt: "Xét nghiệm ADN huyết thống là gì? Quy trình thực hiện như thế nào? Tất cả những điều bạn cần biết về xét nghiệm này.",
      author: "BS. Nguyễn Văn A",
      date: "15/11/2024",
      category: "Kiến thức ADN",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Hướng dẫn thu mẫu xét nghiệm ADN tại nhà",
      excerpt: "Cách thu mẫu ADN đúng cách tại nhà để đảm bảo kết quả chính xác. Những lưu ý quan trọng khi tự thu mẫu.",
      author: "ThS. Trần Thị B",
      date: "12/11/2024",
      category: "Hướng dẫn",
      readTime: "7 phút đọc",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Xét nghiệm ADN trong pháp luật Việt Nam",
      excerpt: "Vai trò của xét nghiệm ADN trong các vụ việc pháp lý. Quy định của pháp luật về xét nghiệm huyết thống.",
      author: "LS. Lê Văn C",
      date: "10/11/2024",
      category: "Pháp luật",
      readTime: "6 phút đọc",
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Độ chính xác của xét nghiệm ADN hiện tại",
      excerpt: "Công nghệ xét nghiệm ADN hiện đại có độ chính xác như thế nào? Các yếu tố ảnh hưởng đến kết quả xét nghiệm.",
      author: "GS.TS. Phạm Văn D",
      date: "08/11/2024",
      category: "Công nghệ",
      readTime: "8 phút đọc",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const categories = [
    { name: "Kiến thức ADN", count: 12, color: "blue" },
    { name: "Hướng dẫn", count: 8, color: "green" },
    { name: "Pháp luật", count: 6, color: "purple" },
    { name: "Công nghệ", count: 4, color: "orange" }
  ];

  const getCategoryColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700"
    };
    return colorMap[color] || "bg-gray-100 text-gray-700";
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-orange-100 text-orange-700 mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Blog & Kiến thức
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Chia sẻ kiến thức & kinh nghiệm ADN
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cập nhật những kiến thức mới nhất về xét nghiệm ADN, hướng dẫn thực hiện 
            và các thông tin hữu ích khác từ đội ngũ chuyên gia.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-700">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {post.readTime}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full group">
                      Đọc thêm
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="px-8">
                Xem thêm bài viết
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Chủ đề
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.color).split(' ')[0]}`}></div>
                      <span className="text-gray-700 font-medium">{category.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-blue-600 to-green-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Đăng ký nhận tin
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Nhận những thông tin mới nhất về xét nghiệm ADN
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50"
                />
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-50">
                  Đăng ký
                </Button>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Bài viết nổi bật
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
