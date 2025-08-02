import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Home, 
  Calendar,
  Receipt,
  Clock,
  User,
  Phone,
  Mail,
  TestTube
} from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isSelfCollection, setIsSelfCollection] = useState(false);

  useEffect(() => {
    // Lấy thông tin booking từ localStorage
    const storedBooking = localStorage.getItem('currentBooking');
    if (storedBooking) {
      try {
        const booking = JSON.parse(storedBooking);
        setBookingData(booking);
        // Kiểm tra xem có phải là dịch vụ tự thu mẫu không
        const isSelf = booking.collectionType === 'Self' || 
                      booking.serviceInfo?.collectionType === 'Self' ||
                      booking.collectionType === 'diy_kit' ||
                      booking.serviceInfo?.collectionType === 'diy_kit';
        setIsSelfCollection(isSelf);
      } catch (error) {
        console.error('Error parsing booking data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Navigation />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="mx-auto w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thanh toán thành công
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Button>
            
            {isSelfCollection && (
              <Button
                onClick={() => navigate("/customer/sample-form")}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                <TestTube className="w-5 h-5 mr-2" />
                Điền thông tin mẫu (tự thu mẫu)
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 