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

type StatusType = "Hoàn thành" | "Đang xử lý" | "Đã lấy mẫu" | "Hủy" | "Pending" | "Completed" | "In Progress" | "Cancelled";
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
          mapped = response.map((item: any) => {
            return {
              id: String(item.requestId || item.id),
              requestId: item.requestId || item.id,
              testName: item.serviceName || item.service?.name || 'Chưa rõ',
              date: item.appointmentDate || '',
              status: item.status || '',
              result: item.resultStatus || (item.status === 'Completed' || item.status === 'Hoàn thành' ? 'Có kết quả' : 'Chờ kết quả'),
              price: item.payment?.amount ? item.payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
              userFullName: item.userFullName || '',
              serviceName: item.serviceName || item.service?.name || '',
              collectionType: item.collectionType || '',
              slotTime: item.slotTime || '',
              staffId: item.staffId || null,
              payment: item.payment || null,
              sample: item.sample || null,
              subSamples: item.subSamples || [],
            };
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
      "Hoàn thành": { variant: "default", className: "bg-green-100 text-green-800" },
      "Đang xử lý": { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      "Đã lấy mẫu": { variant: "outline", className: "bg-blue-100 text-blue-800" },
      "Hủy": { variant: "destructive", className: "bg-red-100 text-red-800" },
      "Pending": { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      "Completed": { variant: "default", className: "bg-green-100 text-green-800" },
      "In Progress": { variant: "outline", className: "bg-blue-100 text-blue-800" },
      "Cancelled": { variant: "destructive", className: "bg-red-100 text-red-800" }
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
          mapped = response.map((item: any) => {
            return {
              id: String(item.requestId || item.id),
              requestId: item.requestId || item.id,
              testName: item.serviceName || item.service?.name || 'Chưa rõ',
              date: item.appointmentDate || '',
              status: item.status || '',
              result: item.resultStatus || (item.status === 'Completed' || item.status === 'Hoàn thành' ? 'Có kết quả' : 'Chờ kết quả'),
              price: item.payment?.amount ? item.payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
              userFullName: item.userFullName || '',
              serviceName: item.serviceName || item.service?.name || '',
              collectionType: item.collectionType || '',
              slotTime: item.slotTime || '',
              staffId: item.staffId || null,
              payment: item.payment || null,
              sample: item.sample || null,
              subSamples: item.subSamples || [],
            };
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
          mapped = response.map((item: any) => {
            return {
              id: String(item.requestId || item.id),
              requestId: item.requestId || item.id,
              testName: item.serviceName || item.service?.name || 'Chưa rõ',
              date: item.appointmentDate || '',
              status: item.status || '',
              result: item.resultStatus || (item.status === 'Completed' || item.status === 'Hoàn thành' ? 'Có kết quả' : 'Chờ kết quả'),
              price: item.payment?.amount ? item.payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
              userFullName: item.userFullName || '',
              serviceName: item.serviceName || item.service?.name || '',
              collectionType: item.collectionType || '',
              slotTime: item.slotTime || '',
              staffId: item.staffId || null,
              payment: item.payment || null,
              sample: item.sample || null,
              subSamples: item.subSamples || [],
            };
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
                        <p className="text-sm text-gray-500 mt-1">Loại lấy mẫu: {test.collectionType}</p>
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
                            <span className="text-gray-600">Trạng thái:</span>
                            <Badge className="ml-1 bg-blue-100 text-blue-800">{test.sample.status}</Badge>
                          </div>
                          <div>
                            <span className="text-gray-600">Thời gian thu:</span>
                            <span className="ml-1">{new Date(test.sample.collectionTime).toLocaleString('vi-VN')}</span>
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
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        {getStatusBadge(test.status)}
                        {getResultBadge(test.result)}
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Nút xác nhận nhận kit - chỉ hiển thị cho các trạng thái phù hợp */}
                        {(test.status === 'Sending') && 
                         test.collectionType === 'Self' && (
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
                        )}
                        
                        {/* Nút xác nhận đã gửi kit về trung tâm */}
                        {(test.status === 'Arrived') && 
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