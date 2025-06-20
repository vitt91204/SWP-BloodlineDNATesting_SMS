import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { userAPI } from '../../api/axios';
import { toast } from '../../hooks/use-toast';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

interface Customer {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface EditUserData {
  username: string;
  email: string;
  phone: string;
  role: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState<EditUserData>({
    username: '',
    email: '',
    phone: '',
    role: 'Customer'
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('Fetching all users...');
      
      const allUsers = await userAPI.getAllUsers();
      console.log('All users data:', allUsers);
      
      // Filter only customers (not admins) and map to Customer interface
      const customerData: Customer[] = allUsers
        .filter((user: any) => user.role && user.role.toLowerCase() === 'customer')
        .map((user: any) => ({
          id: user.userId,
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));

      console.log('Processed customer data:', customerData);
      setCustomers(customerData);
      setFilteredCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khách hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.username.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.phone.includes(term)
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      username: customer.username,
      email: customer.email,
      phone: customer.phone,
      role: customer.role
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;

    try {
      console.log('Updating customer:', editingCustomer.id, editFormData);
      
      await userAPI.updateUser(editingCustomer.id, editFormData);
      
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin khách hàng thành công",
      });
      
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      
      // Refresh customer list
      await fetchCustomers();
      
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin khách hàng",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (customerId: number, customerName: string) => {
    try {
      console.log('Deleting customer:', customerId);
      
      await userAPI.deleteUser(customerId);
      
      toast({
        title: "Thành công",
        description: `Đã xóa khách hàng ${customerName}`,
      });
      
      // Refresh customer list
      await fetchCustomers();
      
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa khách hàng",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý khách hàng</h1>
        <p className="text-gray-600">Danh sách tất cả khách hàng đã đăng ký</p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Kết quả tìm kiếm</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Khách hàng mới hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(customer => {
                    const today = new Date().toDateString();
                    const customerDate = new Date(customer.createdAt).toDateString();
                    return customerDate === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách khách hàng</span>
            <span className="text-sm font-normal text-gray-500">
              {filteredCustomers.length} khách hàng
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-600">ID</th>
                    <th className="text-left p-4 font-medium text-gray-600">Tên người dùng</th>
                    <th className="text-left p-4 font-medium text-gray-600">Email</th>
                    <th className="text-left p-4 font-medium text-gray-600">Số điện thoại</th>
                    <th className="text-left p-4 font-medium text-gray-600">Ngày đăng ký</th>
                    <th className="text-left p-4 font-medium text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-gray-900">#{customer.id}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{customer.username}</div>
                          <div className="text-sm text-gray-500">{customer.role}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{customer.email}</td>
                      <td className="p-4 text-gray-600">{customer.phone}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(customer)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Sửa
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xóa
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa khách hàng <strong>{customer.username}</strong>? 
                                  Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCustomer(customer.id, customer.username)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                value={editFormData.username}
                onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Vai trò
              </Label>
              <Select 
                value={editFormData.role} 
                onValueChange={(value) => setEditFormData({...editFormData, role: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button type="button" onClick={handleUpdateCustomer}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 