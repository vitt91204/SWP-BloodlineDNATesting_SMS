import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Download, Eye, CreditCard, Calendar, User, FileText, MessageSquare, CheckCircle, Package } from "lucide-react";
import axios from '@/api/axios';
import { testResultAPI, testRequestAPI, sampleAPI } from '@/api/axios';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Feedback from "./Feedback";
import { translateCollectionType } from "@/lib/utils";

interface TestHistory {
  id: string;
  requestId: number;
  testName: string;
  date: string;
  status: string;
  result: string;
  price: string;
  userFullName: string;
  serviceName: string;
  collectionType: string;
  slotTime: string;
  staffId: number;
  isMatch?: boolean; // Thêm trường isMatch
  payment?: {
    paymentId: number;
    requestId: number;
    method: string;
    amount: number;
    status: string;
    paidAt: string;
    token: string;
  };
  sample?: {
    sampleId: number;
    requestId: number;
    collectedBy: number;
    collectionTime: string;
    receivedTime: string;
    status: string;
    sampleType: string;
    relationship: string;
  };
  subSamples?: Array<{
    subSampleId: number;
    sampleId: number;
    description: string;
    createdAt: string;
    fullName: string;
    dateOfBirth: string;
    sampleType: string;
  }>;
  
}

type StatusType = "Chờ xác nhận" | "Đang gửi bộ kit" | "Đang gửi về" | "Đã thu lại kit" | "Đã nhận được" | "Đang xét nghiệm" | "Hoàn thành" | "Đã xác nhận" | "Đang tiến hành" | "Đã hủy";
type ResultType = "Có kết quả" | "Chờ kết quả" | "Đang phân tích";

