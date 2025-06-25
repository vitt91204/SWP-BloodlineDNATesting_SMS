import React from 'react';
import UserStats from './UserStats';
import SearchBar from './SearchBar';
import UserTable from './UserTable';

interface Customer {
  userId: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerListProps {
  customers: Customer[];
  filteredCustomers: Customer[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (userId: number, username: string) => void;
}

export default function CustomerList({
  customers,
  filteredCustomers,
  searchTerm,
  onSearch,
  onEdit,
  onDelete
}: CustomerListProps) {
  const newCustomersToday = customers.filter(customer => {
    const today = new Date().toDateString();
    const customerDate = new Date(customer.createdAt).toDateString();
    return customerDate === today;
  }).length;

  return (
    <div className="space-y-6">
      <SearchBar
        searchTerm={searchTerm}
        onSearch={onSearch}
        placeholder="Tìm kiếm khách hàng theo tên, email hoặc số điện thoại..."
      />

      <UserStats
        totalUsers={customers.length}
        filteredUsers={filteredCustomers.length}
        newUsersToday={newCustomersToday}
        userType="khách hàng"
      />

      <UserTable
        users={filteredCustomers}
        searchTerm={searchTerm}
        userType="khách hàng"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}