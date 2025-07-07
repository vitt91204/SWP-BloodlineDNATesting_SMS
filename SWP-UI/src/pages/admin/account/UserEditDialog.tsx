import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface User {
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

interface UserEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editFormData: EditUserData;
  setEditFormData: (data: EditUserData) => void;
  onSave: () => void;
}

export default function UserEditDialog({ 
  isOpen, 
  onClose, 
  editFormData, 
  setEditFormData, 
  onSave 
}: UserEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
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
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button type="button" onClick={onSave}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}