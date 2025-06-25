import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';

interface UserStatsProps {
  totalUsers: number;
  filteredUsers: number;
  newUsersToday: number;
  userType: 'khách hàng' | 'nhân viên';
}

export default function UserStats({ totalUsers, filteredUsers, newUsersToday, userType }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng {userType}</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Kết quả tìm kiếm</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">{userType.charAt(0).toUpperCase() + userType.slice(1)} mới hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{newUsersToday}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}