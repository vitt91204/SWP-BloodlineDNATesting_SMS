import React from 'react';
import UserStats from './UserStats';
import SearchBar from './SearchBar';
import UserTable from './UserTable';

interface Manager {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ManagerListProps {
  managers: Manager[];
  filteredManagers: Manager[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onEdit: (manager: Manager) => void;
  onDelete: (userId: number, username: string) => void;
}

export default function ManagerList({
  managers,
  filteredManagers,
  searchTerm,
  onSearch,
  onEdit,
  onDelete
}: ManagerListProps) {
  const newManagersToday = managers.filter(manager => {
    const today = new Date().toDateString();
    const managerDate = new Date(manager.createdAt).toDateString();
    return managerDate === today;
  }).length;

  return (
    <div className="space-y-6">
      <SearchBar
        searchTerm={searchTerm}
        onSearch={onSearch}
        placeholder="Tìm kiếm manager theo tên, email hoặc số điện thoại..."
      />

      <UserStats
        totalUsers={managers.length}
        filteredUsers={filteredManagers.length}
        newUsersToday={newManagersToday}
        userType="nhân viên"
      />

      <UserTable
        users={filteredManagers}
        searchTerm={searchTerm}
        userType="nhân viên"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
} 