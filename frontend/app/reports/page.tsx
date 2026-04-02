"use client";

import React from 'react';
import Navbar from '@/components/ui/Navbar';
import { Card } from '@/components/ui/InputCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="bg-purple-100 p-8 rounded-full w-fit mx-auto shadow-xl shadow-purple-50 border-4 border-white mb-10">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
               <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
             </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tightest">Medical Reports Hub</h1>
          <p className="text-xl text-slate-500 mt-6 font-medium max-w-xl mx-auto leading-relaxed">
            Your detailed records, diagnostic results, and laboratory data are being compiled into our new secure portal.
          </p>
          <div className="mt-12">
            <span className="bg-white px-6 py-3 rounded-2xl border-2 border-purple-100 text-purple-700 font-black text-lg shadow-sm">
                Coming Soon - Spring 2026
            </span>
          </div>
          <div className="mt-16">
            <Link href="/dashboard" className="text-blue-600 font-black hover:underline underline-offset-8 decoration-4 decoration-blue-100">
                Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
