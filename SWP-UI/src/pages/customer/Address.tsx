// customer/Address.tsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Address {
  id: string;
  detail: string;
}

export default function AddressTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState("");

  // Fake API loading
  useEffect(() => {
    // Fetch from API if needed
    setAddresses([
      { id: "1", detail: "123 Nguyễn Văn Cừ, Q5" },
      { id: "2", detail: "456 Lê Lợi, Q1" },
    ]);
  }, []);

  const handleAdd = () => {
    if (!newAddress.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      detail: newAddress,
    };
    setAddresses(prev => [...prev, newItem]);
    setNewAddress("");
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý địa chỉ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="flex items-center justify-between border rounded p-2">
            <span>{addr.detail}</span>
            <Button size="icon" variant="destructive" onClick={() => handleDelete(addr.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Separator />

        <div className="flex gap-2">
          <Input
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Thêm địa chỉ mới..."
          />
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
