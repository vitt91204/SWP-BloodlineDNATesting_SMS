import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Star, MessageSquare, Send, Pencil } from "lucide-react";
import { feedbackAPI } from "@/api/axios";

interface FeedbackProps {
  selectedRequestId?: number;
}

export default function FeedbackPage({ selectedRequestId }: FeedbackProps) {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [newFeedback, setNewFeedback] = useState({
    requestId: selectedRequestId || 0,
    rating: 0,
    comment: ""
  });

  const userId = JSON.parse(localStorage.getItem("userData") || "{}")?.id;

  const fetchFeedbacks = async () => {
    try {
      const data = await feedbackAPI.getByUserId(userId);
      setFeedbacks(data);
    } catch (err) {
      console.error("Lỗi khi tải feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRate && onRate(i)}
        />
      ))}
    </div>
  );

  const handleSubmit = async () => {
    if (!newFeedback.requestId || !newFeedback.rating || !newFeedback.comment.trim()) {
      return toast({ variant: "destructive", title: "Vui lòng nhập đầy đủ thông tin" });
    }

    try {
      await feedbackAPI.create({
        userId: userId,
        requestId: newFeedback.requestId,
        rating: newFeedback.rating,
        comment: newFeedback.comment
      });
      toast({ title: "Đánh giá đã được gửi" });
      setNewFeedback({ requestId: selectedRequestId || 0, rating: 0, comment: "" });
      setShowForm(false);
      fetchFeedbacks();
    } catch (err) {
      toast({ variant: "destructive", title: "Gửi thất bại" });
    }
  };

  const handleUpdate = async (fb: any) => {
    try {
      await feedbackAPI.update(fb.feedbackId, {
        userId: fb.userId,
        requestId: fb.requestId,
        rating: fb.rating,
        comment: fb.comment,
        response: fb.response || ""
      });
      toast({ title: "Đã cập nhật đánh giá" });
      setEditingId(null);
      fetchFeedbacks();
    } catch (err) {
      toast({ variant: "destructive", title: "Không thể cập nhật" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Form gửi feedback mới */}
      {showForm && (
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Gửi đánh giá dịch vụ
          </CardTitle>
          <CardDescription>Chia sẻ trải nghiệm của bạn để chúng tôi cải thiện dịch vụ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Mã yêu cầu xét nghiệm</Label>
            <Input
              type="number"
              value={newFeedback.requestId || ""}
              onChange={(e) => setNewFeedback((prev) => ({ ...prev, requestId: parseInt(e.target.value) || 0 }))}
              placeholder="Nhập mã yêu cầu xét nghiệm"
              className="w-full"
            />
            {selectedRequestId && (
              <p className="text-sm text-gray-500 mt-1">
                Đang đánh giá cho yêu cầu: {selectedRequestId}
              </p>
            )}
          </div>
          <div>
            <Label>Đánh giá</Label>
            {renderStars(newFeedback.rating, true, (r) =>
              setNewFeedback((prev) => ({ ...prev, rating: r }))
            )}
          </div>
          <div>
            <Label>Nhận xét</Label>
            <Textarea
              rows={4}
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </div>
          <Button onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            Gửi đánh giá
          </Button>
        </CardContent>
        </Card>
      )}

      {/* Nút hiển thị form nếu đã ẩn */}
      {!showForm && (
        <div className="flex justify-center mb-4">
          <Button 
            onClick={() => setShowForm(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Gửi đánh giá mới
          </Button>
        </div>
      )}

      {/* Danh sách feedback đã gửi */}
      {feedbacks.map((fb) => (
        <Card key={fb.feedbackId} className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Yêu cầu xét nghiệm #{fb.requestId}</h3>
                <p className="text-sm text-gray-500">Mã feedback: {fb.feedbackId}</p>
              </div>
              <div className="text-right">
                <Badge className={fb.response ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                  {fb.response ? "Đã phản hồi" : "Đã gửi"}
                </Badge>
                <p className="text-sm text-gray-400">{fb.createdAt?.slice(0, 10)}</p>
              </div>
            </div>

            {editingId === fb.feedbackId && !fb.response ? (
              <>
                <Label>Sửa nhận xét</Label>
                <Textarea
                  value={fb.comment}
                  onChange={(e) =>
                    setFeedbacks((prev) =>
                      prev.map((f) => (f.feedbackId === fb.feedbackId ? { ...f, comment: e.target.value } : f))
                    )
                  }
                />
                {renderStars(fb.rating, true, (r) =>
                  setFeedbacks((prev) =>
                    prev.map((f) => (f.feedbackId === fb.feedbackId ? { ...f, rating: r } : f))
                  )
                )}
                <Button onClick={() => handleUpdate(fb)}>Lưu thay đổi</Button>
              </>
            ) : (
              <>
                <p className="bg-gray-100 rounded-md p-3">{fb.comment}</p>
                {renderStars(fb.rating)}
                {fb.response && (
                  <div className="mt-2 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <strong>Phản hồi từ quản trị:</strong>
                    <p>{fb.response}</p>
                  </div>
                )}
                {!fb.response && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(fb.feedbackId)}
                    className="mt-2"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
