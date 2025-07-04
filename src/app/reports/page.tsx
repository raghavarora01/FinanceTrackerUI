'use client';
import React, { useEffect, useState } from 'react';
import { getCurrentReport, getPastReports } from '@/api/reports';

export default function ReportsPage() {
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [pastReports, setPastReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getCurrentReport(), getPastReports()])
      .then(([current, past]) => {
        setCurrentReport(current);
        setPastReports(past);
      })
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      {error && <div className="bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 mb-4">{error}</div>}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Month Report</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : currentReport ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold">₹{currentReport.total_spent || 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Top Category</p>
              <p className="text-lg font-semibold">{currentReport.top_category || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Top Payment Methods</p>
              <p className="text-lg font-semibold">
                {Array.isArray(currentReport.top_payment_methods) 
                  ? currentReport.top_payment_methods.join(', ') 
                  : currentReport.top_payment_methods || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Overbudget Categories</p>
              <p className="text-lg font-semibold">
                {Array.isArray(currentReport.overbudget_categories) 
                  ? currentReport.overbudget_categories.join(', ') 
                  : currentReport.overbudget_categories || 'None'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No data available for current month.</p>
        )}
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Past 3 Months Summary</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : pastReports.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Month</th>
                <th className="px-2 py-1 text-left">Total Spent</th>
                <th className="px-2 py-1 text-left">Top Category</th>
                <th className="px-2 py-1 text-left">Top Payment Methods</th>
              </tr>
            </thead>
            <tbody>
              {pastReports.map((report, i) => (
                <tr key={report.month || i}>
                  <td className="px-2 py-1">{report.month}</td>
                  <td className="px-2 py-1">₹{report.total_spent || 0}</td>
                  <td className="px-2 py-1">{report.top_category || 'N/A'}</td>
                  <td className="px-2 py-1">
                    {Array.isArray(report.top_payment_methods) 
                      ? report.top_payment_methods.join(', ') 
                      : report.top_payment_methods || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No past reports available.</p>
        )}
      </div>
    </div>
  );
} 