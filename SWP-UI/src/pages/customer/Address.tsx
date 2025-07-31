// customer/Address.tsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, Save, X, Loader2, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { addressAPI } from "@/api/axios";

interface Address {
  id: number;
  addressId?: number;
  label: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
  userId: number;
}

interface AddressFormData {
  label: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export default function AddressTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Danh sách các quận/huyện của TP.HCM
  const hcmDistricts = [
    "Quận 1",
    "Quận 3", 
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Quận Bình Tân",
    "Quận Bình Thạnh",
    "Quận Gò Vấp",
    "Quận Phú Nhuận",
    "Quận Tân Bình",
    "Quận Tân Phú",
    "Huyện Bình Chánh",
    "Thành phố Thủ Đức",
    "Huyện Củ Chi",
    "Huyện Hóc Môn",
    "Huyện Nhà Bè",
    "Huyện Cần Giờ"
  ];

  const [formData, setFormData] = useState<AddressFormData>({
    label: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Việt Nam",
    isPrimary: false
  });

  const [editFormData, setEditFormData] = useState<AddressFormData>({
    label: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Việt Nam",
    isPrimary: false
  });

  // Get userId from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.id || user?.userId;
      } catch (e) {
        // Error parsing user data
      }
    }
    return null;
  };

  // Load addresses from API
  const loadAddresses = async () => {
    const userId = getUserId();
    if (!userId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để xem địa chỉ",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const data = await addressAPI.getByUserId(userId);
      setAddresses(data || []);
    } catch (error) {
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách địa chỉ. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const resetForm = () => {
    setFormData({
      label: "",
      addressLine: "",
      city: "",
      province: "Thành phố Hồ Chí Minh",
      postalCode: "",
      country: "Việt Nam",
      isPrimary: false
    });
  };

  const handleAdd = async () => {
    const userId = getUserId();
    if (!userId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để thêm địa chỉ",
        variant: "destructive"
      });
      return;
    }

    if (!formData.label.trim() || !formData.addressLine.trim() || !formData.city.trim() || !formData.province.trim()) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const newAddress = await addressAPI.create(userId, formData);
      
      toast({
        title: "Thành công",
        description: "Đã thêm địa chỉ mới"
      });
      
      resetForm();
      setShowAddForm(false);
      await loadAddresses(); // Reload to get updated data
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm địa chỉ. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id || address.addressId || 0);
    setEditFormData({
      label: address.label || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      province: address.province || "",
      postalCode: address.postalCode || "",
      country: address.country || "Việt Nam",
      isPrimary: address.isPrimary || false
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    if (!editFormData.label.trim() || !editFormData.addressLine.trim() || !editFormData.city.trim() || !editFormData.province.trim()) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedAddress = await addressAPI.update(editingId, editFormData);
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật địa chỉ"
      });
      
      setEditingId(null);
      await loadAddresses(); // Reload to get updated data
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật địa chỉ. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;

    try {
      setIsSubmitting(true);
      await addressAPI.delete(addressId);
      
      toast({
        title: "Thành công",
        description: "Đã xóa địa chỉ"
      });
      
      await loadAddresses(); // Reload to get updated data
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa địa chỉ. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({
      label: "",
      addressLine: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Việt Nam",
      isPrimary: false
    });
  };

  const updateFormData = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateEditFormData = (field: keyof AddressFormData, value: string | boolean) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Quản lý địa chỉ
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Đang tải danh sách địa chỉ...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Quản lý địa chỉ
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isSubmitting}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm địa chỉ
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Chưa có địa chỉ nào. Thêm địa chỉ đầu tiên của bạn!</p>
          </div>
        ) : (
          addresses.map((address) => {
            const addressId = address.id || address.addressId || 0;
            const isEditing = editingId === addressId;
            
            return (
              <div key={addressId} className="border rounded-lg p-4 space-y-3">
                {isEditing ? (
                  // Edit Form
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`edit-label-${addressId}`}>Nhãn địa chỉ *</Label>
                        <Input
                          id={`edit-label-${addressId}`}
                          value={editFormData.label}
                          onChange={(e) => updateEditFormData('label', e.target.value)}
                          placeholder="Ví dụ: Nhà riêng, Văn phòng..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-country-${addressId}`}>Quốc gia</Label>
                        <Input
                          id={`edit-country-${addressId}`}
                          value={editFormData.country}
                          onChange={(e) => updateEditFormData('country', e.target.value)}
                          placeholder="Quốc gia"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`edit-addressLine-${addressId}`}>Địa chỉ chi tiết *</Label>
                      <Textarea
                        id={`edit-addressLine-${addressId}`}
                        value={editFormData.addressLine}
                        onChange={(e) => updateEditFormData('addressLine', e.target.value)}
                        placeholder="Số nhà, tên đường, phường/xã..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`edit-city-${addressId}`}>Quận/Huyện *</Label>
                        <Select
                          value={editFormData.city}
                          onValueChange={(value) => updateEditFormData('city', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {hcmDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`edit-province-${addressId}`}>Tỉnh/Thành phố *</Label>
                        <Input
                          id={`edit-province-${addressId}`}
                          value={editFormData.province}
                          onChange={(e) => updateEditFormData('province', e.target.value)}
                          placeholder="Tỉnh/Thành phố"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`edit-postalCode-${addressId}`}>Mã bưu điện</Label>
                      <Input
                        id={`edit-postalCode-${addressId}`}
                        value={editFormData.postalCode}
                        onChange={(e) => updateEditFormData('postalCode', e.target.value)}
                        placeholder="Mã bưu điện (không bắt buộc)"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-isPrimary-${addressId}`}
                        checked={editFormData.isPrimary}
                        onChange={(e) => updateEditFormData('isPrimary', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor={`edit-isPrimary-${addressId}`}>Đặt làm địa chỉ chính</Label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveEdit}
                        disabled={isSubmitting}
                        size="sm"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        Lưu
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {address.label || 'Địa chỉ'}
                        </span>
                        {address.isPrimary && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Chính
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 space-y-1">
                        <p>{address.addressLine}</p>
                        <p>
                          {[address.city, address.province, address.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        {address.postalCode && (
                          <p className="text-sm">Mã BĐ: {address.postalCode}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(address)}
                        disabled={isSubmitting}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(addressId)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Add New Address Form */}
        {showAddForm && (
          <>
            <Separator />
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">Thêm địa chỉ mới</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="new-label">Nhãn địa chỉ *</Label>
                    <Input
                      id="new-label"
                      value={formData.label}
                      onChange={(e) => updateFormData('label', e.target.value)}
                      placeholder="Ví dụ: Nhà riêng, Văn phòng..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-country">Quốc gia</Label>
                    <Input
                      id="new-country"
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      placeholder="Quốc gia"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="new-addressLine">Địa chỉ chi tiết *</Label>
                  <Textarea
                    id="new-addressLine"
                    value={formData.addressLine}
                    onChange={(e) => updateFormData('addressLine', e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="new-city">Quận/Huyện *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => updateFormData('city', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {hcmDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-province">Tỉnh/Thành phố *</Label>
                    <Input
                      id="new-province"
                      value={formData.province}
                      onChange={(e) => updateFormData('province', e.target.value)}
                      placeholder="Tỉnh/Thành phố"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="new-postalCode">Mã bưu điện</Label>
                  <Input
                    id="new-postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                    placeholder="Mã bưu điện (không bắt buộc)"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="new-isPrimary"
                    checked={formData.isPrimary}
                    onChange={(e) => updateFormData('isPrimary', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="new-isPrimary">Đặt làm địa chỉ chính</Label>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAdd}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Plus className="w-4 h-4 mr-1" />
                    )}
                    Thêm địa chỉ
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
