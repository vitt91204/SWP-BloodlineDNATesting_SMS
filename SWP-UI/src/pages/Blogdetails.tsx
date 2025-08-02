import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogAPI } from "@/api/axios";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { feedbackAPI } from "@/api/axios";
export default function Blogdetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogAPI.getById(id); 
        setBlog(data);
        // Lấy ảnh
        if (id) {
          try {
            const blob = await blogAPI.getImage(id);
            setImgUrl(URL.createObjectURL(blob));
          } catch {
            setImgUrl(null);
          }
        }
      } catch (err) {
        setError("Không thể tải bài viết.");
        console.error(err);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({ title: "Vui lòng nhập nhận xét!", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await feedbackAPI.create({ blogPostId: id, comment: feedback });
      toast({ title: "Cảm ơn bạn đã gửi feedback!" });
      setFeedback("");
    } catch (err) {
      toast({ title: "Gửi feedback thất bại!", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <p className="text-red-500 text-center pt-20">{error}</p>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <p className="text-center pt-20">Đang tải bài viết...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2">
              {blog.title}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {`Chuyên gia #${blog.authorId}`}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {(blog.createdAt || "").slice(0, 10)}
              </div>
            </div>
            {imgUrl && (
              <img src={imgUrl} alt="blog" className="w-full h-64 object-cover rounded mt-4" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Feedback Section */}
      <div className="max-w-3xl mx-auto px-4 pb-10">
        <form onSubmit={handleFeedbackSubmit} className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="font-semibold mb-2">Hãy để lại nhận xét hoặc góp ý cho bài viết này!</div>
          <Textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Nhận xét của bạn..."
            rows={4}
            className="mb-4"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi feedback"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

