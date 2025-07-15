import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Mail, 
  FileText, 
  Calendar, 
  User, 
  Microscope,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TestTube,
  Clock
} from "lucide-react";
import { useParams } from "react-router-dom";
import { testResultAPI } from "@/api/axios";

interface TestResult {
  id: string;
  testId: string;
  customerName: string;
  testType: string;
  sampleId: string;
  analysisDate: string;
  completionDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'reviewed' | 'delivered';
  technician: string;
  reviewer: string;
  confidence: number;
  result: 'positive' | 'negative' | 'inconclusive';
  markers: MarkerResult[];
  notes: string;
  reportFile?: string;
  qualityScore: number;
  participants: Participant[];
}

interface MarkerResult {
  marker: string;
  value1: string;
  value2: string;
  match: boolean;
  confidence: number;
}

interface Participant {
  name: string;
  relationship: string;
  sampleId: string;
}

// Sample data
const sampleResult: TestResult = {
  id: "RES001",
  testId: "XN001",
  customerName: "Nguyễn Văn A",
  testType: "Xét nghiệm huyết thống dân sự",
  sampleId: "SMP001",
  analysisDate: "2024-03-18",
  completionDate: "2024-03-20",
  status: "delivered",
  technician: "Nguyễn Thị B",
  reviewer: "Dr. Lê Văn C",
  confidence: 99.99,
  result: "positive",
  markers: [
    { marker: "D3S1358", value1: "15,16", value2: "15,16", match: true, confidence: 99.9 },
    { marker: "vWA", value1: "17,18", value2: "17,18", match: true, confidence: 99.9 },
    { marker: "FGA", value1: "22,24", value2: "22,24", match: true, confidence: 99.9 },
    { marker: "D8S1179", value1: "13,14", value2: "13,14", match: true, confidence: 99.9 },
    { marker: "D21S11", value1: "29,31", value2: "29,31", match: true, confidence: 99.9 },
    { marker: "D18S51", value1: "16,18", value2: "16,18", match: true, confidence: 99.9 },
    { marker: "D5S818", value1: "11,12", value2: "11,12", match: true, confidence: 99.9 },
    { marker: "D13S317", value1: "8,11", value2: "8,11", match: true, confidence: 99.9 },
    { marker: "D7S820", value1: "10,12", value2: "10,12", match: true, confidence: 99.9 },
    { marker: "D16S539", value1: "9,12", value2: "9,12", match: true, confidence: 99.9 }
  ],
  notes: "Kết quả cho thấy có sự tương đồng cao về DNA giữa hai mẫu được xét nghiệm. Với độ tin cậy 99.99%, có thể khẳng định hai người có quan hệ huyết thống cha-con. Tất cả các marker DNA được kiểm tra đều phù hợp, cho thấy mối quan hệ huyết thống rất cao.",
  qualityScore: 95,
  participants: [
    { name: "Nguyễn Văn A", relationship: "Cha", sampleId: "SMP001-A" },
    { name: "Nguyễn Văn B", relationship: "Con", sampleId: "SMP001-B" }
  ]
};

export default function TestResultDetail() {
  const { resultId } = useParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await testResultAPI.getCustomerResult(Number(resultId));
        setResult(data);
      } catch (err: any) {
        console.error("Error fetching result:", err);
        setError('Không thể tải kết quả xét nghiệm');
      } finally {
        setLoading(false);
      }
    };
    
    if (resultId) {
      fetchResult();
    }
  }, [resultId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700">Đã gửi</Badge>;
      case "reviewed":
        return <Badge className="bg-blue-100 text-blue-700">Đã phê duyệt</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-700">Hoàn thành</Badge>;
      case "in_progress":
        return <Badge className="bg-orange-100 text-orange-700">Đang phân tích</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ phân tích</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "positive":
        return <Badge className="bg-green-100 text-green-700">Dương tính</Badge>;
      case "negative":
        return <Badge className="bg-red-100 text-red-700">Âm tính</Badge>;
      case "inconclusive":
        return <Badge className="bg-yellow-100 text-yellow-700">Không xác định</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Chưa có</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Đang tải kết quả xét nghiệm...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy kết quả xét nghiệm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kết quả xét nghiệm
          </h1>
          <p className="text-xl text-gray-600">
            Kết quả xét nghiệm ADN chi tiết và chính xác
          </p>
        </div>

        <div className="space-y-6">
          {/* Result Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    {result.testType}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Mã xét nghiệm: {result.testId}</span>
                    <span>Mã kết quả: {result.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(result.status)}
                  <div className="mt-2">
                    {getResultBadge(result.result)}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Test Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Thông tin mẫu</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.participants.map((participant, index) => (
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
                  <span className="font-medium">{result.analysisDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-medium">{result.completionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kỹ thuật viên:</span>
                  <span className="font-medium">{result.technician}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phê duyệt:</span>
                  <span className="font-medium">{result.reviewer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Độ tin cậy:</span>
                  <span className="font-medium text-green-600">{result.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Điểm chất lượng:</span>
                  <span className="font-medium text-blue-600">{result.qualityScore}%</span>
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
                        {result.participants[0]?.name || "Người 1"}
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">
                        {result.participants[1]?.name || "Người 2"}
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">
                        Trạng thái
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-900">
                        Độ tin cậy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.markers.map((detail, index) => (
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
                          {detail.match ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <Badge className="bg-green-100 text-green-700">
                                Phù hợp
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <Badge className="bg-red-100 text-red-700">
                                Không phù hợp
                              </Badge>
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          {detail.confidence}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Giải thích kết quả:</h4>
                <p className="text-blue-800 text-sm">
                  {result.notes}
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
      </div>
    </div>
  );
} 