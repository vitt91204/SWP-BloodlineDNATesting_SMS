import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Home, Users, TestTube, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function Booking() { 
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [step, setStep] = useState(1);

  // Thêm state cho form data
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    numberOfPeople: "",
    notes: ""
  });

  // Thêm state để theo dõi khi nào hiển thị validation
  const [showValidation, setShowValidation] = useState(false);

  const services = [
    {
      id: "civil",
      name: "Xét nghiệm huyết thống dân sự",
      price: "2.500.000 - 4.500.000 VNĐ",
      duration: "5-7 ngày",
      locations: ["home", "facility"]
    },
    {
      id: "legal",
      name: "Xét nghiệm huyết thống hành chính",
      price: "3.500.000 - 6.000.000 VNĐ",
      duration: "7-10 ngày",
      locations: ["facility"]
    },
   
  ];

  const locations = [
    {
      id: "home",
      name: "Thu mẫu tại nhà",
      description: "Nhân viên đến tận nhà thu mẫu",
      icon: Home,
      benefits: [
        "Tiện lợi, thoải mái",
        "Riêng tư cao",
        "Phù hợp với trẻ em",
        "Tiết kiệm thời gian"
      ]
    },
    {
      id: "facility",
      name: "Thu mẫu tại cơ sở",
      description: "Đến trực tiếp cơ sở y tế",
      icon: MapPin,
      benefits: [
        "Chuyên nghiệp",
        "Trang thiết bị đầy đủ",
        "Tư vấn trực tiếp",
        "Xử lý nhanh chóng"
      ]
    }
  ];

  // Thêm time slots cố định
  const timeSlots = [
    { id: "08:00", time: "08:00", label: "08:00 - 09:00", available: true },
    { id: "09:00", time: "09:00", label: "09:00 - 10:00", available: true },
    { id: "10:00", time: "10:00", label: "10:00 - 11:00", available: false },
    { id: "11:00", time: "11:00", label: "11:00 - 12:00", available: true },
    { id: "13:00", time: "13:00", label: "13:00 - 14:00", available: true },
    { id: "14:00", time: "14:00", label: "14:00 - 15:00", available: true },
    { id: "15:00", time: "15:00", label: "15:00 - 16:00", available: false },
    { id: "16:00", time: "16:00", label: "16:00 - 17:00", available: true },
    { id: "18:00", time: "18:00", label: "18:00 - 19:00", available: true },
    { id: "19:00", time: "19:00", label: "19:00 - 20:00", available: true },
  ];

  // Hàm kiểm tra validation các trường bắt buộc
  const isStep3Valid = () => {
    const requiredFields = formData.fullName && formData.phone && formData.numberOfPeople;
    
    if (selectedLocation === 'home') {
      return requiredFields && selectedDate && selectedTimeSlot;
    }
    
    return requiredFields;
  };

  // Hàm cập nhật form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Hàm xử lý khi nhấn "Tiếp tục" ở step 3
  const handleStep3Continue = () => {
    if (isStep3Valid()) {
      setStep(4);
      setShowValidation(false); // Reset validation state
    } else {
      setShowValidation(true); // Hiển thị validation errors
    }
  };

  const BookingSteps = () => {
    const steps = [
      { number: 1, title: "Chọn dịch vụ", description: "Lựa chọn loại xét nghiệm" },
      { number: 2, title: "Chọn hình thức", description: "Thu mẫu tại nhà hoặc cơ sở" },
      { number: 3, title: "Thông tin", description: "Điền thông tin cá nhân" },
      { number: 4, title: "Xác nhận", description: "Xác nhận và thanh toán" }
    ];

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex flex-col items-center ${step >= stepItem.number ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepItem.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepItem.number ? <CheckCircle className="w-5 h-5" /> : stepItem.number}
                </div>
                <div className="text-xs mt-2 text-center">
                  <div className="font-medium">{stepItem.title}</div>
                  <div className="text-gray-500">{stepItem.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className={`w-5 h-5 mx-4 ${step > stepItem.number ? 'text-blue-600' : 'text-gray-400'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700 mb-4">
              Đặt lịch xét nghiệm
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Đặt lịch xét nghiệm ADN
            </h1>
            <p className="text-xl text-gray-600">
              Chỉ với vài bước đơn giản để đặt lịch xét nghiệm ADN chuyên nghiệp
            </p>
          </div>

          <BookingSteps />

          {/* Step 1: Select Service */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Chọn dịch vụ xét nghiệm</CardTitle>
                <CardDescription>
                  Lựa chọn loại xét nghiệm phù hợp với nhu cầu của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <TestTube className="w-4 h-4 mr-1" />
                            {service.price}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        selectedService === service.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedService === service.id && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-6">
                  <Button 
                    className="w-full" 
                    disabled={!selectedService}
                    onClick={() => setStep(2)}
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Location */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Chọn hình thức thu mẫu</CardTitle>
                <CardDescription>
                  Lựa chọn địa điểm thu mẫu phù hợp với bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {locations.map((location) => {
                    const Icon = location.icon;
                    const selectedServiceData = services.find(s => s.id === selectedService);
                    const isAvailable = selectedServiceData?.locations.includes(location.id);
                    
                    return (
                      <div
                        key={location.id}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          !isAvailable 
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : selectedLocation === location.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => isAvailable && setSelectedLocation(location.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            selectedLocation === location.id ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              selectedLocation === location.id ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          {!isAvailable && (
                            <Badge variant="outline" className="text-xs">
                              Không khả dụng
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {location.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {location.description}
                        </p>
                        
                        <ul className="space-y-2">
                          {location.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    className="flex-1" 
                    disabled={!selectedLocation}
                    onClick={() => setStep(3)}
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Điền thông tin để chúng tôi có thể liên hệ và thu mẫu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên người đặt *
                    </label>
                    <Input 
                      placeholder="Nhập họ và tên" 
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className={showValidation && !formData.fullName ? 'border-red-300 focus:border-red-500' : ''}
                    />
                    {showValidation && !formData.fullName && (
                      <p className="text-red-500 text-xs mt-1">Vui lòng nhập họ và tên</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <Input 
                      placeholder="Nhập số điện thoại" 
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className={showValidation && !formData.phone ? 'border-red-300 focus:border-red-500' : ''}
                    />
                    {showValidation && !formData.phone && (
                      <p className="text-red-500 text-xs mt-1">Vui lòng nhập số điện thoại</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    placeholder="Nhập địa chỉ email" 
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ {selectedLocation === 'home' ? 'thu mẫu' : 'liên hệ'}
                  </label>
                  <Textarea 
                    placeholder="Nhập địa chỉ chi tiết..." 
                    rows={3} 
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số người tham gia xét nghiệm *
                  </label>
                  <select 
                    className={`w-full px-3 py-2 border rounded-md ${
                      showValidation && !formData.numberOfPeople ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.numberOfPeople}
                    onChange={(e) => updateFormData('numberOfPeople', e.target.value)}
                  >
                    <option value="">Chọn số người</option>
                    <option value="2">2 người</option>
                    <option value="3">3 người</option>
                    <option value="4">4 người</option>
                    <option value="5">5 người trở lên</option>
                  </select>
                  {showValidation && !formData.numberOfPeople && (
                    <p className="text-red-500 text-xs mt-1">Vui lòng chọn số người tham gia</p>
                  )}
                </div>

                {selectedLocation === 'home' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn ngày mong muốn *
                      </label>
                      <Input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTimeSlot(""); // Reset time slot when date changes
                        }}
                        min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày trong quá khứ
                        className={showValidation && selectedLocation === 'home' && !selectedDate ? 'border-red-300 focus:border-red-500' : ''}
                      />
                      {showValidation && selectedLocation === 'home' && !selectedDate && (
                        <p className="text-red-500 text-xs mt-1">Vui lòng chọn ngày mong muốn</p>
                      )}
                    </div>
                    
                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Chọn khung giờ *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedTimeSlot(slot.id)}
                              className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                                !slot.available
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : selectedTimeSlot === slot.id
                                  ? 'bg-blue-50 text-blue-700 border-blue-500'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {slot.label}
                              </div>
                              {!slot.available && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Đã đặt
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {selectedTimeSlot && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center text-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">
                                Đã chọn: {timeSlots.find(slot => slot.id === selectedTimeSlot)?.label} ngày {selectedDate}
                              </span>
                            </div>
                          </div>
                        )}
                        {showValidation && selectedLocation === 'home' && selectedDate && !selectedTimeSlot && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-red-500 text-sm">Vui lòng chọn khung giờ</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <Textarea 
                    placeholder="Thông tin bổ sung (nếu có)..." 
                    rows={3} 
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleStep3Continue}
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Xác nhận thông tin đặt lịch</CardTitle>
                <CardDescription>
                  Vui lòng kiểm tra lại thông tin trước khi xác nhận
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đặt lịch</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dịch vụ:</span>
                      <span className="font-medium">
                        {services.find(s => s.id === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hình thức:</span>
                      <span className="font-medium">
                        {locations.find(l => l.id === selectedLocation)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian hoàn thành:</span>
                      <span className="font-medium">
                        {services.find(s => s.id === selectedService)?.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá dự kiến:</span>
                      <span className="font-medium text-lg text-blue-600">
                        {services.find(s => s.id === selectedService)?.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Quy trình tiếp theo:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Chúng tôi sẽ liên hệ trong vòng 30 phút để xác nhận</li>
                    <li>• Gửi hợp đồng và hướng dẫn chi tiết qua email</li>
                    <li>• {selectedLocation === 'home' ? 'Nhân viên đến thu mẫu theo lịch hẹn' : 'Bạn đến cơ sở theo lịch hẹn'}</li>
                    <li>• Thông báo kết quả qua SMS/Email khi hoàn thành</li>
                  </ul>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <input type="checkbox" id="terms" className="rounded" />
                  <label htmlFor="terms">
                    Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">điều khoản dịch vụ</a> và 
                    <a href="#" className="text-blue-600 hover:underline ml-1">chính sách bảo mật</a>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-green-600">
                    Xác nhận đặt lịch
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
