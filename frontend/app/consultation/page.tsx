"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/InputCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ConsultationPage() {
  // Static results for the dummy demo
  const diagnosis = "Mild Viral Infection & Fatigue";
  const severity = "Low to Moderate";
  const severityPercentage = 45;
  const confidence = 89;

  const nextSteps = [
    "Prioritize rest and increase fluid intake (2-3 liters/day)",
    "Monitor body temperature twice daily (morning & night)",
    "Use over-the-counter pain relievers for headache management",
    "If symptoms persist beyond 48 hours, consult a healthcare provider"
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Report Generated</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tightest">AI Consultation Report</h1>
              <p className="text-slate-500 mt-2 font-medium">Thursday, April 2, 2026 • 1:55 PM</p>
            </div>
            <div className="flex gap-4">
               <button className="p-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
               </button>
               <button className="p-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
               </button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <Card className="h-full border-l-[12px] border-l-blue-600 shadow-2xl overflow-visible relative">
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl shadow-blue-200 border-2 border-white ring-4 ring-blue-50 transform rotate-3">
                AI Confidence: {confidence}%
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Preliminary Diagnosis</h3>
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6">{diagnosis}</h2>
              <div className="flex items-start space-x-3 text-slate-500 text-sm italic py-4 border-t border-slate-50">
                <div className="mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                </div>
                <span>Analysis derived from reported symptoms and typical patterns for your age group.</span>
              </div>
            </Card>

            <Card className="h-full shadow-2xl border-t-8 border-t-amber-500">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Urgency Rating</h3>
              <div className="flex items-end justify-between mb-3 px-1">
                <span className={`text-2xl font-black tracking-tight ${severityPercentage > 75 ? 'text-red-500' : severityPercentage > 40 ? 'text-amber-500' : 'text-green-500'}`}>
                  {severity}
                </span>
                <span className="text-slate-300 text-lg font-black tracking-tighter">{severityPercentage}%</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
                 <div 
                  className={`h-full rounded-full transition-all duration-1500 ease-out ${severityPercentage > 75 ? 'bg-red-500' : severityPercentage > 40 ? 'bg-amber-500' : 'bg-green-500'}`} 
                  style={{ width: `${severityPercentage}%` }}
                 />
              </div>
              <div className="mt-6 flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xl">🛡️</span>
                <p className="text-xs text-slate-600 leading-relaxed font-bold tracking-tight">
                  No critical emergency markers detected. Standard home-care monitoring is highly recommended.
                </p>
              </div>
            </Card>
          </section>

          <section className="space-y-8">
             <Card title="Recommended Next Steps" className="shadow-2xl border-2 border-slate-100">
               <div className="space-y-5">
                 {nextSteps.map((step, idx) => (
                   <div key={idx} className="flex items-start space-x-5 p-4 hover:bg-blue-50/50 rounded-3xl transition-all duration-300 group">
                      <div className="bg-blue-600 text-white w-10 h-10 min-w-[40px] rounded-2xl flex items-center justify-center font-black text-base shadow-xl shadow-blue-100 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        {idx + 1}
                      </div>
                      <p className="text-slate-800 font-bold py-2 leading-relaxed tracking-tight">{step}</p>
                   </div>
                 ))}
               </div>
             </Card>

             <div className="flex flex-col md:flex-row gap-8">
                <Card className="flex-1 border-t-8 border-t-blue-600 shadow-xl hover:shadow-2xl transition-shadow">
                   <h4 className="font-black text-slate-900 text-xl tracking-tight mb-3">Book Specialist</h4>
                   <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Our clinical cardiologists can provide an exhaustive investigation of your symptoms.</p>
                   <Link href="/appointments">
                     <Button fullWidth size="lg" className="shadow-xl shadow-blue-100 font-black tracking-tight py-4">Find Doctors</Button>
                   </Link>
                </Card>
                <Card className="flex-1 border-t-8 border-t-teal-500 shadow-xl hover:shadow-2xl transition-shadow">
                   <h4 className="font-black text-slate-900 text-xl tracking-tight mb-3">Pharmacy Hub</h4>
                   <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">Instantly order verified home-care kits and approved OTC medications.</p>
                   <Button fullWidth size="lg" variant="outline" className="font-black tracking-tight py-4">Order Now</Button>
                </Card>
             </div>
          </section>

          <div className="mt-16 text-center">
             <Link href="/dashboard" className="inline-flex items-center space-x-2 text-blue-600 font-black hover:text-blue-800 transition-colors group">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
               <span className="underline underline-offset-8 decoration-4 decoration-blue-100 group-hover:decoration-blue-300">Return to Your Dashboard</span>
             </Link>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
