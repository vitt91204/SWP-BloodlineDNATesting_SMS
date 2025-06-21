import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Star, MessageSquare, Send } from "lucide-react";

interface Feedback {
  id: string;
  serviceType: string;
  rating: number;
  comment: string;
  date: string;
  status: "Đã gửi" | "Đã phản hồi";
  adminReply?: string;
}

export default function Feedback() {
  const { toast } = useToast();
  
  // Feedback states
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: "FB001",
      serviceType: "Xét nghiệm huyết thống dân sự",
      rating: 5,
      comment: "Dịch vụ rất tốt, nhân viên chu đáo và kết quả nhanh chóng. Tôi rất hài lòng với chất lượng dịch vụ.",
      date: "2024-02-15",
      status: "Đã phản hồi",
      adminReply: "Cảm ơn bạn đã đánh giá. Chúng tôi sẽ tiếp tục cải thiện chất lượng dịch vụ."
    },
    {
      id: "FB002", 
      serviceType: "Xét nghiệm huyết thống pháp y",
      rating: 4,
      comment: "Dịch vụ tốt nhưng thời gian chờ kết quả hơi lâu.",
      date: "2024-03-10",
      status: "Đã gửi"
    }
  ]);
  
  const [newFeedback, setNewFeedback] = useState({
    serviceType: "",
    rating: 0,
    comment: ""
  });

  // Feedback functions
  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmitFeedback = () => {
    if (!newFeedback.serviceType || !newFeedback.rating || !newFeedback.comment.trim()) {
      toast({
        variant: "destructive",
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Hãy chọn dịch vụ, đánh giá sao và viết nhận xét.",
      });
      return;
    }

    const feedback: Feedback = {
      id: `FB${String(feedbacks.length + 1).padStart(3, '0')}`,
      serviceType: newFeedback.serviceType,
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      date: new Date().toISOString().split('T')[0],
      status: "Đã gửi"
    };

    setFeedbacks(prev => [feedback, ...prev]);
    setNewFeedback({ serviceType: "", rating: 0, comment: "" });
    
    toast({
      title: "Gửi đánh giá thành công",
      description: "Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi!",
    });
  };

  const getFeedbackStatusBadge = (status: string) => {
    return status === "Đã phản hồi" ? (
      <Badge className="bg-green-100 text-green-700">Đã phản hồi</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-700">Đã gửi</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Form gửi feedback mới */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Gửi đánh giá dịch vụ
          </CardTitle>
          <CardDescription>
            Chia sẻ trải nghiệm của bạn để chúng tôi cải thiện dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="serviceType">Loại dịch vụ</Label>
            <select
              id="serviceType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newFeedback.serviceType}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, serviceType: e.target.value }))}
            >
              <option value="">Chọn loại dịch vụ</option>
              <option value="Xét nghiệm huyết thống dân sự">Xét nghiệm huyết thống dân sự</option>
              <option value="Xét nghiệm huyết thống pháp y">Xét nghiệm huyết thống pháp y</option>
              <option value="Xét nghiệm ADN xác định giới tính thai nhi">Xét nghiệm ADN xác định giới tính thai nhi</option>
              <option value="Xét nghiệm ADN xác định tổ tiên">Xét nghiệm ADN xác định tổ tiên</option>
              <option value="Dịch vụ tư vấn">Dịch vụ tư vấn</option>
              <option value="Dịch vụ lấy mẫu tại nhà">Dịch vụ lấy mẫu tại nhà</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Đánh giá</Label>
            <div className="flex items-center gap-2">
              {renderStars(newFeedback.rating, true, (rating) => 
                setNewFeedback(prev => ({ ...prev, rating }))
              )}
              <span className="text-sm text-gray-600 ml-2">
                {newFeedback.rating > 0 ? `${newFeedback.rating} sao` : 'Chưa đánh giá'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Nhận xét</Label>
            <Textarea
              id="comment"
              placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
            />
          </div>

          <Button onClick={handleSubmitFeedback} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Gửi đánh giá
          </Button>
        </CardContent>
      </Card>

      {/* Danh sách feedback đã gửi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Đánh giá đã gửi
          </CardTitle>
          <CardDescription>
            Lịch sử các đánh giá dịch vụ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{feedback.serviceType}</h3>
                      <p className="text-sm text-gray-600 mt-1">Mã: {feedback.id}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-gray-600">{feedback.rating} sao</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {getFeedbackStatusBadge(feedback.status)}
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(feedback.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Nhận xét:</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{feedback.comment}</p>
                    </div>
                    
                    {feedback.adminReply && (
                      <div>
                        <p className="text-sm font-medium text-blue-700 mb-1">Phản hồi từ quản trị viên:</p>
                        <p className="text-gray-900 bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                          {feedback.adminReply}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {feedbacks.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có đánh giá nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 