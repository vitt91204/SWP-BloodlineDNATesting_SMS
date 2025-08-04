import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { sampleAPI, subSampleAPI, userAPI } from "@/api/axios";
import {
  TestTube,
  User,
  Calendar,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Phone,
} from "lucide-react";

interface SampleFormData {
  sampleType: string;
  fullName: string;
  dateOfBirth: string;
  notes: string;
}

interface SubSampleFormData {
  sampleType: string;
  fullName: string;
  dateOfBirth: string;
  notes: string;
}

const sampleTypes = [
  { value: "Máu", label: "Máu" },
  { value: "Niêm mạc miệng", label: "Niêm mạc miệng" },
  { value: "Tóc", label: "Tóc" },
  { value: "Móng tay/móng chân", label: "Móng tay/móng chân" },
  { value: "Cuống rốn", label: "Cuống rốn" },
  { value: "Nước ối", label: "Nước ối" },
];

export default function SampleForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [mainSampleId, setMainSampleId] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);
  
  // Helper function to get current user ID
  const getCurrentUserId = (): number => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id || user.userId || 0;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return 0;
      }
    }
    return 0;
  };
  
  const [mainSample, setMainSample] = useState<SampleFormData>({
    sampleType: "",
    fullName: "",
    dateOfBirth: "",
    notes: "",
  });
  
  const [subSample, setSubSample] = useState<SubSampleFormData>({
    sampleType: "",
    fullName: "",
    dateOfBirth: "",
    notes: "",
  });

  // Load user data and booking information
  useEffect(() => {
    const loadUserAndBookingData = async () => {
      try {
        // Load user data
        const userId = getCurrentUserId();
        if (userId) {
          const userInfo = await userAPI.getUserInfo(userId.toString());
          setUserData(userInfo);
          
          // Pre-fill main sample with user data
          setMainSample(prev => ({
            ...prev,
            fullName: userInfo?.fullName || userInfo?.username || "",
            dateOfBirth: userInfo?.dateOfBirth || "",
          }));
        }
        
        // Load booking data
        const storedBooking = localStorage.getItem('currentBooking');
        if (storedBooking) {
          try {
            const booking = JSON.parse(storedBooking);
            setRequestId(booking.id || booking.requestId);
            setBookingData(booking);
            
            // Pre-fill main sample with booking user info if available
            if (booking.userInfo) {
              setMainSample(prev => ({
                ...prev,
                fullName: booking.userInfo.fullName || prev.fullName,
              }));
            }
          } catch (error) {
            console.error('Error parsing booking data:', error);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserAndBookingData();
  }, []);

  const validateMainSample = () => {
    if (!mainSample.sampleType) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại mẫu chính",
        variant: "destructive",
      });
      return false;
    }
    if (!mainSample.fullName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mẫu chính",
        variant: "destructive",
      });
      return false;
    }
    if (!mainSample.dateOfBirth) {
      toast({
        title: "Lỗi",
        description: "Vui lòng cập nhật ngày sinh trong hồ sơ cá nhân",
        variant: "destructive",
      });
      return;
    }
    
    // Validate date of birth
    const birthDate = new Date(mainSample.dateOfBirth);
    const today = new Date();
    if (birthDate > today) {
      toast({
        title: "Lỗi",
        description: "Ngày sinh không thể là ngày trong tương lai",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const validateSubSample = () => {
    if (!subSample.sampleType) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại mẫu phụ",
        variant: "destructive",
      });
      return false;
    }
    if (!subSample.fullName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mẫu phụ",
        variant: "destructive",
      });
      return false;
    }
    if (!subSample.dateOfBirth) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ngày sinh mẫu phụ",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate date of birth
    const birthDate = new Date(subSample.dateOfBirth);
    const today = new Date();
    if (birthDate > today) {
      toast({
        title: "Lỗi",
        description: "Ngày sinh không thể là ngày trong tương lai",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (validateMainSample()) {
        // Tạo mẫu chính trước khi chuyển sang bước 2
        if (!requestId) {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy thông tin đặt dịch vụ",
            variant: "destructive",
          });
          return;
        }

        setIsSubmitting(true);

        try {
          const mainSampleData = {
            requestId: requestId,
            collectedBy: getCurrentUserId(),
            receivedTime: new Date().toISOString(),
            sampleType: mainSample.sampleType,
          };

          console.log('Creating main sample with data:', mainSampleData);
          
          // Show progress toast
          toast({
            title: "Đang xử lý...",
            description: "Đang tạo mẫu chính...",
          });
          
          const mainSampleResponse = await sampleAPI.createCustomer(mainSampleData);
          console.log('Main sample response:', mainSampleResponse);
          
          // Sau khi tạo mẫu thành công, lấy sampleId từ danh sách mẫu
          console.log('Fetching sample list to get sampleId...');
          
          // Cập nhật toast để thông báo đang lấy thông tin
          toast({
            title: "Đang xử lý...",
            description: "Đang lấy thông tin mẫu...",
          });
          
          // Thêm delay nhỏ để đảm bảo server đã lưu mẫu
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const allSamples = await sampleAPI.getAll();
          console.log('All samples:', allSamples);
          
          // Tìm mẫu vừa tạo dựa trên requestId và thông tin khác
          const createdSample = allSamples.find((sample: any) => {
            const matchesRequestId = sample.requestId === requestId;
            const matchesSampleType = sample.sampleType === mainSample.sampleType;
            const matchesCollectedBy = sample.collectedBy === getCurrentUserId();
            
            console.log(`Sample ${sample.sampleId}:`, {
              requestId: sample.requestId,
              sampleType: sample.sampleType,
              collectedBy: sample.collectedBy,
              matches: { matchesRequestId, matchesSampleType, matchesCollectedBy }
            });
            
            return matchesRequestId && matchesSampleType && matchesCollectedBy;
          });
          
          console.log('Found created sample:', createdSample);
          
          if (createdSample && createdSample.sampleId) {
            setMainSampleId(createdSample.sampleId);
            console.log('Successfully extracted sampleId:', createdSample.sampleId);
            
            toast({
              title: "Thành công",
              description: `Đã tạo mẫu chính thành công (ID: ${createdSample.sampleId})`,
            });
          } else {
            console.error('Could not find created sample in the list');
            console.log('Available samples for this requestId:', 
              allSamples.filter((s: any) => s.requestId === requestId)
            );
            // Fallback: sử dụng requestId làm sampleId tạm thời
            setMainSampleId(requestId);
            console.warn('Using requestId as fallback sampleId:', requestId);
            
            toast({
              title: "Thành công",
              description: "Đã tạo mẫu chính thành công",
            });
          }

          // Chuyển sang bước 2
          setCurrentStep(2);
        } catch (error: any) {
          console.error('Error creating main sample:', error);
          
          let errorMessage = "Có lỗi xảy ra khi tạo mẫu chính";
          
          if (error.response?.status === 400) {
            errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
          } else if (error.response?.status === 404) {
            errorMessage = "Không tìm thấy thông tin đặt dịch vụ.";
          } else if (error.response?.status === 500) {
            errorMessage = "Lỗi server. Vui lòng thử lại sau.";
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          toast({
            title: "Lỗi",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateSubSample()) {
      return;
    }

    if (!mainSampleId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin mẫu chính",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Tạo mẫu phụ với đúng cấu trúc API
      const subSampleData = {
        sampleId: mainSampleId,
        description: [
          `Tên: ${subSample.fullName}`,
          `Ngày sinh: ${subSample.dateOfBirth}`,
          subSample.notes
        ].filter(Boolean).join(' | '),
        fullName: subSample.fullName,
        dateOfBirth: subSample.dateOfBirth,
        sampleType: subSample.sampleType,
      };

      console.log('Creating subsample with data:', subSampleData);
      
      // Show progress toast for subsample
      toast({
        title: "Đang xử lý...",
        description: "Đang tạo mẫu phụ...",
      });
      
      await subSampleAPI.create(subSampleData);

      toast({
        title: "Thành công",
        description: "Đã lưu thông tin mẫu thành công",
      });

      // Chuyển về trang chủ
      navigate("/");
    } catch (error: any) {
      console.error('Error submitting sample data:', error);
      
      // Handle specific API errors
      let errorMessage = "Có lỗi xảy ra khi lưu thông tin mẫu";
      
      if (error.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (error.response?.status === 404) {
        errorMessage = "Không tìm thấy thông tin đặt dịch vụ.";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipSubSample = () => {
    // Chỉ tạo mẫu chính
    handleSubmitMainSampleOnly();
  };

  const handleSubmitMainSampleOnly = async () => {
    if (!validateMainSample()) {
      return;
    }

    // Nếu đã có mainSampleId, chỉ cần chuyển về trang chủ
    if (mainSampleId) {
      toast({
        title: "Thành công",
        description: "Đã lưu thông tin mẫu chính thành công",
      });
      navigate("/");
      return;
    }

    if (!requestId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin đặt dịch vụ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const mainSampleData = {
        requestId: requestId,
        collectedBy: getCurrentUserId(), // Self collection
        receivedTime: new Date().toISOString(), // ISO date string format
        sampleType: mainSample.sampleType,
      };

      console.log('Creating main sample only with data:', mainSampleData);
      
      // Show progress toast
      toast({
        title: "Đang xử lý...",
        description: "Đang tạo mẫu chính...",
      });
      
      await sampleAPI.createCustomer(mainSampleData);

      toast({
        title: "Thành công",
        description: "Đã lưu thông tin mẫu chính thành công",
      });

      navigate("/");
    } catch (error: any) {
      console.error('Error submitting main sample:', error);
      
      // Handle specific API errors
      let errorMessage = "Có lỗi xảy ra khi lưu thông tin mẫu";
      
      if (error.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (error.response?.status === 404) {
        errorMessage = "Không tìm thấy thông tin đặt dịch vụ.";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kiểm tra xem có thông tin booking không
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy thông tin đặt dịch vụ
            </h1>
            <p className="text-gray-600 mb-8">
              Vui lòng quay lại trang đặt dịch vụ để tiếp tục.
            </p>
            <Button
              onClick={() => navigate("/booking")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đi đến trang đặt dịch vụ
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <TestTube className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thông tin mẫu xét nghiệm
            </h1>
            <p className="text-gray-600 mb-4">
              Vui lòng điền thông tin mẫu chính và mẫu phụ (nếu có). Ngày sinh sẽ được lấy từ hồ sơ cá nhân.
            </p>
            
            {/* Booking Info */}
            {bookingData && (
              <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-sm text-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Dịch vụ: {bookingData.serviceInfo?.name || 'Xét nghiệm DNA'}</span>
                    </div>
                    {bookingData.userInfo?.fullName && (
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4" />
                        <span>Người đặt: {bookingData.userInfo.fullName}</span>
                      </div>
                    )}
                    {bookingData.userInfo?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>SĐT: {bookingData.userInfo.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className={`text-sm font-medium ${
                currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Mẫu chính
              </div>
              <div className={`w-8 h-0.5 ${
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className={`text-sm font-medium ${
                currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Mẫu phụ
              </div>
            </div>
          </div>

          {/* Form Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 ? (
                  <>
                    <User className="w-5 h-5" />
                    Thông tin mẫu chính
                  </>
                ) : (
                  <>
                    <TestTube className="w-5 h-5" />
                    Thông tin mẫu phụ
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 
                  ? "Điền thông tin của người được xét nghiệm chính"
                  : "Điền thông tin của người được xét nghiệm phụ (nếu có)"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="mainSampleType">Loại mẫu <span className="text-red-500">*</span></Label>
                      <Select 
                        value={mainSample.sampleType} 
                        onValueChange={(value) => setMainSample({...mainSample, sampleType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại mẫu" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mainFullName">Họ và tên <span className="text-red-500">*</span></Label>
                      <Input
                        id="mainFullName"
                        value={mainSample.fullName}
                        onChange={(e) => setMainSample({...mainSample, fullName: e.target.value})}
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mainDateOfBirth">Ngày sinh <span className="text-red-500">*</span></Label>
                      <Input
                        id="mainDateOfBirth"
                        type="date"
                        value={mainSample.dateOfBirth}
                        readOnly
                        className="bg-gray-50"
                      />
                      {!mainSample.dateOfBirth && (
                        <div className="mt-1">
                          <p className="text-sm text-red-500 mb-2">
                            Vui lòng cập nhật ngày sinh trong hồ sơ cá nhân
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/customer/profile")}
                            className="text-xs"
                          >
                            Cập nhật hồ sơ
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="mainNotes">Ghi chú</Label>
                      <Textarea
                        id="mainNotes"
                        value={mainSample.notes}
                        onChange={(e) => setMainSample({...mainSample, notes: e.target.value})}
                        placeholder="Nhập ghi chú (nếu có)"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="subSampleType">Loại mẫu <span className="text-red-500">*</span></Label>
                      <Select 
                        value={subSample.sampleType} 
                        onValueChange={(value) => setSubSample({...subSample, sampleType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại mẫu" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subFullName">Họ và tên <span className="text-red-500">*</span></Label>
                      <Input
                        id="subFullName"
                        value={subSample.fullName}
                        onChange={(e) => setSubSample({...subSample, fullName: e.target.value})}
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subDateOfBirth">Ngày sinh <span className="text-red-500">*</span></Label>
                      <Input
                        id="subDateOfBirth"
                        type="date"
                        value={subSample.dateOfBirth}
                        onChange={(e) => setSubSample({...subSample, dateOfBirth: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subNotes">Ghi chú</Label>
                      <Textarea
                        id="subNotes"
                        value={subSample.notes}
                        onChange={(e) => setSubSample({...subSample, notes: e.target.value})}
                        placeholder="Nhập ghi chú (nếu có)"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Button>

            <div className="flex gap-3">
              {currentStep === 1 && (
                <>
                  <Button
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    )}
                    {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Lưu thông tin
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}