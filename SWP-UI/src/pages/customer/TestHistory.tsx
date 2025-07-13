import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Download, Eye } from "lucide-react";
import axios from '@/api/axios';
import { testResultAPI, testRequestAPI, sampleAPI } from '@/api/axios';

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
  const navigate = useNavigate();
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        // Lấy userId từ localStorage
        const userData = localStorage.getItem('userData');
        let userId = null;
        if (userData) {
          const parsed = JSON.parse(userData);
          userId = parsed.userId || parsed.id;
        }
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng');
          setLoading(false);
          return;
        }
        // Gọi API lấy lịch sử xét nghiệm
        const response = await testRequestAPI.getByUserId(Number(userId));
        let mapped: any[] = [];
        if (Array.isArray(response)) {
          mapped = await Promise.all(response.map(async (item: any) => {
            let sampleId = null;
            try {
              const sampleRes = await sampleAPI.getByRequestId(item.id || item.requestId || item.testRequestId);
              if (Array.isArray(sampleRes) && sampleRes.length > 0) {
                sampleId = sampleRes[0].id || sampleRes[0].sampleId;
              }
            } catch (e) {
              // Không có sample cũng không sao
            }
            return {
              id: String(item.id || item.requestId || item.testRequestId),
              testName: item.service?.name || 'Chưa rõ',
              date: item.appointmentDate || '',
              status: item.status || '',
              result: item.resultStatus || (item.status === 'Completed' ? 'Có kết quả' : 'Chờ kết quả'),
              price: item.service?.price ? item.service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
              sampleId, // Thêm sampleId vào object
            };
          }));
        }
        setTestHistory(mapped);
      } catch (err: any) {
        setError('Không thể tải dữ liệu lịch sử xét nghiệm');
      } finally {
        setLoading(false);
      }
    };
    fetchTestHistory();
  }, []);

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

  // Thêm hàm xem PDF
  const handleViewPdf = async (id: string) => {
    try {
      const blob = await testResultAPI.viewPdf(Number(id));
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      alert('Không thể xem file PDF!');
    }
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
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/test-result/${test.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    {test.result === "Có kết quả" && (
                      <>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/test-result/${test.id}`)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Tải kết quả
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPdf(test.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem file PDF
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {testHistory.length === 0 && (
            <div className="text-center py-8">
              <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có lịch sử xét nghiệm nào</p>
            </div>
          )}
        </div>
        )}
      </CardContent>
    </Card>
  );
} 