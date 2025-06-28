import { useEffect, useState } from "react";
import { testServiceAPI } from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";

export default function TestServiceManagement() {
  const [services, setServices] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    kit_id: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await testServiceAPI.getAll();
      setServices(data);
    } catch (e) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchKits = async () => {
    try {
      const res = await fetch("/api/TestKit");
      const data = await res.json();
      setKits(data);
    } catch {
      setKits([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchKits();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await testServiceAPI.create(form);
      setForm({ name: "", description: "", price: "", kit_id: "", is_active: true });
      setShowForm(false);
      fetchServices();
      alert("Tạo dịch vụ xét nghiệm thành công!");
    } catch (err) {
      alert("Tạo thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý loại dịch vụ xét nghiệm</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowForm((v) => !v)} className="mb-4" variant="outline">
            <PlusCircle className="w-4 h-4 mr-2" /> Thêm loại dịch vụ mới
          </Button>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 mb-6 p-4 border rounded-lg bg-gray-50">
              <Input name="name" placeholder="Tên dịch vụ" value={form.name} onChange={handleChange} required />
              <Textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
              <Input name="price" placeholder="Giá (VNĐ)" value={form.price} onChange={handleChange} type="number" min="0" />
              <select name="kit_id" value={form.kit_id} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Chọn bộ kit</option>
                {kits.map(kit => (
                  <option key={kit.kit_id} value={kit.kit_id}>{kit.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                Kích hoạt
              </label>
              <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}Tạo dịch vụ</Button>
            </form>
          )}
          <div>
            {loading ? (
              <div className="flex items-center py-8 justify-center"><Loader2 className="animate-spin w-6 h-6 mr-2" /> Đang tải...</div>
            ) : services.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">Chưa có loại dịch vụ nào.</div>
            ) : (
              <div className="space-y-4">
                {services.filter(s => s.is_active).map((s) => (
                  <div key={s.service_id || s.serviceId || s.id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{s.name}</div>
                      <div className="text-gray-600 text-sm mb-1">{s.description}</div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>Giá: <b>{s.price ? `${s.price.toLocaleString('vi-VN')} VNĐ` : '---'}</b></span>
                        <span>Kit: <b>{s.kit_id || s.kitId || s.id || '---'}</b></span>
                        <span>Kích hoạt: <b>{s.is_active ? 'Có' : 'Không'}</b></span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        const id = s.service_id || s.serviceId || s.id;
                        if (!id) {
                          alert('Không tìm thấy serviceId!');
                          return;
                        }
                        await testServiceAPI.delete(id);
                        fetchServices();
                      }}
                    >
                      Xóa
                    </Button>
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