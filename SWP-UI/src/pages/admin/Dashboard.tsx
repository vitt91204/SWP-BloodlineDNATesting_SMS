import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import React, { useState, useEffect } from 'react';
import { reportAPI } from '@/api/axios';

const tabTitles = [
  'Doanh thu tháng',
  'Số thanh toán tháng này',
  'Số đơn xét nghiệm tháng này',
  'Thống kê theo tháng',
  'Thống kê theo ngày',
];

export const AdminDashboard = () => {
  const now = new Date();
  const [activeTab, setActiveTab] = useState(0);
  const [month, setMonth] = useState([now.getMonth() + 1, now.getMonth() + 1, now.getMonth() + 1, now.getMonth() + 1, now.getMonth() + 1]);
  const [year, setYear] = useState([now.getFullYear(), now.getFullYear(), now.getFullYear(), now.getFullYear(), now.getFullYear()]);
  const [day, setDay] = useState([now.getDate()]); // mặc định là ngày hiện tại
  const [data, setData] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i);
  const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

  useEffect(() => {
    async function fetchTabData(tabIdx: number) {
      setLoading(true);
      try {
        let res;
        if (tabIdx === 0) {
          res = await reportAPI.getMonthlyRevenue(month[0], year[0]);
        } else if (tabIdx === 1) {
          res = await reportAPI.getThisMonthPayments(month[1], year[1]);
        } else if (tabIdx === 2) {
          res = await reportAPI.getThisMonthRequests(month[2], year[2]);
        } else if (tabIdx === 3) {
          res = await reportAPI.getMonthlyRequests(month[3], year[3]);
        } else if (tabIdx === 4) {
          // Sửa: truyền thêm day cho API
          res = await reportAPI.getDailyRequests(month[4], year[4], day[0]);
        }
        setData(prev => prev.map((d, i) => (i === tabIdx ? res : d)));
      } catch (e) {
        setData(prev => prev.map((d, i) => (i === tabIdx ? 'Lỗi API' : d)));
      } finally {
        setLoading(false);
      }
    }
    fetchTabData(activeTab);
    // eslint-disable-next-line
  }, [activeTab, month[activeTab], year[activeTab], day[0]]);

  const renderInputs = (tabIdx: number) => (
    <div className="flex gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tháng</label>
        <select
          className="border rounded px-2 py-1"
          value={month[tabIdx]}
          onChange={e => setMonth(m => m.map((v, i) => i === tabIdx ? Number(e.target.value) : v))}
        >
          {months.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Năm</label>
        <select
          className="border rounded px-2 py-1"
          value={year[tabIdx]}
          onChange={e => setYear(y => y.map((v, i) => i === tabIdx ? Number(e.target.value) : v))}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {tabIdx === 4 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Ngày</label>
          <select
            className="border rounded px-2 py-1"
            value={day[0]}
            onChange={e => setDay([Number(e.target.value)])}
          >
            {Array.from({ length: daysInMonth(year[4], month[4]) }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderTabData = (tabIdx: number) => {
    if (loading) return 'Đang tải...';
    if (data[tabIdx] == null) return '...';
    if (data[tabIdx] === 'Lỗi API') return <span className="text-red-500">Lỗi API</span>;
    // 1. Doanh thu tháng
    if (tabIdx === 0) {
      const d = data[0];
      if (d && typeof d === 'object' && 'totalRevenue' in d) {
        return (
          <div className="text-lg text-gray-900 space-y-1">
            <div>Tháng: <b>{d.month}</b></div>
            <div>Năm: <b>{d.year}</b></div>
            <div>Doanh thu: <b>{d.totalRevenue.toLocaleString()} VNĐ</b></div>
          </div>
        );
      }
      return 'Không có dữ liệu';
    }
    // 2. Số thanh toán tháng này
    if (tabIdx === 1) {
      const d = data[1];
      if (Array.isArray(d)) {
        return (
          <div className="text-2xl font-bold text-gray-900">{d.length}</div>
        );
      }
      return 'Không có dữ liệu';
    }
    // 3. Số đơn xét nghiệm tháng này
    if (tabIdx === 2) {
      const d = data[2];
      if (Array.isArray(d)) {
        return (
          <div className="text-2xl font-bold text-gray-900">{d.filter(x => x != null).length}</div>
        );
      }
      return 'Không có dữ liệu';
    }
    // 4. Thống kê đơn xét nghiệm theo tháng
    if (tabIdx === 3) {
      const d = data[3];
      if (typeof d === 'number') {
        return <div className="text-2xl font-bold text-gray-900">{d}</div>;
      }
      return 'Không có dữ liệu';
    }
    // 5. Thống kê đơn xét nghiệm theo ngày
    if (tabIdx === 4) {
      const d = data[4];
      if (typeof d === 'number') return <div className="text-2xl font-bold text-gray-900">{d}</div>;
      return 'Không có dữ liệu';
    }
    return '...';
  };

  return (
    <div className="w-full px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <div className="flex gap-2 mb-4">
        {tabTitles.map((title, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded ${activeTab === idx ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab(idx)}
          >
            {title}
          </button>
        ))}
      </div>
      {renderInputs(activeTab)}
      <div className="bg-white p-4 rounded shadow mb-8">
        {renderTabData(activeTab)}
      </div>
    </div>
  );
};