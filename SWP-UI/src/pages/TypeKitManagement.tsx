import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { typeKitAPI } from "@/api/axios";
import { toast } from "@/components/ui/use-toast";

const TypeKitManagement: React.FC = () => {
  const [typeKits, setTypeKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTypeKit, setNewTypeKit] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchTypeKits();
  }, []);

  const fetchTypeKits = async () => {
    setLoading(true);
    try {
      const data = await typeKitAPI.getAll();
      setTypeKits(data);
    } catch (e) {
      toast({ title: "Lỗi khi lấy loại kit", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newTypeKit.name) return toast({ title: "Tên loại kit không được để trống", variant: "destructive" });
    try {
      await typeKitAPI.create(newTypeKit);
      setNewTypeKit({ name: "", description: "" });
      fetchTypeKits();
      toast({ title: "Thêm loại kit thành công" });
    } catch {
      toast({ title: "Lỗi khi thêm loại kit", variant: "destructive" });
    }
  };

  const handleEdit = (kit: any) => {
    setEditingId(kit.id);
    setEditingData({ name: kit.name, description: kit.description });
  };

  const handleUpdate = async () => {
    try {
      await typeKitAPI.update(editingId, editingData);
      setEditingId(null);
      fetchTypeKits();
      toast({ title: "Cập nhật thành công" });
    } catch {
      toast({ title: "Lỗi khi cập nhật", variant: "destructive" });
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("Xác nhận xoá loại kit?")) return;
    try {
      await typeKitAPI.delete(id);
      fetchTypeKits();
      toast({ title: "Đã xoá loại kit" });
    } catch {
      toast({ title: "Lỗi khi xoá", variant: "destructive" });
    }
  };

  return (
    <section className="py-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Quản lý loại Kit</h2>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thêm loại Kit mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Tên loại kit"
              value={newTypeKit.name}
              onChange={e => setNewTypeKit({ ...newTypeKit, name: e.target.value })}
            />
            <Input
              placeholder="Mô tả"
              value={newTypeKit.description}
              onChange={e => setNewTypeKit({ ...newTypeKit, description: e.target.value })}
            />
            <Button onClick={handleAdd}>Thêm</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách loại Kit</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Tên</th>
                  <th className="border px-2 py-1">Mô tả</th>
                  <th className="border px-2 py-1">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {typeKits.map((kit: any) => (
                  <tr key={kit.id}>
                    <td className="border px-2 py-1">
                      {editingId === kit.id ? (
                        <Input value={editingData.name} onChange={e => setEditingData({ ...editingData, name: e.target.value })} />
                      ) : kit.name}
                    </td>
                    <td className="border px-2 py-1">
                      {editingId === kit.id ? (
                        <Input value={editingData.description} onChange={e => setEditingData({ ...editingData, description: e.target.value })} />
                      ) : kit.description}
                    </td>
                    <td className="border px-2 py-1">
                      {editingId === kit.id ? (
                        <>
                          <Button size="sm" onClick={handleUpdate}>Lưu</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Huỷ</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => handleEdit(kit)}>Sửa</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(kit.id)}>Xoá</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default TypeKitManagement;
