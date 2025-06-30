import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, CheckCircle, FileText, Calendar, User, Microscope } from "lucide-react";
import axios from '@/api/axios';

export default function Results() {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        // Thay đổi endpoint cho đúng với API backend của bạn
        const response = await axios.get('/api/customer/result-detail');
        setSearchResult(response.data);
      } catch (err: any) {
        setError('Không thể tải dữ liệu kết quả xét nghiệm');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Kết quả xét nghiệm
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kết quả xét nghiệm ADN chi tiết và chính xác. Thông tin được bảo mật và chỉ hiển thị cho người có quyền truy cập.
            </p>
          </div>

          {/* Results Display */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : searchResult ? (
          <div className="space-y-6">
            {/* Result Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">
                      {searchResult.service}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Mã xét nghiệm: {searchResult.id}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Hoàn thành
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Test Information */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Thông tin mẫu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {searchResult.participants.map((participant, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{participant.name}</div>
                      <div className="text-sm text-gray-600">
                        {participant.relationship} • Mã mẫu: {participant.sampleId}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Thông tin xét nghiệm</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày nhận mẫu:</span>
                    <span className="font-medium">{searchResult.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hoàn thành:</span>
                    <span className="font-medium">{searchResult.labInfo.completedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kỹ thuật viên:</span>
                    <span className="font-medium">{searchResult.labInfo.technician}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phê duyệt:</span>
                    <span className="font-medium">{searchResult.labInfo.reviewer}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Kết quả tóm tắt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <div className="text-lg font-bold text-green-900 mb-2">
                      {searchResult.result.conclusion}
                    </div>
                    <div className="text-green-700">
                      Độ tin cậy: {searchResult.result.probability}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Microscope className="w-5 h-5" />
                  <span>Kết quả chi tiết</span>
                </CardTitle>
                <CardDescription>
                  Phân tích các marker DNA được sử dụng trong xét nghiệm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">
                          Marker DNA
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">
                          {searchResult.participants[0].name}
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">
                          {searchResult.participants[1].name}
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResult.result.details.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {detail.marker}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            {detail.value1}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            {detail.value2}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            <Badge className="bg-green-100 text-green-700">
                              Phù hợp
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Giải thích kết quả:</h4>
                  <p className="text-blue-800 text-sm">
                    Kết quả cho thấy có sự tương đồng cao về DNA giữa hai mẫu được xét nghiệm. 
                    Với độ tin cậy 99.99%, có thể khẳng định hai người có quan hệ huyết thống cha-con.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600">
                    <Download className="w-5 h-5 mr-2" />
                    Tải báo cáo PDF
                  </Button>
                  <Button size="lg" variant="outline">
                    <Mail className="w-5 h-5 mr-2" />
                    Gửi qua Email
                  </Button>
                  <Button size="lg" variant="outline">
                    <FileText className="w-5 h-5 mr-2" />
                    In kết quả
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-center text-sm text-gray-500">
                  <p>Kết quả xét nghiệm có giá trị trong vòng 2 năm kể từ ngày phát hành.</p>
                  <p>Để được tư vấn thêm về kết quả, vui lòng liên hệ hotline: 1900 1234</p>
                </div>
              </CardContent>
            </Card>
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Không có dữ liệu kết quả xét nghiệm</div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
