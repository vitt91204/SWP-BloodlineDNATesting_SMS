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
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { blogAPI } from "@/api/axios";

export const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogAPI.getAll();
        setBlogs(data);
      } catch (error) {
        toast({ title: "Lỗi khi lấy blog!", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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
        {loading ? (
          <div className="text-center py-10 text-gray-500">Đang tải blog...</div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {blogs.map((post) => {
              const blogId = post.postId;
              return (
                <Card
                  key={blogId || Math.random()}
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
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          {post.viewCount ?? 0} lượt xem
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">5 phút đọc</div>
                    </div>

                    {blogId ? (
                      <Link to={`/blog/${blogId}`}>
                        <Button variant="outline" className="w-full group">
                          Đọc thêm
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Không có ID bài viết
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
