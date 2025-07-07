import { useEffect, useState } from "react";
import { testRequestAPI, userAPI } from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [assigning, setAssigning] = useState<{ [key: number]: boolean }>({});
  const [selectedStaff, setSelectedStaff] = useState<{ [key: number]: number }>({});
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
    fetchStaff();
  }, []);

  const fetchBookings = async () => {
    const data = await testRequestAPI.getAll();
    setBookings(Array.isArray(data) ? data : []);
  };

  const fetchStaff = async () => {
    const users = await userAPI.getAllUsers();
    setStaffList(users.filter((u: any) => u.role === "staff"));
  };

  const handleAssign = async (bookingId: number) => {
    const staffId = selectedStaff[bookingId];
    if (!staffId) return alert("Vui lòng chọn staff!");
    setAssigning(prev => ({ ...prev, [bookingId]: true }));
    try {
      await testRequestAPI.update(bookingId, { staff_id: staffId });
      fetchBookings();
      alert("Giao việc thành công!");
    } catch (err) {
      alert("Lỗi khi giao việc!");
    } finally {
      setAssigning(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const filteredBookings = bookings.filter((b: any) => {
    if (filterType === "all") return true;
    if (filterType === "home") return b.collectionType === "At Home";
    if (filterType === "kit") return b.collectionType === "Self";
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Manager - Giao việc cho Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4 items-center">
            <span>Lọc theo hình thức:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="home">Thu mẫu tại nhà</SelectItem>
                <SelectItem value="kit">Gửi kit tự thu mẫu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <table className="w-full border" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                <th className="border px-2 py-1">Mã yêu cầu</th>
                <th className="border px-2 py-1">Khách hàng</th>
                <th className="border px-2 py-1">Hình thức</th>
                <th className="border px-2 py-1">Staff</th>
                <th className="border px-2 py-1">Quản lý</th>
                <th className="border px-2 py-1">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b: any) => (
                <tr key={b.id || b.requestId}>
                  <td className="border px-2 py-1">{b.id || b.requestId}</td>
                  <td className="border px-2 py-1">{b.customerName || b.userId}</td>
                  <td className="border px-2 py-1">{b.collectionType}</td>
                  <td className="border px-2 py-1">
                    <Select
                      value={selectedStaff[b.id || b.requestId]?.toString() || ""}
                      onValueChange={val => setSelectedStaff(prev => ({ ...prev, [b.id || b.requestId]: Number(val) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffList.map((s: any) => (
                          <SelectItem key={s.userId || s.id} value={(s.userId || s.id).toString()}>
                            {s.fullName || s.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border px-2 py-1">
                    {b.role === "Manager" && <span className="text-blue-600 font-semibold">Manager</span>}
                    {b.role === "Staff" && <span className="text-green-600 font-semibold">Staff</span>}
                    {b.role === "Customer" && <span>Customer</span>}
                  </td>
                  <td className="border px-2 py-1">
                    <Button
                      size="sm"
                      disabled={assigning[b.id || b.requestId]}
                      onClick={() => handleAssign(b.id || b.requestId)}
                    >
                      {assigning[b.id || b.requestId] ? "Đang giao..." : "Giao việc"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
} 