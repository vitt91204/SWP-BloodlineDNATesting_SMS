import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';

interface User {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableProps {
  users: User[];
  searchTerm: string;
  userType: 'khách hàng' | 'nhân viên';
  onEdit: (user: User) => void;
  onDelete: (userId: number, username: string) => void;
}

export default function UserTable({ users, searchTerm, userType, onEdit, onDelete }: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Danh sách {userType}</span>
          <span className="text-sm font-normal text-gray-500">
            {users.length} {userType}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {searchTerm ? `Không tìm thấy ${userType} phù hợp` : `Chưa có ${userType} nào`}
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
                {users.map((user) => (
                  <tr key={user.userId} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-900">#{user.userId}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone}</td>
                    <td className="p-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(user)}
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
                              <AlertDialogTitle>Xác nhận xóa {userType}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa {userType} <strong>{user.username}</strong>? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(user.userId, user.username)}
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
  );
}