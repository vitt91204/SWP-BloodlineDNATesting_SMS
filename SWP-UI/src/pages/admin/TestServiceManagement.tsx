import { useEffect, useState } from "react";
import { testServiceAPI, testKitAPI, TestServiceUpdatePayload } from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, AlertCircle, Info, Edit, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TestService {
  serviceId: number;
  name: string;
  description: string;
  price: number;
  kitId: number;
  isActive: boolean;
  kit?: any;
  testRequests?: any[];
}

interface TestKit {
  kitId: number;
  name: string;
  description: string;
  stockQuantity: number;
  isActive: boolean;
  testServices?: any[];
}

export default function TestServiceManagement() {
  const [services, setServices] = useState<TestService[]>([]);
  const [kits, setKits] = useState<TestKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiLimitations, setApiLimitations] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    kitId: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<TestService | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testServiceAPI.getAll();
      setServices(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Error fetching services:", e);
      setError(`Không thể tải danh sách dịch vụ: ${e.message || 'Lỗi kết nối API'}`);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchKits = async () => {
    try {
      const data = await testKitAPI.getAll();
      setKits(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Error fetching kits:", e);
      // Don't set error for kits as it's not critical for viewing services
      setKits([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchKits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên dịch vụ");
      return;
    }
    if (!form.kitId) {
      alert("Vui lòng chọn bộ kit");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      alert("Vui lòng nhập giá hợp lệ");
      return;
    }

    setSubmitting(true);
    setError(null);
    setApiLimitations(null);
    
    try {
      // Prepare data without kitId since it's now a path parameter
      const submitData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        isActive: form.isActive, // Use isActive to match backend
      };
      
      // Pass kitId as separate parameter for the new API endpoint
      const kitId = parseInt(form.kitId);
      console.log("Creating service with data:", submitData, "for kitId:", kitId);
      
      await testServiceAPI.create(submitData, kitId);
      setForm({ name: "", description: "", price: "", kitId: "", isActive: true });
      setShowForm(false);
      fetchServices();
      alert("Tạo dịch vụ xét nghiệm thành công!");
    } catch (err: any) {
      console.error("Error creating service:", err);
      
      // Handle 405 Method Not Allowed specifically
      if (err.response?.status === 405) {
        setApiLimitations("🚫 Chức năng tạo dịch vụ mới chưa được triển khai trên backend API. Vui lòng liên hệ nhà phát triển để thêm phương thức POST cho endpoint /api/TestService/kit/{kitId}.");
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Tạo thất bại!";
        setError(`Lỗi tạo dịch vụ: ${errorMessage}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (service: TestService) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${service.name}"?`)) {
      return;
    }

    try {
      await testServiceAPI.delete(service.serviceId);
      fetchServices();
      alert("Xóa dịch vụ thành công!");
    } catch (err: any) {
      console.error("Error deleting service:", err);
      
      // Handle 405 Method Not Allowed specifically
      if (err.response?.status === 405) {
        setApiLimitations("🚫 Chức năng xóa dịch vụ chưa được triển khai trên backend API. Vui lòng liên hệ nhà phát triển để thêm phương thức DELETE cho endpoint /api/TestService.");
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Xóa thất bại!";
        alert(`Lỗi xóa dịch vụ: ${errorMessage}`);
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingService) return;
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingService({ ...editingService, [name]: checked });
    } else {
      setEditingService({ ...editingService, [name]: value });
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSubmitting(true);
    setError(null);

    try {
      const updateData: TestServiceUpdatePayload = {
        name: editingService.name.trim(),
        description: editingService.description.trim(),
        price: parseFloat(editingService.price.toString()),
        isActive: editingService.isActive,
      };
      
      await testServiceAPI.update(editingService.serviceId, updateData, editingService.kitId);
      
      setEditingService(null);
      fetchServices();
      alert("Cập nhật dịch vụ thành công!");
    } catch (err: any) {
      console.error("Error updating service:", err);
      const errorMessage = err.response?.data?.message || err.message || "Cập nhật thất bại!";
      setError(`Lỗi cập nhật: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý loại dịch vụ xét nghiệm</CardTitle>
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
            {showForm ? "Ẩn form" : "Thêm loại dịch vụ mới"}
          </Button>
          
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div>
                <Input 
                  name="name" 
                  placeholder="Tên dịch vụ *" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  disabled={submitting}
                />
              </div>
              
              <div>
                <Textarea 
                  name="description" 
                  placeholder="Mô tả" 
                  value={form.description} 
                  onChange={handleChange}
                  disabled={submitting}
                  rows={3}
                />
              </div>
              
              <div>
                <Input 
                  name="price" 
                  placeholder="Giá (VNĐ) *" 
                  value={form.price} 
                  onChange={handleChange} 
                  type="number" 
                  min="0" 
                  step="1000"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div>
                <select 
                  name="kitId" 
                  value={form.kitId} 
                  onChange={handleChange} 
                  required 
                  disabled={submitting}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn bộ kit *</option>
                  {kits.filter(kit => kit.isActive).map(kit => (
                    <option key={kit.kitId} value={kit.kitId}>
                      {kit.name}
                    </option>
                  ))}
                </select>
                {kits.filter(kit => kit.isActive).length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Không có bộ kit hoạt động nào. Vui lòng kích hoạt kit trước.
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting || kits.filter(kit => kit.isActive).length === 0}>
                  {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                  Tạo dịch vụ
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
            ) : services.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">
                {error ? "Không thể tải dữ liệu dịch vụ." : "Chưa có loại dịch vụ nào."}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">
                  Danh sách dịch vụ ({services.filter(s => s.isActive).length} hoạt động / {services.length} tổng)
                </h3>
                {services.map((service) => {
                  const kitName = kits.find(k => k.kitId === service.kitId)?.name || `Kit ID: ${service.kitId}`;
                  
                  return (
                    <div key={service.serviceId} className={`p-4 border rounded-lg shadow-sm ${service.isActive ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
                            {service.name}
                            {!service.isActive && (
                              <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                                Không hoạt động
                              </span>
                            )}
                          </div>
                          {service.description && (
                            <div className="text-gray-600 text-sm mb-2">
                              {service.description}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800">
                              💰 {service.price ? `${service.price.toLocaleString('vi-VN')} VNĐ` : 'Chưa có giá'}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800">
                              🧪 {kitName}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800">
                              ID: {service.serviceId}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingService(service)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(service)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Service Dialog */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa dịch vụ: {editingService?.name}</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết cho dịch vụ xét nghiệm.
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Tên dịch vụ *</Label>
                <Input id="name" name="name" value={editingService.name} onChange={handleEditChange} required disabled={submitting} />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" name="description" value={editingService.description} onChange={handleEditChange} disabled={submitting} rows={3}/>
              </div>
              <div>
                <Label htmlFor="price">Giá (VNĐ) *</Label>
                <Input id="price" name="price" value={editingService.price} onChange={handleEditChange} type="number" min="0" required disabled={submitting}/>
              </div>
              <div>
                <Label htmlFor="kitId">Bộ kit *</Label>
                <select id="kitId" name="kitId" value={editingService.kitId} onChange={handleEditChange} required disabled={submitting} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  {kits.map(kit => (
                    <option key={kit.kitId} value={kit.kitId}>{kit.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" checked={editingService.isActive} onCheckedChange={(checked) => setEditingService({...editingService, isActive: checked})} disabled={submitting}/>
                <Label htmlFor="isActive">Kích hoạt</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingService(null)} disabled={submitting}>Hủy</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 