export default function TestHistory() {
  const navigate = useNavigate();
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [confirmingKit, setConfirmingKit] = useState<number | null>(null);
  const [sendingKit, setSendingKit] = useState<number | null>(null);

  // Hàm chuyển đổi status từ tiếng Anh sang tiếng Việt
  const translateStatus = (status: string): string => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "Chờ xác nhận";
      case "sending":
        return "Đang gửi bộ kit";
      case "returning":
        return "Đang gửi về";
      case "collected":
        return "Đã thu lại kit";
      case "arrived":
        return "Đã nhận được";
      case "testing":
        return "Đang xét nghiệm";
      case "completed":
        return "Hoàn thành";
      default:
        return status || "Không xác định";
    }
  };

  // Hàm kiểm tra xem test đã hoàn thành chưa
  const isTestCompleted = (status: string): boolean => {
    const statusLower = status?.toLowerCase();
    return statusLower === 'completed' || statusLower === 'hoàn thành';
  };

  // Hàm lấy status hiện tại của test request
  const getCurrentTestRequestStatus = async (requestId: number) => {
    try {
      const response = await testRequestAPI.getById(requestId);
      return response.status;
    } catch (error) {
      console.error('Error getting test request status:', error);
      return null;
    }
  };

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
        // Gọi API lấy lịch sử xét nghiệm chi tiết
        const response = await testRequestAPI.getByUserId(Number(userId));
        let mapped: any[] = [];
        if (Array.isArray(response)) {
          // Map các test request cơ bản trước
          mapped = response.map((item: any) => {
            return {
              id: String(item.requestId || item.id),
              requestId: item.requestId || item.id,
              testName: item.serviceName || item.service?.name || 'Chưa rõ',
              date: item.appointmentDate || '',
              status: translateStatus(item.status || ''),
              result: item.resultStatus || (item.status === 'Completed' || item.status === 'Hoàn thành' ? 'Có kết quả' : 'Chờ kết quả'),
              price: item.payment?.amount ? item.payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
              userFullName: item.userFullName || '',
              serviceName: item.serviceName || item.service?.name || '',
              collectionType: item.collectionType || '',
              slotTime: item.slotTime || '',
              staffId: item.staffId || null,
              isMatch: item.isMatch, // Giữ lại isMatch từ API response ban đầu
              payment: item.payment || null,
              sample: item.sample || null,
              subSamples: item.subSamples || [],
            };
          });

          // Fetch isMatch cho các test đã hoàn thành
          const fetchIsMatchPromises = mapped
            .filter(test => test.status === 'Hoàn thành')
            .map(async (test) => {
              try {
                const isMatchResult = await testRequestAPI.getResult(test.requestId);
                console.log(`isMatch for requestId ${test.requestId}:`, isMatchResult);
                return {
                  ...test,
                  isMatch: isMatchResult // Cập nhật isMatch từ endpoint mới
                };
              } catch (error) {
                console.error(`Error fetching isMatch for requestId ${test.requestId}:`, error);
                return test; // Giữ nguyên test nếu có lỗi
              }
            });

          // Chờ tất cả các promise hoàn thành
          const updatedTests = await Promise.all(fetchIsMatchPromises);
          
          // Cập nhật lại mapped với isMatch mới
          mapped = mapped.map(test => {
            const updatedTest = updatedTests.find(updated => updated.requestId === test.requestId);
            return updatedTest || test;
          });
        }
        
        // Sắp xếp theo requestId giảm dần (lớn nhất lên đầu)
        const sortedMapped = mapped.sort((a, b) => {
          const requestIdA = a.requestId || 0;
          const requestIdB = b.requestId || 0;
          return requestIdB - requestIdA;
        });
        
        setTestHistory(sortedMapped);
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
      "Chờ xác nhận": { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      "Đang gửi bộ kit": { variant: "outline", className: "bg-blue-100 text-blue-800" },
      "Đang gửi về": { variant: "outline", className: "bg-purple-100 text-purple-800" },
      "Đã thu lại kit": { variant: "outline", className: "bg-indigo-100 text-indigo-800" },
      "Đã nhận được": { variant: "outline", className: "bg-cyan-100 text-cyan-800" },
      "Đang xét nghiệm": { variant: "outline", className: "bg-orange-100 text-orange-800" },
      "Hoàn thành": { variant: "default", className: "bg-green-100 text-green-800" },
      "Đã xác nhận": { variant: "outline", className: "bg-green-100 text-green-800" },
      "Đang tiến hành": { variant: "outline", className: "bg-blue-100 text-blue-800" },
      "Đã hủy": { variant: "outline", className: "bg-red-100 text-red-800" }
    };
    const config = statusConfig[status as StatusType] || { variant: "default", className: "bg-gray-100 text-gray-800" };
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

  // Hàm hiển thị badge cho isMatch
  const getIsMatchBadge = (isMatch: boolean | undefined, status: string) => {
    // Chỉ hiển thị badge khi status là "Hoàn thành" và có dữ liệu isMatch
    if (status !== 'Hoàn thành' || isMatch === undefined) {
      return null;
    }
    
    const className = isMatch 
      ? "bg-green-100 text-green-800 border border-green-300 px-3 py-1 text-sm font-medium" 
      : "bg-red-100 text-red-800 border border-red-300 px-3 py-1 text-sm font-medium";
    
    const text = isMatch ? "Chung huyết thống" : "Không chung huyết thống";
    
    return <Badge className={className}>{text}</Badge>;
  };

  // Thêm hàm xem PDF
  const handleViewPdf = async (requestId: number, event?: React.MouseEvent) => {
    // Ngăn chặn event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      console.log('Calling viewPdf for requestId:', requestId);
      const blob = await testResultAPI.viewPdf(requestId);
      console.log('PDF blob received:', blob);
      console.log('Blob type:', blob.type);
      console.log('Blob size:', blob.size);
      
      // Tạo URL từ blob và mở PDF
      const url = window.URL.createObjectURL(blob);
      console.log('Created blob URL:', url);
      window.open(url, '_blank');
      
      // Cleanup: revoke URL sau khi mở
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (err) {
      console.error('Error viewing PDF:', err);
      alert('Không thể xem file PDF!');
    }
  };

  // Thêm hàm xác nhận đã nhận bộ kit
  const handleConfirmKitReceived = async (requestId: number, event?: React.MouseEvent) => {
    // Ngăn chặn event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      setConfirmingKit(requestId);
      console.log('Confirming kit received for requestId:', requestId);
      
      // Gọi API cập nhật trạng thái thành "Arrived"
      await testRequestAPI.updateStatus(requestId, 'Arrived');
      
      // Cập nhật lại danh sách test history
      const userData = localStorage.getItem('userData');
      let userId = null;
      if (userData) {
        const parsed = JSON.parse(userData);
        userId = parsed.userId || parsed.id;
      }
      
      if (userId) {
        const response = await testRequestAPI.getByUserId(Number(userId));
        let mapped: any[] = [];
        if (Array.isArray(response)) {
          // Map các test request cơ bản trước
          mapped = response.map((item: any) => {
            return {
              id: String(item.requestId || item.id),
              requestId: item.requestId || item.id,
              testName: item.serviceName || item.service?.name || 'Chưa rõ',
              date: item.appointmentDate || '',
              status: translateStatus(item.status || ''),
              result: item.resultStatus || (item.status === 'Completed' || item.status === 'Hoàn thành' ? 'Có kết quả' : 'Chờ kết quả'),
              price: item.payment?.amount ? item.payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
              userFullName: item.userFullName || '',
              serviceName: item.serviceName || item.service?.name || '',
              collectionType: item.collectionType || '',
              slotTime: item.slotTime || '',
              staffId: item.staffId || null,
              isMatch: item.isMatch, // Giữ lại isMatch từ API response ban đầu
              payment: item.payment || null,
              sample: item.sample || null,
              subSamples: item.subSamples || [],
            };
          });

          // Fetch isMatch cho các test đã hoàn thành
          const fetchIsMatchPromises = mapped
            .filter(test => test.status === 'Hoàn thành')
            .map(async (test) => {
              try {
                const isMatchResult = await testRequestAPI.getResult(test.requestId);
                console.log(`isMatch for requestId ${test.requestId}:`, isMatchResult);
                return {
                  ...test,
                  isMatch: isMatchResult // Cập nhật isMatch từ endpoint mới
                };
              } catch (error) {
                console.error(`Error fetching isMatch for requestId ${test.requestId}:`, error);
                return test; // Giữ nguyên test nếu có lỗi
              }
            });

          // Chờ tất cả các promise hoàn thành
          const updatedTests = await Promise.all(fetchIsMatchPromises);
          
          // Cập nhật lại mapped với isMatch mới
          mapped = mapped.map(test => {
            const updatedTest = updatedTests.find(updated => updated.requestId === test.requestId);
            return updatedTest || test;
          });
        }
        
        // Sắp xếp theo requestId giảm dần
        const sortedMapped = mapped.sort((a, b) => {
          const requestIdA = a.requestId || 0;
          const requestIdB = b.requestId || 0;
          return requestIdB - requestIdA;
        });
        
        setTestHistory(sortedMapped);
      }
      
      alert('Đã xác nhận nhận được bộ kit xét nghiệm!');
    } catch (err: any) {
      console.error('Error confirming kit received:', err);
      alert('Không thể xác nhận nhận kit. Vui lòng thử lại!');
    } finally {
      setConfirmingKit(null);
    }
  };

  // Thêm hàm xác nhận đã gửi kit về trung tâm
  const handleConfirmKitSent = async (requestId: number, event?: React.MouseEvent) => {
    // Ngăn chặn event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      setSendingKit(requestId);
      console.log('Confirming kit sent back for requestId:', requestId);
      
      // Gọi API cập nhật trạng thái thành "Returning"
      await testRequestAPI.updateStatus(requestId, 'Returning');
      
      // Cập nhật lại danh sách test history
      const userData = localStorage.getItem('userData');
      let userId = null;
      if (userData) {
        const parsed = JSON.parse(userData);
        userId = parsed.userId || parsed.id;
      }
      
      if (userId) {
        const response = await testRequestAPI.getByUserId(Number(userId));
        let mapped: any[] = [];
        if (Array.isArray(response)) {
          // Map các test request cơ bản trước
          mapped = response.map((item: any) => {
            return {
              id: String(item.requestId || item.id),
              requestId: item.requestId || item.id,
              testName: item.serviceName || item.service?.name || 'Chưa rõ',
              date: item.appointmentDate || '',
              status: translateStatus(item.status || ''),
              result: item.resultStatus || (item.status === 'Completed' || item.status === 'Hoàn thành' ? 'Có kết quả' : 'Chờ kết quả'),
              price: item.payment?.amount ? item.payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
              userFullName: item.userFullName || '',
              serviceName: item.serviceName || item.service?.name || '',
              collectionType: item.collectionType || '',
              slotTime: item.slotTime || '',
              staffId: item.staffId || null,
              isMatch: item.isMatch, // Giữ lại isMatch từ API response ban đầu
              payment: item.payment || null,
              sample: item.sample || null,
              subSamples: item.subSamples || [],
            };
          });

          // Fetch isMatch cho các test đã hoàn thành
          const fetchIsMatchPromises = mapped
            .filter(test => test.status === 'Hoàn thành')
            .map(async (test) => {
              try {
                const isMatchResult = await testRequestAPI.getResult(test.requestId);
                console.log(`isMatch for requestId ${test.requestId}:`, isMatchResult);
                return {
                  ...test,
                  isMatch: isMatchResult // Cập nhật isMatch từ endpoint mới
                };
              } catch (error) {
                console.error(`Error fetching isMatch for requestId ${test.requestId}:`, error);
                return test; // Giữ nguyên test nếu có lỗi
              }
            });

          // Chờ tất cả các promise hoàn thành
          const updatedTests = await Promise.all(fetchIsMatchPromises);
          
          // Cập nhật lại mapped với isMatch mới
          mapped = mapped.map(test => {
            const updatedTest = updatedTests.find(updated => updated.requestId === test.requestId);
            return updatedTest || test;
          });
        }
        
        // Sắp xếp theo requestId giảm dần
        const sortedMapped = mapped.sort((a, b) => {
          const requestIdA = a.requestId || 0;
          const requestIdB = b.requestId || 0;
          return requestIdB - requestIdA;
        });
        
        setTestHistory(sortedMapped);
      }
      
      alert('Đã xác nhận gửi bộ kit về trung tâm xét nghiệm!');
    } catch (err: any) {
      console.error('Error confirming kit sent:', err);
      alert('Không thể xác nhận gửi kit. Vui lòng thử lại!');
    } finally {
      setSendingKit(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử xét nghiệm</h1>
              <p className="text-gray-600">Danh sách các lần xét nghiệm của bạn</p>
            </div>
            <Button 
              onClick={() => {
                if (showFeedback) {
                  setShowFeedback(false);
                  setSelectedRequestId(null);
                } else {
                  setShowFeedback(true);
                }
              }}
              variant={showFeedback ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {showFeedback ? "Ẩn đánh giá" : "Đánh giá dịch vụ"}
            </Button>
          </div>
        </div>
        
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
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{test.testName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Mã: {test.id}</p>
                        <p className="text-sm text-gray-500 mt-1">Loại lấy mẫu: {translateCollectionType(test.collectionType)}</p>
                        {test.sample && (
                          <p className="text-sm text-gray-500 mt-1">
                            Loại mẫu: {test.sample.sampleType} - {test.sample.relationship}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">{test.price}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(test.date).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Giờ: {test.slotTime}
                        </p>
                      </div>
                    </div>
                    
                    {/* Payment Information */}
                    {test.payment && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">Thông tin thanh toán</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Trạng thái:</span>
                            <Badge className={`ml-1 ${test.payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {test.payment.status === 'Paid' ? 'Đã thanh toán' : test.payment.status}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-600">Phương thức:</span>
                            <span className="ml-1">{test.payment.method || 'VNPay'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Ngày thanh toán:</span>
                            <span className="ml-1">{new Date(test.payment.paidAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Mã giao dịch:</span>
                            <span className="ml-1 text-xs">{test.payment.token}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Sample Information */}
                    {test.sample && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TestTube className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Thông tin mẫu</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Mã mẫu:</span>
                            <span className="ml-1">{test.sample.sampleId}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Thời gian nhận:</span>
                            <span className="ml-1">{new Date(test.sample.receivedTime).toLocaleString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* SubSamples Information */}
                    {test.subSamples && test.subSamples.length > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-800">Thông tin người tham gia ({test.subSamples.length} người)</span>
                        </div>
                        <div className="space-y-2">
                          {test.subSamples.map((subSample, index) => (
                            <div key={subSample.subSampleId} className="bg-white rounded p-2 border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{subSample.fullName}</span>
                                  <Badge className="text-xs bg-purple-100 text-purple-800">
                                    {subSample.sampleType}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(subSample.dateOfBirth).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                              {subSample.description && (
                                <p className="text-xs text-gray-600 mt-1">{subSample.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Hiển thị badge isMatch trên dòng riêng với kích thước lớn */}
                    {getIsMatchBadge(test.isMatch, test.status) && (
                      <div className="flex justify-center my-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700 mb-2">Kết quả xét nghiệm huyết thống:</p>
                          {getIsMatchBadge(test.isMatch, test.status)}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 flex-wrap">
                        {/* Hiển thị status của test request */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                          {getStatusBadge(test.status)}
                        </div>
                        {getResultBadge(test.result)}
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Nút xác nhận nhận kit - chỉ hiển thị cho các trạng thái phù hợp */}
                        {(test.status === 'Đang gửi bộ kit') && 
                         test.collectionType === 'Self' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => handleConfirmKitReceived(test.requestId, e)}
                              disabled={confirmingKit === test.requestId}
                              className="flex items-center gap-2"
                            >
                              {confirmingKit === test.requestId ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  Đang xác nhận...
                                </>
                              ) : (
                                <>
                                  <Package className="w-4 h-4" />
                                  Xác nhận nhận kit
                                </>
                              )}
                            </Button>
                            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
                              <span className="font-medium">⚠️ Lưu ý:</span> Xin vui lòng đọc kỹ hướng dẫn sử dụng bộ kit
                            </div>
                          </>
                        )}
                        
                        {/* Nút xác nhận đã gửi kit về trung tâm */}
                        {(test.status === 'Đã nhận được') && 
                         test.collectionType === 'Self' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => handleConfirmKitSent(test.requestId, e)}
                            disabled={sendingKit === test.requestId}
                            className="flex items-center gap-2"
                          >
                            {sendingKit === test.requestId ? (
                              <>
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                Đang xác nhận...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Đã gửi kit về trung tâm
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPdf(test.requestId)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem kết quả
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRequestId(test.requestId);
                            setShowFeedback(true);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Đánh giá
                        </Button>
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

        {/* Feedback Section */}
        {showFeedback && (
          <div className="mt-6">
            <Feedback selectedRequestId={selectedRequestId} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 