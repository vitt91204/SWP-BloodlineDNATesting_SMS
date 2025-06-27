import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const BlogSection = ({ blogs = [] }) => {
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

        {/* Blog Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {blogs.map((post) => (
            <Card
              key={post.id}
              className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title || "Không có tiêu đề"}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">
                  {(post.content || "").slice(0, 100)}...
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {`Chuyên gia #${post.authorId ?? "?"}`}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {(post.createdAt || "").slice(0, 10)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">5 phút đọc</div>
                </div>

                <Link to={`/blog/${post.id}`}>
                  <Button variant="outline" className="w-full group">
                    Đọc thêm
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
