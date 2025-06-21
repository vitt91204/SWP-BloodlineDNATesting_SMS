import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Download, Eye } from "lucide-react";

interface TestHistory {
  id: string;
  testName: string;
  date: string;
  status: string;
  result: string;
  price: string;
}

type StatusType = "Hoàn thành" | "Đang xử lý" | "Đã lấy mẫu" | "Hủy";
type ResultType = "Có kết quả" | "Chờ kết quả" | "Đang phân tích";

export default function TestHistory() {
  // Dữ liệu lịch sử xét nghiệm mẫu
  const [testHistory] = useState<TestHistory[]>([
    {
      id: "XN001",
      testName: "Xét nghiệm huyết thống dân sự",
      date: "2024-01-15",
      status: "Hoàn thành",
      result: "Có kết quả",
      price: "3,500,000 VNĐ"
    },
    {
      id: "XN002", 
      testName: "Xét nghiệm huyết thống pháp y",
      date: "2024-02-20",
      status: "Đang xử lý",
      result: "Chờ kết quả",
      price: "5,000,000 VNĐ"
    },
    {
      id: "XN003",
      testName: "Xét nghiệm ADN xác định giới tính thai nhi",
      date: "2024-03-10",
      status: "Đã lấy mẫu",
      result: "Đang phân tích",
      price: "2,500,000 VNĐ"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<StatusType, { variant: string; className: string }> = {
      "Hoàn thành": { variant: "default", className: "bg-green-100 text-green-800" },
      "Đang xử lý": { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      "Đã lấy mẫu": { variant: "outline", className: "bg-blue-100 text-blue-800" },
      "Hủy": { variant: "destructive", className: "bg-red-100 text-red-800" }
    };
    const config = statusConfig[status as StatusType] || { variant: "default", className: "" };
    return <Badge className={config.className}>{status}</Badge>;
  };

  const getResultBadge = (result: string) => {
    const resultConfig: Record<ResultType, { className: string }> = {
      "Có kết quả": { className: "bg-green-100 text-green-800" },
      "Chờ kết quả": { className: "bg-yellow-100 text-yellow-800" },
      "Đang phân tích": { className: "bg-blue-100 text-blue-800" }
    };
    const config = resultConfig[result as ResultType] || { className: "bg-gray-100 text-gray-800" };
    return <Badge className={config.className}>{result}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Lịch sử xét nghiệm
        </CardTitle>
        <CardDescription>
          Danh sách các lần xét nghiệm của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testHistory.map((test) => (
            <Card key={test.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{test.testName}</h3>
                    <p className="text-sm text-gray-600 mt-1">Mã: {test.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{test.price}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(test.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    {getStatusBadge(test.status)}
                    {getResultBadge(test.result)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    {test.result === "Có kết quả" && (
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Tải kết quả
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {testHistory.length === 0 && (
          <div className="text-center py-8">
            <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có lịch sử xét nghiệm nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 