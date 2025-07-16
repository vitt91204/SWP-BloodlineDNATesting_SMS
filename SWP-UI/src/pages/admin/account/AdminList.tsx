import React from 'react';
import UserStats from './UserStats';
import SearchBar from './SearchBar';
import UserTable from './UserTable';

interface Admin {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminListProps {
  admins: Admin[];
  filteredAdmins: Admin[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onEdit: (admin: Admin) => void;
  onDelete: (userId: number, username: string) => void;
}

export default function AdminList({
  admins,
  filteredAdmins,
  searchTerm,
  onSearch,
  onEdit,
  onDelete
}: AdminListProps) {
  const newAdminsToday = admins.filter(admin => {
    const today = new Date().toDateString();
    const adminDate = new Date(admin.createdAt).toDateString();
    return adminDate === today;
  }).length;

  return (
    <div className="space-y-6">
      <SearchBar
        searchTerm={searchTerm}
        onSearch={onSearch}
        placeholder="Tìm kiếm admin theo tên, email hoặc số điện thoại..."
      />

      <UserStats
        totalUsers={admins.length}
        filteredUsers={filteredAdmins.length}
        newUsersToday={newAdminsToday}
        userType="nhân viên"
      />

      <UserTable
        users={filteredAdmins}
        searchTerm={searchTerm}
        userType="nhân viên"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
} 