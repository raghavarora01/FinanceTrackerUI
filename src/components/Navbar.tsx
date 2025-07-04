'use client';
import React from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function Navbar() {
  const { token, logout, loading } = useAuth();
  return (
    <nav className="bg-white shadow mb-8">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-xl tracking-tight text-black">Finance Tracker</span>
        <div className="space-x-4">
          <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="/expenses" className="text-gray-700 hover:text-blue-600">Expenses</a>
          <a href="/budget" className="text-gray-700 hover:text-blue-600">Budget</a>
          <a href="/reports" className="text-gray-700 hover:text-blue-600">Reports</a>
          {token ? (
            <button onClick={logout} className="text-gray-700 hover:text-blue-600" disabled={loading}>Sign Out</button>
          ) : (
            <a href="/account/login" className="text-gray-700 hover:text-blue-600">Sign In</a>
          )}
        </div>
      </div>
    </nav>
  );
} 