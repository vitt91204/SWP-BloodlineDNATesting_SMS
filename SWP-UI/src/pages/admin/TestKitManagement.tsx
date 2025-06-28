import { useEffect, useState } from "react";
import { testKitAPI } from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Package } from "lucide-react";

export default function TestKitManagement() {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    stock_quantity: 0,
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchKits = async () => {
    setLoading(true);
    try {
      const data = await testKitAPI.getAll();
      setKits(data);
    } catch (e) {
      setKits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      await testKitAPI.create(form);
      setForm({ name: "", description: "", stock_quantity: 0, is_active: true });
      setShowForm(false);
      fetchKits();
      alert("Tạo bộ kit xét nghiệm thành công!");
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
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            Quản lý bộ kit xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowForm((v) => !v)} className="mb-4" variant="outline">
            <PlusCircle className="w-4 h-4 mr-2" /> Thêm bộ kit mới
          </Button>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 mb-6 p-4 border rounded-lg bg-gray-50">
              <Input name="name" placeholder="Tên bộ kit" value={form.name} onChange={handleChange} required />
              <Textarea name="description" placeholder="Mô tả bộ kit" value={form.description} onChange={handleChange} />
              <Input name="stock_quantity" placeholder="Số lượng tồn kho" value={form.stock_quantity} onChange={handleChange} type="number" min="0" />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                Kích hoạt
              </label>
              <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}Tạo bộ kit</Button>
            </form>
          )}
          <div>
            {loading ? (
              <div className="flex items-center py-8 justify-center"><Loader2 className="animate-spin w-6 h-6 mr-2" /> Đang tải...</div>
            ) : kits.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">Chưa có bộ kit nào.</div>
            ) : (
              <div className="space-y-4">
                {kits.map((kit) => (
                  <div key={kit.kit_id || kit.id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{kit.name}</div>
                      <div className="text-gray-600 text-sm mb-1">{kit.description}</div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>Số lượng: <b>{kit.stock_quantity || 0}</b></span>
                        <span>Kích hoạt: <b>{kit.is_active ? 'Có' : 'Không'}</b></span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (window.confirm("Bạn có chắc chắn muốn xóa bộ kit này?")) {
                          await testKitAPI.delete(kit.kit_id || kit.id);
                          fetchKits();
                        }
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