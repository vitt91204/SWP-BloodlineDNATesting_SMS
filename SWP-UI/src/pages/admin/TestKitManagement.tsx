import { useEffect, useState } from "react";
import { testKitAPI } from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Package, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TestKit {
  kitId: number;
  name: string;
  description: string;
  stockQuantity: number;
  isActive: boolean;
  testServices?: any[];
}

export default function TestKitManagement() {
  const [kits, setKits] = useState<TestKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiLimitations, setApiLimitations] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    stockQuantity: 0,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchKits = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testKitAPI.getAll();
      setKits(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Error fetching kits:", e);
      setError(`Không thể tải danh sách bộ kit: ${e.message || 'Lỗi kết nối API'}`);
      setKits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : 
              name === "stockQuantity" ? parseInt(value) || 0 : 
              value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên bộ kit");
      return;
    }
    if (form.stockQuantity < 0) {
      alert("Số lượng tồn kho không được âm");
      return;
    }

    setSubmitting(true);
    setError(null);
    setApiLimitations(null);
    
    try {
      const submitData = {
        name: form.name.trim(),
        description: form.description.trim(),
        stockQuantity: form.stockQuantity,
        isActive: form.isActive,
      };
      
      console.log("Submitting kit data:", submitData);
      await testKitAPI.create(submitData);
      setForm({ name: "", description: "", stockQuantity: 0, isActive: true });
      setShowForm(false);
      fetchKits();
      alert("Tạo bộ kit xét nghiệm thành công!");
    } catch (err: any) {
      console.error("Error creating kit:", err);
      
      // Handle 405 Method Not Allowed specifically
      if (err.response?.status === 405) {
        setApiLimitations("🚫 Chức năng tạo bộ kit mới chưa được triển khai trên backend API. Vui lòng liên hệ nhà phát triển để thêm phương thức POST cho endpoint /api/TestKit.");
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Tạo thất bại!";
        setError(`Lỗi tạo bộ kit: ${errorMessage}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (kit: TestKit) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bộ kit "${kit.name}"?`)) {
      return;
    }

    try {
      await testKitAPI.delete(kit.kitId);
      fetchKits();
      alert("Xóa bộ kit thành công!");
    } catch (err: any) {
      console.error("Error deleting kit:", err);
      
      // Handle 405 Method Not Allowed specifically
      if (err.response?.status === 405) {
        setApiLimitations("🚫 Chức năng xóa bộ kit chưa được triển khai trên backend API. Vui lòng liên hệ nhà phát triển để thêm phương thức DELETE cho endpoint /api/TestKit.");
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Xóa thất bại!";
        alert(`Lỗi xóa bộ kit: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            Quản lý bộ kit xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {apiLimitations && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {apiLimitations}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={() => setShowForm((v) => !v)} 
            className="mb-4" 
            variant="outline"
            disabled={loading}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> 
            {showForm ? "Ẩn form" : "Thêm bộ kit mới"}
          </Button>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div>
                <Input 
                  name="name" 
                  placeholder="Tên bộ kit *" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  disabled={submitting}
                />
              </div>
              
              <div>
                <Textarea 
                  name="description" 
                  placeholder="Mô tả bộ kit" 
                  value={form.description} 
                  onChange={handleChange}
                  disabled={submitting}
                  rows={3}
                />
              </div>
              
              <div>
                <Input 
                  name="stockQuantity" 
                  placeholder="Số lượng tồn kho" 
                  value={form.stockQuantity} 
                  onChange={handleChange} 
                  type="number" 
                  min="0"
                  disabled={submitting}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  name="isActive" 
                  checked={form.isActive} 
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Kích hoạt bộ kit
                </label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                  Tạo bộ kit
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}
          
          <div>
            {loading ? (
              <div className="flex items-center py-8 justify-center">
                <Loader2 className="animate-spin w-6 h-6 mr-2" /> 
                Đang tải...
              </div>
            ) : kits.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">
                {error ? "Không thể tải dữ liệu bộ kit." : "Chưa có bộ kit nào."}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">
                  Danh sách bộ kit ({kits.filter(k => k.isActive).length} hoạt động / {kits.length} tổng)
                </h3>
                {kits.map((kit) => (
                  <div key={kit.kitId} className={`p-4 border rounded-lg shadow-sm ${kit.isActive ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          {kit.name}
                          {!kit.isActive && (
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                              Không hoạt động
                            </span>
                          )}
                        </div>
                        {kit.description && (
                          <div className="text-gray-600 text-sm mb-2">
                            {kit.description}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800">
                            📦 Tồn kho: <b className="ml-1">{kit.stockQuantity}</b>
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800">
                            ID: {kit.kitId}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded ${kit.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {kit.isActive ? '✅ Hoạt động' : '❌ Tạm ngưng'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(kit)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 