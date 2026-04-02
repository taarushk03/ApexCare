"use client";

import React from 'react';
import Navbar from '@/components/ui/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function InsurancePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="bg-amber-100 p-8 rounded-3xl w-fit mx-auto shadow-xl shadow-amber-50 border-4 border-white mb-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
             </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tightest">Insurance & Coverage</h1>
          <p className="text-xl text-slate-500 mt-6 font-medium max-w-xl mx-auto leading-relaxed">
            Manage your medical policies, view active coverage, and process claims through your new unified HealthSync insurance dashboard.
          </p>
          <div className="mt-12">
            <span className="bg-white px-8 py-4 rounded-3xl border-2 border-amber-100 text-amber-700 font-black text-xl shadow-sm tracking-tightest">
                Integration in Progress
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
