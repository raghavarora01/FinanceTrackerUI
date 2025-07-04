'use client';
import React, { useEffect, useState } from 'react';
import { getExpenses, addExpense } from '@/api/expense';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];
const paymentMethods = ['Cash', 'Card', 'UPI', 'Other'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    Amount: '',
    Category: '',
    Date: '',
    Payment_Method: '',
    Notes: '',
  });
  const [filter, setFilter] = useState({
    date: '',
    category: '',
    paymentMethod: '',
    search: '',
  });
  const [adding, setAdding] = useState(false);

  const fetchExpenses = () => {
    setLoading(true);
    setError(null);
    getExpenses()
      .then(setExpenses)
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Failed to load expenses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    try {
      await addExpense(form);
      setForm({ Amount: '', Category: '', Date: '', Payment_Method: '', Notes: '' });
      fetchExpenses();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to add expense');
    } finally {
      setAdding(false);
    }
  };

  // Simple filter/search logic (client-side for now)
  const filteredExpenses = expenses.filter((exp) => {
    return (
      (!filter.date || exp.Date?.slice(0, 10) === filter.date) &&
      (!filter.category || exp.Category === filter.category) &&
      (!filter.paymentMethod || exp.Payment_Method === filter.paymentMethod) &&
      (!filter.search ||
        exp.Notes?.toLowerCase().includes(filter.search.toLowerCase()) ||
        String(exp.Amount).includes(filter.search))
    );
  });

  return (
    <div className="py-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      {error && <div className="bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 mb-4">{error}</div>}
      <div className="bg-white rounded shadow p-6 mb-6">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end" onSubmit={handleAddExpense}>
          <div>
            <label className="block text-gray-700">Amount</label>
            <input name="Amount" type="number" required className="w-full px-2 py-1 border rounded" value={form.Amount} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <select name="Category" required className="w-full px-2 py-1 border rounded" value={form.Category} onChange={handleFormChange}>
              <option value="">Select</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Date</label>
            <input name="Date" type="date" required className="w-full px-2 py-1 border rounded" value={form.Date} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-gray-700">Payment Method</label>
            <select name="Payment_Method" required className="w-full px-2 py-1 border rounded" value={form.Payment_Method} onChange={handleFormChange}>
              <option value="">Select</option>
              {paymentMethods.map((pm) => <option key={pm} value={pm}>{pm}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Notes</label>
            <input name="Notes" type="text" className="w-full px-2 py-1 border rounded" value={form.Notes} onChange={handleFormChange} />
          </div>
          <button type="submit" className="md:col-span-5 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={adding}>{adding ? 'Adding...' : 'Add Expense'}</button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <input type="date" className="border rounded px-2 py-1" placeholder="Date" value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })} />
          <select className="border rounded px-2 py-1" value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={filter.paymentMethod} onChange={e => setFilter({ ...filter, paymentMethod: e.target.value })}>
            <option value="">All Payment Methods</option>
            {paymentMethods.map((pm) => <option key={pm} value={pm}>{pm}</option>)}
          </select>
          <input type="text" className="border rounded px-2 py-1" placeholder="Search notes or amount" value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} />
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 overflow-x-auto">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Amount</th>
                <th className="px-2 py-1 text-left">Category</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Payment</th>
                <th className="px-2 py-1 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp, i) => (
                <tr key={exp._id || i}>
                  <td className="px-2 py-1">₹{exp.Amount}</td>
                  <td className="px-2 py-1">{exp.Category}</td>
                  <td className="px-2 py-1">{exp.Date?.slice(0, 10)}</td>
                  <td className="px-2 py-1">{exp.Payment_Method}</td>
                  <td className="px-2 py-1">{exp.Notes}</td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-4">No expenses found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 