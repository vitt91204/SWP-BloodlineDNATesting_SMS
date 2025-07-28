import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { testRequestAPI, testServiceAPI, addressAPI, bookingAPI, TestRequest } from '@/api/axios';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Home, Users, TestTube, Clock, CheckCircle, ArrowRight, Package, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Booking() { 
  const navigate = useNavigate();
  const { toast } = useToast();
  

  const [selectedService, setSelectedService] = useState("");
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedHomeOption, setSelectedHomeOption] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [step, setStep] = useState(1);

  // Thêm state cho form data
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
    // Address fields theo API structure
    addressLabel: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Việt Nam",
    isPrimary: false
  });

  // Thêm state để theo dõi khi nào hiển thị validation
  const [showValidation, setShowValidation] = useState(false);

  // Thêm state cho API data
  const [testServices, setTestServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedServiceData, setSelectedServiceData] = useState(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  // Thêm state cho address management
  const [existingAddresses, setExistingAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [useExistingAddress, setUseExistingAddress] = useState(false);

  const services = [
    {
      id: "civil",
      name: "Xét nghiệm huyết thống dân sự",
      price: "2.500.000 - 5.000.000 VNĐ",
      duration: "5-14 ngày",
      locations: ["home", "facility"],
      description: "Xét nghiệm ADN cho mục đích cá nhân, không có giá trị pháp lý"
    },
    {
      id: "legal",
      name: "Xét nghiệm huyết thống hành chính",
      price: "3.500.000 - 6.000.000 VNĐ",
      duration: "7-14 ngày",
      locations: ["facility"],
      description: "Xét nghiệm ADN có giá trị pháp lý, được thực hiện tại cơ sở"
    }
  ];

  // Load test services từ API
  useEffect(() => {
    const loadTestServices = async () => {
      try {
        setIsLoadingServices(true);
        const data = await testServiceAPI.getAll();
        console.log('Loaded test services:', data);
        setTestServices(data);
      } catch (error) {
        console.error('Error loading test services:', error);
        setTestServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    };
    loadTestServices();
  }, []);

  // Load existing addresses khi component mount
  useEffect(() => {
    const loadExistingAddresses = async () => {
      const userData = localStorage.getItem('userData');
      if (!userData) return;
      
      try {
        const user = JSON.parse(userData);
        const userId = user?.id || user?.userId;
        if (!userId) return;
        
        setIsLoadingAddresses(true);
        const addresses = await addressAPI.getByUserId(userId);
        console.log('Loaded existing addresses for booking:', addresses);
        setExistingAddresses(addresses || []);
        
        // Nếu có địa chỉ và chưa có dữ liệu form, auto-select địa chỉ primary hoặc đầu tiên
        if (addresses && addresses.length > 0 && !formData.addressLine) {
          const primaryAddress = addresses.find(addr => addr.isPrimary) || addresses[0];
          if (primaryAddress) {
            setUseExistingAddress(true);
            setSelectedAddressId((primaryAddress.id || primaryAddress.addressId || '').toString());
            setFormData(prev => ({
              ...prev,
              addressLabel: primaryAddress.label || "",
              addressLine: primaryAddress.addressLine || "",
              city: primaryAddress.city || "",
              province: primaryAddress.province || "",
              postalCode: primaryAddress.postalCode || "",
              country: primaryAddress.country || "Việt Nam",
              isPrimary: false // Không set làm primary cho booking address
            }));
          }
        }
      } catch (error) {
        console.error('Error loading existing addresses:', error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    
    loadExistingAddresses();
  }, []);

  // Hàm xử lý khi chọn địa chỉ có sẵn
  const handleSelectExistingAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = existingAddresses.find(addr => 
      (addr.id || addr.addressId || '').toString() === addressId
    );
    
    if (selectedAddress) {
      setFormData(prev => ({
        ...prev,
        addressLabel: selectedAddress.label || "",
        addressLine: selectedAddress.addressLine || "",
        city: selectedAddress.city || "",
        province: selectedAddress.province || "",
        postalCode: selectedAddress.postalCode || "",
        country: selectedAddress.country || "Việt Nam",
        isPrimary: false // Không set làm primary cho booking address
      }));
    }
  };

  // Hàm reset về địa chỉ mới
  const handleUseNewAddress = () => {
    setUseExistingAddress(false);
    setSelectedAddressId("");
    setFormData(prev => ({
      ...prev,
      addressLabel: "",
      addressLine: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Việt Nam",
      isPrimary: false
    }));
  };

  // Load booked time slots cho ngày được chọn
  const loadBookedTimeSlots = async (date) => {
    if (!date) {
      setBookedTimeSlots([]);
      return;
    }

    try {
      setIsLoadingTimeSlots(true);
      console.log(`Loading booked time slots for date: ${date}`);
      
      // Gọi API để lấy tất cả test requests
      const allRequests = await testRequestAPI.getAll();
      console.log('All test requests:', allRequests);

      // Filter theo ngày được chọn và status active
      const bookedOnDate = allRequests.filter(request => {
        const requestDate = request.appointmentDate?.split('T')[0]; // Lấy phần date, bỏ time
        const isActiveBooking = ['Pending', 'Confirmed', 'In Progress'].includes(request.status);
        return requestDate === date && isActiveBooking && request.slotTime;
      });

      console.log(`Booked appointments on ${date}:`, bookedOnDate);

      // Extract time slots đã được đặt và chuẩn hoá về định dạng HH:MM
      const normalizeTime = (t: string) => {
        if (!t) return t;
        // Chuẩn HH:MM hoặc HH:MM:SS → cắt 5 ký tự đầu
        return t.length > 5 ? t.slice(0, 5) : t;
      };

      const bookedSlots = bookedOnDate
        .map(request => normalizeTime(request.slotTime))
        .filter(Boolean);
      setBookedTimeSlots(bookedSlots);
      
      console.log('Booked time slots:', bookedSlots);
    } catch (error) {
      console.error('Error loading booked time slots:', error);
      setBookedTimeSlots([]);
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin lịch đã đặt. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  // Effect để load booked time slots khi selectedDate thay đổi
  useEffect(() => {
    if (selectedDate && ((selectedLocation === 'home' && selectedHomeOption === 'staff_visit') || selectedLocation === 'facility')) {
      loadBookedTimeSlots(selectedDate);
    } else {
      setBookedTimeSlots([]);
    }
  }, [selectedDate, selectedLocation, selectedHomeOption]);

  // Effect để reset selectedTimeSlot nếu slot đó đã bị đặt
  useEffect(() => {
    if (selectedTimeSlot && bookedTimeSlots.includes(selectedTimeSlot)) {
      console.log(`Time slot ${selectedTimeSlot} is now booked, resetting selection`);
      setSelectedTimeSlot("");
      toast({
        title: "Khung giờ không còn trống",
        description: "Khung giờ bạn đã chọn vừa có người đặt. Vui lòng chọn khung giờ khác.",
        variant: "destructive"
      });
    }
  }, [bookedTimeSlots, selectedTimeSlot]);

  // Cập nhật selectedServiceData khi selectedRelationship thay đổi
  useEffect(() => {
    console.log('selectedRelationship changed:', selectedRelationship); // Debug log
    console.log('testServices count:', testServices.length); // Debug log
    if (selectedRelationship && testServices.length > 0) {
      const service = testServices.find(s => s.serviceId?.toString() === selectedRelationship);
      console.log('Found service:', service); // Debug log
      setSelectedServiceData(service);
    }
  }, [selectedRelationship, testServices]);

  // Thêm danh sách các loại quan hệ
  const relationships = [
    {
      id: "paternity",
      name: "Xét nghiệm cha con",
      civilPrice: "2.500.000 - 3.500.000 VNĐ",
      legalPrice: "3.500.000 - 4.500.000 VNĐ",
      duration: "5-7 ngày",
      description: "Xác định mối quan hệ huyết thống giữa cha và con",
      accuracy: "99.9%"
    },
    {
      id: "maternity",
      name: "Xét nghiệm mẹ con",
      civilPrice: "2.500.000 - 3.500.000 VNĐ",
      legalPrice: "3.500.000 - 4.500.000 VNĐ",
      duration: "5-7 ngày",
      description: "Xác định mối quan hệ huyết thống giữa mẹ và con",
      accuracy: "99.9%"
    },
    {
      id: "sibling",
      name: "Xét nghiệm anh chị em ruột",
      civilPrice: "3.000.000 - 4.500.000 VNĐ",
      legalPrice: "4.000.000 - 5.500.000 VNĐ",
      duration: "7-10 ngày",
      description: "Xác định mối quan hệ huyết thống giữa anh chị em ruột",
      accuracy: "95-99%"
    },
    {
      id: "grandparent",
      name: "Xét nghiệm ông bà - cháu",
      civilPrice: "3.500.000 - 5.000.000 VNĐ",
      legalPrice: "4.500.000 - 6.000.000 VNĐ",
      duration: "7-14 ngày",
      description: "Xác định mối quan hệ huyết thống giữa ông bà và cháu",
      accuracy: "90-95%"
    }
  ];

  const locations = [
    {
      id: "home",
      name: "Thu mẫu tại nhà",
      description: "Lựa chọn hình thức thu mẫu tại nhà",
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

  // Thêm home options
  const homeOptions = [
    {
      id: "staff_visit",
      name: "Nhân viên đến thu mẫu",
      description: "Nhân viên chuyên nghiệp đến tận nhà thu mẫu",
      icon: Users,
      benefits: [
        "Chuyên nghiệp, an toàn",
        "Tư vấn trực tiếp",
        "Đảm bảo chất lượng mẫu",
        "Không lo lắng về kỹ thuật"
      ],
      requiresSchedule: true
    },
    {
      id: "diy_kit",
      name: "Gửi bộ kit tự thu mẫu",
      description: "Gửi bộ kit và hướng dẫn để bạn tự thu mẫu",
      icon: Package,
      benefits: [
        "Hoàn toàn riêng tư",
        "Linh hoạt về thời gian",
        "Hướng dẫn chi tiết",
        "Giao nhận tận nơi"
      ],
      requiresSchedule: false
    }
  ];

  // Thêm time slots cố định
  const timeSlots = [
    { id: "08:00", time: "08:00", label: "08:00 - 09:00", available: true },
    { id: "09:00", time: "09:00", label: "09:00 - 10:00", available: true },
    { id: "10:00", time: "10:00", label: "10:00 - 11:00", available: true },
    { id: "11:00", time: "11:00", label: "11:00 - 12:00", available: true },
    { id: "13:00", time: "13:00", label: "13:00 - 14:00", available: true },
    { id: "14:00", time: "14:00", label: "14:00 - 15:00", available: true },
    { id: "15:00", time: "15:00", label: "15:00 - 16:00", available: true },
    { id: "16:00", time: "16:00", label: "16:00 - 17:00", available: true },
    { id: "18:00", time: "18:00", label: "18:00 - 19:00", available: true },
    { id: "19:00", time: "19:00", label: "19:00 - 20:00", available: true },
  ];

  // Helper to determine if a given date + time slot is in the past (based on current client time)
  const isSlotInPast = (date: string, time: string): boolean => {
    if (!date || !time) return false;
    const slotDateTime = new Date(`${date}T${time}:00`);
    return slotDateTime < new Date();
  };

  // Hàm kiểm tra validation các trường bắt buộc của Step 4
  const isStep4Valid = () => {
    const requiredFields = formData.fullName && formData.phone && 
                          (
                            (useExistingAddress && selectedAddressId) || // Có chọn địa chỉ có sẵn
                            (!useExistingAddress && formData.addressLine && formData.city && formData.province) // Hoặc đã nhập đủ thông tin địa chỉ mới
                          );

    if (!requiredFields) return false;

    const needsAppointmentSchedule = (selectedLocation === 'home' && selectedHomeOption === 'staff_visit') || selectedLocation === 'facility';

    if (needsAppointmentSchedule) {
      // Kiểm tra có chọn date và time slot
      if (!(selectedDate && selectedTimeSlot)) return false;
      
      // Kiểm tra time slot đã chọn có bị đặt hay không
      if (bookedTimeSlots.includes(selectedTimeSlot)) {
        toast({
          title: "Khung giờ không hợp lệ",
          description: "Khung giờ bạn chọn đã có người đặt. Vui lòng chọn khung giờ khác.",
          variant: "destructive"
        });
        return false;
      }
      
      // Không cho phép đặt lịch trong quá khứ
      if (isSlotInPast(selectedDate, selectedTimeSlot)) {
        toast({
          title: "Khung giờ không hợp lệ",
          description: "Không thể đặt lịch trong quá khứ. Vui lòng chọn khung giờ khác.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    }
    
    return true; // For 'diy_kit' case, no appointment needed
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
    if (isStep4Valid()) {
      setStep(5);
      setShowValidation(false); // Reset validation state
    } else {
      setShowValidation(true); // Hiển thị validation errors
    }
  };

  // Hàm xử lý khi nhấn "Xác nhận đặt lịch" - chuyển đến trang thanh toán
  const handleConfirmBooking = async () => {
    try {
      setIsSubmittingBooking(true);
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData?.id || userData?.userId;
      
      // Sử dụng serviceId từ API thay vì mapping cứng
      const serviceId = parseInt(selectedServiceData?.serviceId || selectedRelationship);

      if (!userId || !serviceId) {
        toast({
          title: "Lỗi đặt lịch",
          description: "Vui lòng đăng nhập và chọn dịch vụ hợp lệ trước khi đặt lịch!",
          variant: "destructive"
        });
        return;
      }

      // Double-check time slot conflicts trước khi submit
      const needsAppointment = (selectedLocation === 'home' && selectedHomeOption === 'staff_visit') || selectedLocation === 'facility';
      if (needsAppointment && selectedTimeSlot && bookedTimeSlots.includes(selectedTimeSlot)) {
        // Refresh lại booked slots để đảm bảo data mới nhất
        await loadBookedTimeSlots(selectedDate);
        toast({
          title: "Khung giờ đã được đặt",
          description: "Khung giờ bạn chọn vừa có người đặt. Vui lòng chọn khung giờ khác.",
          variant: "destructive"
        });
        return;
      }

      // Không cho phép đặt lịch trong quá khứ (double-check trước khi gửi server)
      if (needsAppointment && selectedTimeSlot && isSlotInPast(selectedDate, selectedTimeSlot)) {
        toast({
          title: "Khung giờ không hợp lệ",
          description: "Không thể đặt lịch trong quá khứ. Vui lòng chọn khung giờ khác.",
          variant: "destructive"
        });
        return;
      }

      // Tạo địa chỉ mới trước (optional, để lưu thông tin địa chỉ của khách hàng)
      let addressId = null;
      try {
        // Nếu dùng địa chỉ có sẵn, lấy addressId từ selection
        if (useExistingAddress && selectedAddressId) {
          addressId = parseInt(selectedAddressId);
          console.log('📍 Sử dụng địa chỉ có sẵn:', addressId);
        } else if (formData.addressLine && formData.city && formData.province) {
          // Tạo địa chỉ mới
          const addressData = {
            label: formData.addressLabel || 'Địa chỉ booking',
            addressLine: formData.addressLine,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode || '',
            country: formData.country,
            isPrimary: formData.isPrimary
          };
          
          console.log('📍 Tạo địa chỉ:', addressData);
          const addressResponse = await addressAPI.create(userId, addressData);
          addressId = addressResponse?.id || addressResponse?.addressId;
          console.log('✅ Địa chỉ đã tạo:', addressResponse);
        }
      } catch (addressError) {
        console.warn('⚠️ Không thể tạo địa chỉ:', addressError);
        // Vẫn tiếp tục với booking ngay cả khi tạo địa chỉ thất bại
      }

      // Kiểm tra xem có phải là self-request (DIY kit) không
      const isSelfRequest = selectedLocation === 'home' && selectedHomeOption === 'diy_kit';
      
      let response;
      
      if (isSelfRequest) {
        // Sử dụng API self-request cho DIY kit
        const selfRequestData = {
          userId: parseInt(userId),
          serviceId: serviceId,
          collectionType: 'Self',
          status: 'Pending',
          staffId: null, // Không cần staff cho self-request
          appointmentDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
          slotTime: '' // Không cần slot time cho self-request
        };
        
        console.log('📦 Gửi self-request theo API schema:', selfRequestData);
        response = await testRequestAPI.createSelfRequest(selfRequestData);
        console.log('✅ Self-request thành công:', response);
      } else {
        // Sử dụng API thông thường cho các trường hợp khác
        let collectionType = 'At Clinic';
        if (selectedLocation === 'home') {
          collectionType = 'At Home';
        }

        const bookingData = {
          userId: parseInt(userId),
          serviceId: serviceId,
          collectionType: collectionType, // 'At Clinic' | 'At Home'
          status: 'Pending',
          appointmentDate: selectedDate || new Date().toISOString().split('T')[0],
          slotTime: selectedTimeSlot || '',
          staffId: null
        };

        console.log('📦 Gửi booking theo API schema:', bookingData);
        response = await testRequestAPI.create(bookingData);
        console.log('✅ Booking thành công:', response);
      }

      // Lưu thông tin booking và user info để sử dụng sau
      const bookingInfo = {
        ...response,
        userInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          addressId: addressId,
          fullAddress: [
            formData.addressLine,
            formData.city,
            formData.province,
            formData.postalCode,
            formData.country
          ].filter(Boolean).join(', '),
          notes: formData.notes
        },
        serviceInfo: selectedServiceData
      };

      // Lưu vào localStorage để sử dụng ở payment page
      localStorage.setItem('currentBooking', JSON.stringify(bookingInfo));
      
      const bookingId = response?.id || response?.requestId || response?.testRequestId;
      
      // Hiển thị thông báo thành công
      const successTitle = isSelfRequest ? "Yêu cầu gửi kit thành công! 🎉" : "Đặt lịch thành công! 🎉";
      const successDescription = isSelfRequest 
        ? `Mã yêu cầu: ${bookingId || 'N/A'}. Chúng tôi sẽ gửi bộ kit đến địa chỉ của bạn trong 3-5 ngày làm việc. Đang chuyển đến trang thanh toán...`
        : `Mã đặt lịch: ${bookingId || 'N/A'}. Đang chuyển đến trang thanh toán...`;
      
      toast({
        title: successTitle,
        description: successDescription,
      });

      // Chuyển đến trang thanh toán sau 1 giây
      setTimeout(() => {
        if (bookingId) {
          localStorage.setItem('bookingId', bookingId.toString());
          navigate(`/payment?bookingId=${bookingId}`);
        } else {
          navigate('/payment');
        }
      }, 1000);
    } catch (error) {
      let message = 'Đặt lịch thất bại. Vui lòng thử lại!';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      
      toast({
        title: "Đặt lịch thất bại!",
        description: message,
        variant: "destructive"
      });
      console.error('❌ Booking lỗi:', error);
    } finally {
      setIsSubmittingBooking(false);
    }
  };


  const BookingSteps = () => {
    const steps = [
      { number: 1, title: "Chọn dịch vụ", description: "Dân sự hoặc hành chính" },
      { number: 2, title: "Loại quan hệ", description: "Chọn loại xét nghiệm" },
      { number: 3, title: "Hình thức", description: "Thu mẫu tại nhà hoặc cơ sở" },
      { number: 4, title: "Thông tin", description: "Điền thông tin cá nhân" },
      { number: 5, title: "Xác nhận", description: "Xác nhận và thanh toán" }
    ];

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 md:space-x-4">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex flex-col items-center ${step >= stepItem.number ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                  step >= stepItem.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepItem.number ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : stepItem.number}
                </div>
                <div className="text-xs mt-1 md:mt-2 text-center max-w-16 md:max-w-none">
                  <div className="font-medium text-xs md:text-sm">{stepItem.title}</div>
                  <div className="text-gray-500 hidden md:block">{stepItem.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className={`w-4 h-4 mx-1 md:mx-4 ${step > stepItem.number ? 'text-blue-600' : 'text-gray-400'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Gọi API để lấy thông tin người dùng (nếu có) và thiết lập dữ liệu ban đầu cho form
  useEffect(() => {
    const loadUserData = async () => {
      // Lấy thông tin user từ localStorage nếu có
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const userId = user?.id || user?.userId;
          
          setFormData(prev => ({
            ...prev,
            fullName: user.fullName || user.name || "",
            phone: user.phone || "",
            email: user.email || ""
          }));

          // Load địa chỉ của user nếu có userId
          if (userId) {
            try {
              const addresses = await addressAPI.getByUserId(userId);
              if (addresses && addresses.length > 0) {
                // Chọn địa chỉ primary hoặc địa chỉ đầu tiên
                const primaryAddress = addresses.find(addr => addr.isPrimary) || addresses[0];
                setFormData(prev => ({
                  ...prev,
                  addressLabel: primaryAddress.label || "",
                  addressLine: primaryAddress.addressLine || "",
                  city: primaryAddress.city || "",
                  province: primaryAddress.province || "",
                  postalCode: primaryAddress.postalCode || "",
                  country: primaryAddress.country || "Việt Nam",
                  isPrimary: false // Không set làm primary cho booking address
                }));
              }
            } catch (addressError) {
              console.log('Không thể load địa chỉ user:', addressError);
            }
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    };
    
    loadUserData();
  }, []);

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

          {/* Step 1: Select Service Type */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Chọn loại dịch vụ xét nghiệm</CardTitle>
                <CardDescription>
                  Lựa chọn loại dịch vụ phù hợp với mục đích sử dụng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ml-4 ${
                            selectedService === service.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedService === service.id && (
                              <CheckCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {service.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <TestTube className="w-4 h-4 mr-1" />
                            <span className="font-medium text-blue-600">{service.price}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Hình thức:</span>
                          {service.locations.includes('home') && (
                            <Badge variant="outline" className="text-xs">
                              <Home className="w-3 h-3 mr-1" />
                              Tại nhà
                            </Badge>
                          )}
                          {service.locations.includes('facility') && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              Tại cơ sở
                            </Badge>
                          )}
                        </div>
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

          {/* Step 2: Select Relationship Type */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Chọn loại quan hệ cần xét nghiệm</CardTitle>
                <CardDescription>
                  Lựa chọn loại quan hệ huyết thống cần xác định
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingServices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-600">Đang tải danh sách dịch vụ...</span>
                  </div>
                ) : testServices.filter(service => service.isActive).length === 0 ? (
                  <div className="text-center py-8">
                    <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Không có dịch vụ xét nghiệm nào khả dụng</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {testServices.filter(service => service.isActive).map((service) => (
                      <div
                        key={service.serviceId}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedRelationship === service.serviceId?.toString()
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          console.log('Clicking service:', service.serviceId, service.name); // Debug log
                          setSelectedRelationship(service.serviceId?.toString() || '');
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {service.name || 'Dịch vụ xét nghiệm'}
                              </h3>
                              <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ml-4 ${
                                selectedRelationship === service.serviceId?.toString()
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedRelationship === service.serviceId?.toString() && (
                                  <CheckCircle className="w-5 h-5 text-white" />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">
                              {service.description || 'Mô tả dịch vụ xét nghiệm'}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <TestTube className="w-4 h-4 mr-1" />
                                <span className="font-medium text-blue-600">
                                  {service.price ? `${service.price.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ để biết giá'}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {service.duration || '5-7 ngày'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    className="flex-1" 
                    disabled={!selectedRelationship || isLoadingServices || testServices.filter(service => service.isActive).length === 0}
                    onClick={() => setStep(3)}
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Location */}
          {step === 3 && (
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
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedLocation(location.id);
                            if (location.id !== 'home') {
                              setSelectedHomeOption("");
                            }
                          }
                        }}
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

                {/* Home Options - Show when home is selected */}
                {selectedLocation === 'home' && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Chọn hình thức thu mẫu tại nhà
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {homeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <div
                            key={option.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedHomeOption === option.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              setSelectedHomeOption(option.id);
                              // Reset date and time if switching to DIY kit
                              if (option.id === 'diy_kit') {
                                setSelectedDate("");
                                setSelectedTimeSlot("");
                              }
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                selectedHomeOption === option.id ? 'bg-blue-100' : 'bg-gray-100'
                              }`}>
                                <Icon className={`w-5 h-5 ${
                                  selectedHomeOption === option.id ? 'text-blue-600' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 ${
                                selectedHomeOption === option.id
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedHomeOption === option.id && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {option.name}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3">
                              {option.description}
                            </p>
                            
                            <ul className="space-y-1">
                              {option.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center text-xs text-gray-700">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    className="flex-1" 
                    disabled={!selectedLocation || (selectedLocation === 'home' && !selectedHomeOption)}
                    onClick={() => setStep(4)}
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Personal Information */}
          {step === 4 && (
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

                {/* Address fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Địa chỉ {selectedLocation === 'home' ? 'thu mẫu' : 'liên hệ'} *
                  </h3>
                  
                  {/* Address Selection Options */}
                  {existingAddresses.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="addressOption"
                            checked={useExistingAddress}
                            onChange={() => setUseExistingAddress(true)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Sử dụng địa chỉ có sẵn
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="addressOption"
                            checked={!useExistingAddress}
                            onChange={handleUseNewAddress}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Nhập địa chỉ mới
                          </span>
                        </label>
                      </div>
                      
                      {useExistingAddress && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn địa chỉ có sẵn *
                          </label>
                          {isLoadingAddresses ? (
                            <div className="flex items-center py-2">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              <span className="text-sm text-gray-600">Đang tải địa chỉ...</span>
                            </div>
                          ) : (
                            <select
                              value={selectedAddressId}
                              onChange={(e) => handleSelectExistingAddress(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                showValidation && useExistingAddress && !selectedAddressId ? 'border-red-300' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Chọn địa chỉ...</option>
                              {existingAddresses.map((address) => {
                                const addressId = (address.id || address.addressId || '').toString();
                                const fullAddress = [
                                  address.addressLine,
                                  address.city,
                                  address.province,
                                  address.country
                                ].filter(Boolean).join(', ');
                                
                                return (
                                  <option key={addressId} value={addressId}>
                                    {address.label ? `${address.label}: ` : ''}{fullAddress}
                                    {address.isPrimary ? ' (Chính)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                          )}
                          {showValidation && useExistingAddress && !selectedAddressId && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng chọn địa chỉ</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Always show address display when using existing address */}
                  {useExistingAddress && selectedAddressId && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Địa chỉ đã chọn:</h4>
                      <div className="text-blue-800 text-sm">
                        <p className="font-medium">{formData.addressLabel || 'Địa chỉ'}</p>
                        <p>{formData.addressLine}</p>
                        <p>{[formData.city, formData.province, formData.country].filter(Boolean).join(', ')}</p>
                        {formData.postalCode && <p>Mã BĐ: {formData.postalCode}</p>}
                      </div>
                    </div>
                  )}
                  
                  {/* Address Form - Show only when using new address or no existing addresses */}
                  {!useExistingAddress && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nhãn địa chỉ
                        </label>
                        <Input 
                          placeholder="Ví dụ: Nhà riêng, Văn phòng, Địa chỉ booking..." 
                          value={formData.addressLabel}
                          onChange={(e) => updateFormData('addressLabel', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ chi tiết *
                        </label>
                        <Textarea 
                          placeholder="Số nhà, tên đường, phường/xã..." 
                          rows={2} 
                          value={formData.addressLine}
                          onChange={(e) => updateFormData('addressLine', e.target.value)}
                          className={showValidation && !formData.addressLine ? 'border-red-300 focus:border-red-500' : ''}
                        />
                        {showValidation && !formData.addressLine && (
                          <p className="text-red-500 text-xs mt-1">Vui lòng nhập địa chỉ chi tiết</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thành phố/Quận/Huyện *
                          </label>
                          <Input 
                            placeholder="Nhập thành phố hoặc quận/huyện" 
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            className={showValidation && !formData.city ? 'border-red-300 focus:border-red-500' : ''}
                          />
                          {showValidation && !formData.city && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng nhập thành phố</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tỉnh/Thành phố *
                          </label>
                          <Input 
                            placeholder="Nhập tỉnh/thành phố" 
                            value={formData.province}
                            onChange={(e) => updateFormData('province', e.target.value)}
                            className={showValidation && !formData.province ? 'border-red-300 focus:border-red-500' : ''}
                          />
                          {showValidation && !formData.province && (
                            <p className="text-red-500 text-xs mt-1">Vui lòng nhập tỉnh/thành phố</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã bưu điện
                          </label>
                          <Input 
                            placeholder="Mã bưu điện (không bắt buộc)" 
                            value={formData.postalCode}
                            onChange={(e) => updateFormData('postalCode', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quốc gia
                          </label>
                          <Input 
                            placeholder="Quốc gia" 
                            value={formData.country}
                            onChange={(e) => updateFormData('country', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="isPrimary"
                          checked={formData.isPrimary}
                          onChange={(e) => updateFormData('isPrimary', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isPrimary" className="text-sm text-gray-700">
                          Đặt làm địa chỉ chính của tôi
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {/* Appointment scheduling fields */}
                {((selectedLocation === 'home' && selectedHomeOption === 'staff_visit') || selectedLocation === 'facility') && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Lên lịch hẹn
                    </h3>
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
                        min={new Date().toISOString().split('T')[0]}
                        className={showValidation && !selectedDate ? 'border-red-300 focus:border-red-500' : ''}
                      />
                      {showValidation && !selectedDate && (
                        <p className="text-red-500 text-xs mt-1">Vui lòng chọn ngày mong muốn</p>
                      )}
                    </div>
                    
                    {selectedDate && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Chọn khung giờ *
                            {isLoadingTimeSlots && (
                              <span className="ml-2 text-sm text-blue-600">
                                <Loader2 className="w-4 h-4 inline animate-spin mr-1" />
                                Đang kiểm tra lịch trống...
                              </span>
                            )}
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => loadBookedTimeSlots(selectedDate)}
                            disabled={isLoadingTimeSlots || !selectedDate}
                            className="text-xs px-2 py-1 h-6"
                          >
                            🔄 Làm mới
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {timeSlots.map((slot) => {
                            const isBooked = bookedTimeSlots.includes(slot.time);
                            const isPast = isSlotInPast(selectedDate, slot.time);
                            const isDisabled = !slot.available || isBooked || isPast;
                            
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={isDisabled || isLoadingTimeSlots}
                                onClick={() => setSelectedTimeSlot(slot.id)}
                                className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                                  isDisabled
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
                                {isBooked && (
                                  <div className="text-xs text-red-500 mt-1 font-medium">
                                    Đã có người đặt
                                  </div>
                                )}
                                {!isBooked && isPast && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    Đã qua
                                  </div>
                                )}
                                {!slot.available && !isBooked && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    Không khả dụng
                                  </div>
                                )}
                                {isLoadingTimeSlots && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    Đang kiểm tra...
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Hiển thị thống kê slot */}
                        {!isLoadingTimeSlots && selectedDate && (
                          <div className="mt-3">
                            {bookedTimeSlots.length > 0 && (
                              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mb-3">
                                <div className="flex items-center justify-between text-amber-800">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">
                                      Thông tin lịch ngày {selectedDate}:
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-red-600 font-medium">{bookedTimeSlots.length} đã đặt</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-green-600 font-medium">
                                      {timeSlots.filter(slot => slot.available && !bookedTimeSlots.includes(slot.time) && !isSlotInPast(selectedDate, slot.time)).length} còn trống
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Warning khi hết slot */}
                            {timeSlots.filter(slot => slot.available && !bookedTimeSlots.includes(slot.time) && !isSlotInPast(selectedDate, slot.time)).length === 0 && (
                              <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-3">
                                <div className="flex items-center text-red-700">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span className="text-sm font-medium">
                                    Tất cả khung giờ trong ngày {selectedDate} đã được đặt. Vui lòng chọn ngày khác.
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

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

                {selectedLocation === 'home' && selectedHomeOption === 'diy_kit' && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start">
                      <Package className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">
                          Giao nhận bộ kit tự thu mẫu
                        </h4>
                        <p className="text-sm text-amber-700">
                          Chúng tôi sẽ gửi bộ kit cùng hướng dẫn chi tiết đến địa chỉ của bạn trong vòng 3-5 ngày làm việc. 
                          Sau khi thu mẫu, vui lòng gửi lại theo địa chỉ được cung cấp.
                        </p>
                      </div>
                    </div>
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
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      if (isStep4Valid()) {
                        setStep(5);
                        setShowValidation(false);
                      } else {
                        setShowValidation(true);
                      }
                    }}
                  >
                    Tiếp tục
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Xác nhận thông tin đặt lịch</CardTitle>
                <CardDescription>
                  Vui lòng kiểm tra lại thông tin trước khi xác nhận
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedLocation === 'home' && selectedHomeOption === 'diy_kit' 
                      ? 'Tóm tắt yêu cầu gửi kit' 
                      : 'Tóm tắt đặt lịch'
                    }
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại dịch vụ:</span>
                      <span className="font-medium">
                        {services.find(s => s.id === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại quan hệ:</span>
                      <span className="font-medium">
                        {selectedServiceData?.name || 'Dịch vụ xét nghiệm'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hình thức:</span>
                      <span className="font-medium">
                        {locations.find(l => l.id === selectedLocation)?.name}
                        {selectedLocation === 'home' && selectedHomeOption && (
                          <div className="text-sm text-gray-500 mt-1">
                            → {homeOptions.find(opt => opt.id === selectedHomeOption)?.name}
                          </div>
                        )}
                      </span>
                    </div>
                    {selectedLocation === 'home' && selectedHomeOption === 'staff_visit' && selectedDate && selectedTimeSlot && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lịch hẹn:</span>
                        <span className="font-medium">
                          {timeSlots.find(slot => slot.id === selectedTimeSlot)?.label} - {selectedDate}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian hoàn thành:</span>
                      <span className="font-medium">
                        {selectedServiceData?.duration || '5-7 ngày'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <div className="text-right font-medium max-w-md">
                        <div>{formData.addressLine}</div>
                        <div className="text-sm text-gray-500">
                          {[formData.city, formData.province, formData.country].filter(Boolean).join(', ')}
                        </div>
                        {formData.postalCode && (
                          <div className="text-sm text-gray-500">Mã BĐ: {formData.postalCode}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá dự kiến:</span>
                      <span className="font-medium text-lg text-blue-600">
                        {selectedServiceData?.price 
                          ? `${selectedServiceData.price.toLocaleString('vi-VN')} VNĐ`
                          : 'Liên hệ để biết giá'}
                      </span>
                    </div>
                    {selectedServiceData?.accuracy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Độ chính xác:</span>
                        <span className="font-medium text-green-600">
                          {selectedServiceData.accuracy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Quy trình tiếp theo:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    {selectedLocation === 'home' && selectedHomeOption === 'diy_kit' ? (
                      <>
                        <li>• Chúng tôi sẽ liên hệ trong vòng 30 phút để xác nhận</li>
                        <li>• Gửi hợp đồng và hướng dẫn chi tiết qua email</li>
                        <li>• Gửi bộ kit tự thu mẫu đến địa chỉ của bạn trong 3-5 ngày làm việc</li>
                        <li>• Bạn tự thu mẫu theo hướng dẫn và gửi lại</li>
                        <li>• Thông báo kết quả qua SMS/Email khi hoàn thành</li>
                      </>
                    ) : (
                      <>
                        <li>• Chúng tôi sẽ liên hệ trong vòng 30 phút để xác nhận</li>
                        <li>• Gửi hợp đồng và hướng dẫn chi tiết qua email</li>
                        {selectedLocation === 'home' && selectedHomeOption === 'staff_visit' && (
                          <li>• Nhân viên đến thu mẫu theo lịch hẹn</li>
                        )}
                        {selectedLocation === 'facility' && (
                          <li>• Bạn đến cơ sở theo lịch hẹn</li>
                        )}
                        <li>• Thông báo kết quả qua SMS/Email khi hoàn thành</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1" disabled={isSubmittingBooking}>
                    Quay lại
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600" 
                    onClick={handleConfirmBooking}
                    disabled={isSubmittingBooking}
                  >
                    {isSubmittingBooking ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        {selectedLocation === 'home' && selectedHomeOption === 'diy_kit' 
                          ? 'Xác nhận yêu cầu gửi kit'
                          : 'Xác nhận đặt lịch'
                        }
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
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
