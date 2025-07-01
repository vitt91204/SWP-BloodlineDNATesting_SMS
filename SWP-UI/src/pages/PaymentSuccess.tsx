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
  Mail
} from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();

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

          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
} 