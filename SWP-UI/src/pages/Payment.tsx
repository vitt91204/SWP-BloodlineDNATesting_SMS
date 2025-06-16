import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Copy,
  QrCode
} from "lucide-react";

export default function Payment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Lấy dữ liệu đặt lịch từ localStorage
  const getBookingData = () => {
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      const data = JSON.parse(savedData);
      return {
        service: data.service?.name || "Xét nghiệm huyết thống dân sự",
        location: data.location?.name || "Thu mẫu tại nhà", 
        numberOfPeople: data.formData?.numberOfPeople || "2",
        date: data.date || "",
        time: data.timeSlot?.label || "",
        price: data.service?.id === 'civil' ? 3500000 : 5000000,
        customerName: data.formData?.fullName || "",
        phone: data.formData?.phone || "",
        address: data.formData?.address || ""
      };
    }
    // Fallback data
    return {
      service: "Xét nghiệm huyết thống dân sự",
      location: "Thu mẫu tại nhà",
      numberOfPeople: "2",
      date: "",
      time: "",
      price: 3500000,
      customerName: "",
      phone: "",
      address: ""
    };
  };

  const orderInfo = getBookingData();

  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      description: "Thanh toán qua VNPay",
      icon: CreditCard,
      fee: 0,
      popular: true
    },
    {
      id: "momo",
      name: "MoMo",
      description: "Ví điện tử MoMo",
      icon: Smartphone,
      fee: 0,
      popular: true
    },
    {
      id: "zalopay",
      name: "ZaloPay", 
      description: "Ví điện tử ZaloPay",
      icon: Smartphone,
      fee: 0
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp",
      icon: Building2,
      fee: 0
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or show success message
      alert("Thanh toán thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.");
    }, 2000);
  };

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
              Thanh toán dịch vụ
            </h1>
            <p className="text-lg text-gray-600">
              Hoàn tất thanh toán để xác nhận đặt lịch xét nghiệm
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
                      <div className="font-medium">{orderInfo.service}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600">Hình thức</div>
                      <div className="font-medium">{orderInfo.location}</div>
                    </div>
                    
                                         <div>
                       <div className="text-sm text-gray-600">Số người</div>
                       <div className="font-medium">{orderInfo.numberOfPeople} người</div>
                     </div>
                     
                     {orderInfo.date && orderInfo.time && (
                       <div>
                         <div className="text-sm text-gray-600">Thời gian</div>
                         <div className="font-medium flex items-center">
                           <Clock className="w-4 h-4 mr-1" />
                           {orderInfo.time}, {orderInfo.date}
                         </div>
                       </div>
                     )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Giá dịch vụ</span>
                      <span>{formatPrice(orderInfo.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí thanh toán</span>
                      <span>0 ₫</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatPrice(orderInfo.price)}</span>
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
                  <CardTitle>Chọn phương thức thanh toán</CardTitle>
                  <CardDescription>
                    Lựa chọn phương thức thanh toán phù hợp với bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="online" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="online">Thanh toán online</TabsTrigger>
                      <TabsTrigger value="transfer">Chuyển khoản</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="online" className="space-y-4 mt-6">
                      <div className="grid gap-4">
                        {paymentMethods.filter(method => method.id !== 'bank_transfer').map((method) => {
                          const Icon = method.icon;
                          return (
                            <div
                              key={method.id}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                                selectedPaymentMethod === method.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedPaymentMethod(method.id)}
                            >
                              {method.popular && (
                                <Badge className="absolute -top-2 -right-2 bg-red-500">
                                  Phổ biến
                                </Badge>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                    selectedPaymentMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                                  }`}>
                                    <Icon className={`w-6 h-6 ${
                                      selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                                    }`} />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{method.name}</h3>
                                    <p className="text-sm text-gray-600">{method.description}</p>
                                  </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 ${
                                  selectedPaymentMethod === method.id
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedPaymentMethod === method.id && (
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="transfer" className="space-y-4 mt-6">
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-4 flex items-center">
                          <QrCode className="w-5 h-5 mr-2" />
                          Thông tin chuyển khoản
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div>
                              <div className="text-sm text-gray-600">Ngân hàng</div>
                              <div className="font-medium">Vietcombank</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div>
                              <div className="text-sm text-gray-600">Số tài khoản</div>
                              <div className="font-medium">1234567890</div>
                            </div>
                            <Button size="sm" variant="outline" className="ml-2">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div>
                              <div className="text-sm text-gray-600">Chủ tài khoản</div>
                              <div className="font-medium">CÔNG TY TNHH SWP DNA</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div>
                              <div className="text-sm text-gray-600">Nội dung chuyển khoản</div>
                              <div className="font-medium">DNA-{Date.now()}</div>
                            </div>
                            <Button size="sm" variant="outline" className="ml-2">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div>
                              <div className="text-sm text-gray-600">Số tiền</div>
                              <div className="font-medium text-blue-600">{formatPrice(orderInfo.price)}</div>
                            </div>
                            <Button size="sm" variant="outline" className="ml-2">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Sau khi chuyển khoản, vui lòng chụp ảnh biên lai và gửi cho chúng tôi qua hotline để xác nhận thanh toán.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

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
                        disabled={!selectedPaymentMethod || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            Thanh toán ngay
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