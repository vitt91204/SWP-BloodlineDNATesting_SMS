import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Clock,
  ArrowLeft
} from "lucide-react";
import { testRequestAPI, paymentAPI } from "@/api/axios";

export default function Payment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Lấy thông tin booking từ localStorage
      const storedBooking = localStorage.getItem('currentBooking');
      if (storedBooking) {
        const bookingData = JSON.parse(storedBooking);
        console.log("Loaded booking data from localStorage:", bookingData);
        setOrderInfo(bookingData);
        setBookingId(bookingData.id || bookingData.requestId || bookingData.testRequestId);
      } else {
        // Fallback: nếu không có trong localStorage, thử lấy từ URL và gọi API
        const urlParams = new URLSearchParams(window.location.search);
        const idFromUrl = urlParams.get('bookingId');
        setBookingId(idFromUrl);

        if (idFromUrl) {
          console.log(`Fetching booking data for ID: ${idFromUrl} from API...`);
          testRequestAPI.getById(parseInt(idFromUrl))
            .then(res => {
              console.log("Loaded booking data from API:", res);
              // Cấu trúc lại dữ liệu để khớp với cấu trúc từ localStorage
              const formattedData = {
                ...res,
                serviceInfo: {
                  name: res.service?.name,
                  price: res.service?.price,
                  // Thêm các trường serviceInfo khác nếu cần
                },
                userInfo: {
                  // Giả định hoặc để trống nếu API không trả về
                  fullName: 'N/A',
                  phone: 'N/A'
                }
              };
              setOrderInfo(formattedData);
            })
            .catch(err => {
              console.error("Failed to load booking data from API:", err);
              setOrderInfo(null)
            });
        }
      }
    } catch (error) {
      console.error("Error processing booking data:", error);
      setOrderInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const paymentMethod = {
    id: "vnpay",
    name: "VNPay",
    description: "Thanh toán an toàn qua cổng VNPay",
    icon: CreditCard,
    fee: 0
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePayment = async () => {
    if (!bookingId || !orderInfo) return;
    setIsProcessing(true);
    
    const requestId = parseInt(bookingId);
    const amount = orderInfo?.serviceInfo?.price || 0;
    
    try {
      console.log("Gọi API Payment với requestId:", requestId, "amount:", amount);
      
      // Gọi API để lấy payment URL
      const response = await paymentAPI.createPaymentUrl(requestId, amount);
      
      console.log("API Response:", response);
      
      // Kiểm tra và chuyển hướng đến payment URL
      if (response && response.paymentUrl) {
        console.log("Chuyển hướng đến:", response.paymentUrl);
        window.location.href = response.paymentUrl;
      } else {
        // Không có URL, có thể là lỗi
        setIsProcessing(false);
        alert("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
        console.error("No payment URL in response:", response);
      }
      
    } catch (error) {
      setIsProcessing(false);
      alert("Thanh toán thất bại. Vui lòng thử lại!");
      console.error("Payment API error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-700 mb-4">
              Thanh toán
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thanh toán qua VNPay
            </h1>
            <p className="text-lg text-gray-600">
              Thanh toán an toàn và nhanh chóng để xác nhận đặt lịch xét nghiệm
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Thông tin đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Dịch vụ</div>
                      <div className="font-medium">{orderInfo?.serviceInfo?.name || "Không có thông tin"}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600">Loại hình</div>
                      <div className="font-medium">{orderInfo?.collectionType || "Không có thông tin"}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600">Khách hàng</div>
                      <div className="font-medium">{orderInfo?.userInfo?.fullName || "Không có thông tin"}</div>
                    </div>
                    
                    {orderInfo?.appointmentDate && (
                       <div>
                         <div className="text-sm text-gray-600">Thời gian hẹn</div>
                         <div className="font-medium flex items-center">
                           <Clock className="w-4 h-4 mr-1" />
                           {orderInfo.slotTime}, {new Date(orderInfo.appointmentDate).toLocaleDateString('vi-VN')}
                         </div>
                       </div>
                     )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Giá dịch vụ</span>
                      <span>{formatPrice(orderInfo?.serviceInfo?.price || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí thanh toán</span>
                      <span>0 ₫</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatPrice(orderInfo?.serviceInfo?.price || 0)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <div className="font-medium mb-1">Bảo mật thanh toán</div>
                        <div>Thông tin thanh toán được mã hóa và bảo mật tuyệt đối</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                  <CardDescription>
                    Thanh toán an toàn qua cổng VNPay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* VNPay Payment Method */}
                    <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CreditCard className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-blue-900">{paymentMethod.name}</h3>
                            <p className="text-blue-700">{paymentMethod.description}</p>
                            <div className="flex items-center mt-2">
                              <Shield className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm text-green-700">Bảo mật cao • Xử lý nhanh chóng</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Payment Features */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Bảo mật tuyệt đối</h4>
                        <p className="text-sm text-gray-600">Mã hóa SSL 256-bit</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Xử lý nhanh</h4>
                        <p className="text-sm text-gray-600">Thanh toán trong vài giây</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Đa dạng thẻ</h4>
                        <p className="text-sm text-gray-600">Visa, Mastercard, ATM</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex space-x-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.history.back()}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            Thanh toán qua VNPay
                            <CreditCard className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">
                      Bằng cách nhấn "Thanh toán ngay", bạn đồng ý với{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        điều khoản dịch vụ
                      </a>{" "}
                      của chúng tôi
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}