import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { userAPI } from '../../../api/axios';
import { toast } from '../../../hooks/use-toast';
import { Users, UserCheck } from 'lucide-react';
import CustomerList from './CustomerList';
import StaffList from './StaffList';
import UserEditDialog from './UserEditDialog';
import AdminList from './AdminList';
import ManagerList from './ManagerList';
import { Briefcase, Shield } from 'lucide-react';

interface Customer {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Staff {
  userId: number;
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

interface Manager {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
interface Admin {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<Customer | Staff | null>(null);
  const [editFormData, setEditFormData] = useState<EditUserData>({
    username: '',
    email: '',
    phone: '',
    role: 'Customer'
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]);
  const [managerSearchTerm, setManagerSearchTerm] = useState('');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('Fetching all users...');
      
      const allUsers = await userAPI.getAllUsers();
      console.log('All users data:', allUsers);
      
      // Filter customers and map to Customer interface
      const customerData: Customer[] = allUsers
        .filter((user: any) => user.role && user.role.toLowerCase() === 'customer')
        .map((user: any) => ({
          userId: user.userId,
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));

      // Filter staff only (exclude Admin) and map to Staff interface
      const staffData: Staff[] = allUsers
        .filter((user: any) => user.role && user.role.toLowerCase() === 'staff')
        .map((user: any) => ({
          userId: user.userId,
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));

      // Filter managers
      const managerData: Manager[] = allUsers
        .filter((user: any) => user.role && user.role.toLowerCase() === 'manager')
        .map((user: any) => ({
          userId: user.userId,
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));
      // Filter admins
      const adminData: Admin[] = allUsers
        .filter((user: any) => user.role && user.role.toLowerCase() === 'admin')
        .map((user: any) => ({
          userId: user.userId,
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));

      console.log('Processed customer data:', customerData);
      console.log('Processed staff data:', staffData);
      
      setCustomers(customerData);
      setFilteredCustomers(customerData);
      setStaff(staffData);
      setFilteredStaff(staffData);
      setManagers(managerData);
      setFilteredManagers(managerData);
      setAdmins(adminData);
      setFilteredAdmins(adminData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSearch = (term: string) => {
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

  const handleStaffSearch = (term: string) => {
    setStaffSearchTerm(term);
    if (!term.trim()) {
      setFilteredStaff(staff);
    } else {
      const filtered = staff.filter(staffMember =>
        staffMember.username.toLowerCase().includes(term.toLowerCase()) ||
        staffMember.email.toLowerCase().includes(term.toLowerCase()) ||
        staffMember.phone.includes(term)
      );
      setFilteredStaff(filtered);
    }
  };

  const handleManagerSearch = (term: string) => {
    setManagerSearchTerm(term);
    if (!term.trim()) {
      setFilteredManagers(managers);
    } else {
      const filtered = managers.filter(manager =>
        manager.username.toLowerCase().includes(term.toLowerCase()) ||
        manager.email.toLowerCase().includes(term.toLowerCase()) ||
        manager.phone.includes(term)
      );
      setFilteredManagers(filtered);
    }
  };
  const handleAdminSearch = (term: string) => {
    setAdminSearchTerm(term);
    if (!term.trim()) {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter(admin =>
        admin.username.toLowerCase().includes(term.toLowerCase()) ||
        admin.email.toLowerCase().includes(term.toLowerCase()) ||
        admin.phone.includes(term)
      );
      setFilteredAdmins(filtered);
    }
  };

  const handleEditClick = (user: Customer | Staff) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      console.log('Updating user:', editingUser.userId, editFormData);
      
      await userAPI.updateUser(editingUser.userId, editFormData);
      
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin người dùng thành công",
      });
      
      setIsEditDialogOpen(false);
      setEditingUser(null);
      
      // Refresh customer list
      await fetchCustomers();
      
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin người dùng",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    try {
      console.log('Deleting user:', userId);
      
      await userAPI.deleteUser(userId);
      
      toast({
        title: "Thành công",
        description: `Đã xóa người dùng ${username}`,
      });
      
      // Refresh user list
      await fetchCustomers();
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng",
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
        <p className="text-gray-600">Danh sách khách hàng và nhân viên trong hệ thống</p>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Khách hàng
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Nhân viên
          </TabsTrigger>
          <TabsTrigger value="manager" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Manager
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomerList
            customers={customers}
            filteredCustomers={filteredCustomers}
            searchTerm={searchTerm}
            onSearch={handleCustomerSearch}
            onEdit={handleEditClick}
            onDelete={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="staff">
          <StaffList
            staff={staff}
            filteredStaff={filteredStaff}
            searchTerm={staffSearchTerm}
            onSearch={handleStaffSearch}
            onEdit={handleEditClick}
            onDelete={handleDeleteUser}
          />
        </TabsContent>
        <TabsContent value="manager">
          <ManagerList
            managers={managers}
            filteredManagers={filteredManagers}
            searchTerm={managerSearchTerm}
            onSearch={handleManagerSearch}
            onEdit={handleEditClick}
            onDelete={handleDeleteUser}
          />
        </TabsContent>
        <TabsContent value="admin">
          <AdminList
            admins={admins}
            filteredAdmins={filteredAdmins}
            searchTerm={adminSearchTerm}
            onSearch={handleAdminSearch}
            onEdit={handleEditClick}
            onDelete={handleDeleteUser}
          />
        </TabsContent>
      </Tabs>

      <UserEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onSave={handleUpdateUser}
      />
    </div>
  );
}