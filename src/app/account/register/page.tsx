'use client';
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await register(email, password, name);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => router.push('/account/login'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white text-black">
      <div className="bg-white rounded shadow p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-800">Name</label>
            <input id="name" name="name" type="text" required className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-800">Email</label>
            <input id="email" name="email" type="email" required className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-800">Password</label>
            <input id="password" name="password" type="password" required className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Already have an account? <a href="/account/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
} 