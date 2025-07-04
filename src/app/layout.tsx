// Root layout for Finance Tracker app
// TODO: Implement toast notifications and authentication context provider
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Finance Tracker',
  description: 'Track your expenses, set budgets, and get smart financial insights.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-black font-sans">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black font-sans`}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
