'use client';
import React, { useEffect, useState } from 'react';
import { setBudget, getBudgets, getBudgetSuggestions } from '@/api/budget';
import { getExpenses } from '@/api/expense';
import { useAuth } from '@/components/AuthProvider';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: '',
    month: new Date().toISOString().slice(0, 7),
    limit: '',
  });
  const [setting, setSetting] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const [budgetsRes, exp] = await Promise.all([
        getBudgets({ month: form.month }),
        getExpenses(),
      ]);
      setBudgets(budgetsRes);
      setExpenses(exp);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
    let userId = user?.id;
    if (!userId && typeof window !== 'undefined') {
      userId = localStorage.getItem('userId');
    }
    if (!userId) {
      setSuggestionsError('User not found.');
      setSuggestionsLoading(false);
      return;
    }
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    getBudgetSuggestions(userId)
      .then((data) => {
        setSuggestions(data.suggestions || []);
      })
      .catch((err) => {
        setSuggestionsError('Failed to fetch suggestions');
      })
      .finally(() => setSuggestionsLoading(false));
    // eslint-disable-next-line
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetting(true);
    setError(null);
    try {
      await setBudget(form);
      fetchBudgets();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to set budget');
    } finally {
      setSetting(false);
    }
  };

  // Calculate spending per category for the current month
  const spendingByCategory: Record<string, number> = {};
  expenses.forEach(exp => {
    if (exp.Date?.slice(0, 7) === form.month) {
      spendingByCategory[exp.Category] = (spendingByCategory[exp.Category] || 0) + Number(exp.Amount);
    }
  });

  return (
    <div className="py-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Budget</h1>
      {error && <div className="bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 mb-4">{error}</div>}
      <div className="bg-white rounded shadow p-6 mb-6">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" onSubmit={handleSetBudget}>
          <div>
            <label className="block text-gray-700">Category</label>
            <select name="category" required className="w-full px-2 py-1 border rounded" value={form.category} onChange={handleFormChange}>
              <option value="">Select</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Month</label>
            <input name="month" type="month" required className="w-full px-2 py-1 border rounded" value={form.month} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-gray-700">Limit (₹)</label>
            <input name="limit" type="number" required className="w-full px-2 py-1 border rounded" value={form.limit} onChange={handleFormChange} />
          </div>
          <button type="submit" className="md:col-span-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={setting}>{setting ? 'Saving...' : 'Set/Update Budget'}</button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-6">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Category</th>
                <th className="px-2 py-1 text-left">Month</th>
                <th className="px-2 py-1 text-left">Limit (₹)</th>
                <th className="px-2 py-1 text-left">Spent (₹)</th>
                <th className="px-2 py-1 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b, i) => {
                const spent = spendingByCategory[b.category] || 0;
                const percent = (spent / b.limit) * 100;
                let status = '';
                let statusClass = '';
                if (percent >= 100) {
                  status = 'Over budget!';
                  statusClass = 'text-red-600 font-bold';
                } else if (percent >= 80) {
                  status = 'Nearing limit';
                  statusClass = 'text-yellow-600 font-semibold';
                } else {
                  status = 'OK';
                  statusClass = 'text-green-600';
                }
                return (
                  <tr key={b.category + b.month}>
                    <td className="px-2 py-1">{b.category}</td>
                    <td className="px-2 py-1">{b.month}</td>
                    <td className="px-2 py-1">₹{b.limit}</td>
                    <td className="px-2 py-1">₹{spent}</td>
                    <td className={`px-2 py-1 ${statusClass}`}>{status}</td>
                  </tr>
                );
              })}
              {budgets.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-4">No budgets set.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="bg-white rounded shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-2">Budget Suggestions</h2>
        {suggestionsLoading ? (
          <p className="text-gray-600">Loading suggestions...</p>
        ) : suggestionsError ? (
          <p className="text-red-600">{suggestionsError}</p>
        ) : suggestions.length === 0 ? (
          <p className="text-gray-500">No suggestions at the moment.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {suggestions.map((msg, idx) => (
              <li key={idx} className="bg-blue-50 rounded px-3 py-2">{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 