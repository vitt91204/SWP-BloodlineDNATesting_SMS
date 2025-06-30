import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  FileText, 
  PlusCircle,
  Upload,
  Download,
  Send,
  Eye
} from 'lucide-react';
import axios from '@/api/axios';

interface TestResult {
  id: string;
  testName: string;
  customerName: string;
  testDate: string;
  status: 'Ready' | 'Delivered' | 'Pending Upload';
  resultFile?: string;
  deliveryDate?: string;
}

export default function ResultsDelivery() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        setError(null);
        // Thay đổi endpoint cho đúng với API backend của bạn
        const response = await axios.get('/api/test-results');
        setTestResults(response.data);
      } catch (err: any) {
        setError('Không thể tải dữ liệu kết quả xét nghiệm');
      } finally {
        setLoading(false);
      }
    };
    fetchTestResults();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Badge className="bg-blue-100 text-blue-800">Sẵn sàng gửi</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>;
      case 'Pending Upload':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ tải lên</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadResult = (testId: string) => {
    if (selectedFile) {
      // Logic để upload file kết quả
      setTestResults(prev =>
        prev.map(result =>
          result.id === testId
            ? { ...result, status: 'Ready', resultFile: selectedFile.name }
            : result
        )
      );
      setSelectedFile(null);
      setIsUploadMode(false);
    }
  };

  const handleDeliverResult = (testId: string) => {
    // Logic để gửi kết quả cho khách hàng
    setTestResults(prev =>
      prev.map(result =>
        result.id === testId
          ? { 
              ...result, 
              status: 'Delivered', 
              deliveryDate: new Date().toISOString().split('T')[0]
            }
          : result
      )
    );
  };

  const handleDownloadResult = (testId: string) => {
    // Logic để tải xuống file kết quả
    console.log('Download result for test:', testId);
  };

  const handleViewResult = (testId: string) => {
    // Logic để xem trước kết quả
    console.log('View result for test:', testId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Trả kết quả xét nghiệm
          </CardTitle>
          <Button onClick={() => setIsUploadMode(!isUploadMode)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Thêm kết quả mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
        <div className="space-y-4">
          {testResults.map((result) => (
            <Card key={result.id} className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{result.testName}</h3>
                    <p className="text-gray-600">Khách hàng: {result.customerName}</p>
                    <p className="text-sm text-gray-500">
                      Ngày xét nghiệm: {new Date(result.testDate).toLocaleDateString('vi-VN')}
                    </p>
                    {result.deliveryDate && (
                      <p className="text-sm text-green-600">
                        Đã gửi: {new Date(result.deliveryDate).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {getStatusBadge(result.status)}
                    <p className="text-sm text-gray-500 mt-1">ID: {result.id}</p>
                    {result.resultFile && (
                      <p className="text-xs text-blue-600 mt-1">{result.resultFile}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {result.status === 'Pending Upload' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setIsUploadMode(true)}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Tải lên kết quả
                    </Button>
                  )}
                  
                  {result.status === 'Ready' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewResult(result.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem trước
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleDeliverResult(result.id)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Gửi cho khách hàng
                      </Button>
                    </>
                  )}
                  
                  {result.status === 'Delivered' && result.resultFile && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadResult(result.id)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Tải xuống
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {testResults.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có kết quả xét nghiệm nào</p>
            </div>
          )}
        </div>
        )}
      </CardContent>
    </Card>
  );
} 