'use client';
import React, { useEffect, useState } from 'react';
import { getCurrentReport } from '@/api/reports';
import { getExpenses } from '@/api/expense';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([getCurrentReport(), getExpenses()])
      .then(([report, exp]) => {
        setData(report);
        setExpenses(exp);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Pie chart: use real category-wise spending from expenses
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    if (exp.Category) {
      categoryTotals[exp.Category] = (categoryTotals[exp.Category] || 0) + Number(exp.Amount);
    }
  });
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#f472b6', '#facc15', '#38bdf8',
        ],
      },
    ],
  };

  // Line chart: calculate weekly spending for the current month
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const weeks = [0, 0, 0, 0];
  expenses.forEach(exp => {
    if (exp.Date?.slice(0, 7) === currentMonth) {
      const day = new Date(exp.Date).getDate();
      const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
      weeks[weekIdx] += Number(exp.Amount);
    }
  });
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Spending Trend',
        data: weeks,
        fill: false,
        borderColor: '#60a5fa',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="py-8 bg-white text-black">
      <div className="flex items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="bg-white rounded shadow p-6 mb-6">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && data && (
          <div>
            <div className="mb-2">Total Spent: <span className="font-semibold">₹{data.total_spent ?? 0}</span></div>
            <div className="mb-2">Top Category: <span className="font-semibold">{data.top_category || 'N/A'}</span></div>
            <div className="mb-2">Top Payment Methods: <span className="font-semibold">{Array.isArray(data.top_payment_methods) ? data.top_payment_methods.join(', ') : 'N/A'}</span></div>
            {/* TODO: Show overbudget categories if present */}
          </div>
        )}
        {!loading && !error && !data && <p className="text-gray-600">No data available.</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Category-wise Spending</h2>
          <Pie data={pieData} />
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Spending Trend</h2>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
} 