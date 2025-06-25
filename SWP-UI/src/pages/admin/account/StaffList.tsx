import React from 'react';
import UserStats from './UserStats';
import SearchBar from './SearchBar';
import UserTable from './UserTable';

interface Staff {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface StaffListProps {
  staff: Staff[];
  filteredStaff: Staff[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onEdit: (staff: Staff) => void;
  onDelete: (userId: number, username: string) => void;
}

export default function StaffList({
  staff,
  filteredStaff,
  searchTerm,
  onSearch,
  onEdit,
  onDelete
}: StaffListProps) {
  const newStaffToday = staff.filter(staffMember => {
    const today = new Date().toDateString();
    const staffDate = new Date(staffMember.createdAt).toDateString();
    return staffDate === today;
  }).length;

  return (
    <div className="space-y-6">
      <SearchBar
        searchTerm={searchTerm}
        onSearch={onSearch}
        placeholder="Tìm kiếm nhân viên theo tên, email hoặc số điện thoại..."
      />

      <UserStats
        totalUsers={staff.length}
        filteredUsers={filteredStaff.length}
        newUsersToday={newStaffToday}
        userType="nhân viên"
      />

      <UserTable
        users={filteredStaff}
        searchTerm={searchTerm}
        userType="nhân viên"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}