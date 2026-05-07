"use client";

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/InputCard';

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
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-3 bg-blue-50 px-4 py-1.5 rounded-full mb-4 border-2 border-white shadow-sm">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Analysis Complete</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tightest leading-none">Consultation Report</h1>
          <p className="text-slate-400 mt-3 font-bold text-sm uppercase tracking-widest">Ref: #AI-992-QX • April 3, 2026</p>
        </div>
        <div className="flex gap-4">
           <button className="p-3.5 bg-white border-2 border-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
           </button>
           <button className="p-3.5 bg-white border-2 border-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
           </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="h-full border-2 border-slate-50 shadow-2xl rounded-[2.5rem] p-8 overflow-visible relative group">
          <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl shadow-xl shadow-blue-200 border-2 border-white ring-8 ring-blue-50/50 transform rotate-3">
            Deep Confidence: {confidence}%
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Detected Condition</h3>
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-8 group-hover:text-blue-600 transition-colors">{diagnosis}</h2>
          <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border-2 border-white shadow-inner">
            <div className="mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
            <span className="text-xs text-slate-500 font-bold leading-relaxed italic">Analysis derived from symptom clusters and historical data patterns.</span>
          </div>
        </Card>

        <Card className="h-full border-2 border-slate-50 shadow-2xl rounded-[2.5rem] p-8 bg-white relative">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Severity Profile</h3>
          <div className="flex items-end justify-between mb-4 px-2">
            <span className={`text-2xl font-black tracking-tight ${severityPercentage > 75 ? 'text-red-500' : severityPercentage > 40 ? 'text-amber-500' : 'text-green-500'}`}>
              {severity}
            </span>
            <span className="text-slate-300 text-xl font-black tracking-tighter">{severityPercentage}%</span>
          </div>
          <div className="h-5 w-full bg-slate-50 rounded-full overflow-hidden border-4 border-white shadow-inner">
             <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${severityPercentage > 75 ? 'bg-red-500' : severityPercentage > 40 ? 'bg-amber-500' : 'bg-green-500'}`} 
              style={{ width: `${severityPercentage}%` }}
             />
          </div>
          <div className="mt-8 flex items-center space-x-4 p-5 bg-slate-50/50 rounded-3xl border-2 border-white">
            <span className="text-2xl">🛡️</span>
            <p className="text-[11px] text-slate-600 leading-relaxed font-bold uppercase tracking-tight">
              No critical markers found. Proceed with standard monitoring.
            </p>
          </div>
        </Card>
      </section>

      <section className="space-y-10">
         <Card className="shadow-2xl border-4 border-white rounded-[3rem] p-10 bg-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 px-4">Action Plan</h3>
            <div className="space-y-6">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-6 p-6 hover:bg-slate-50 rounded-[2rem] transition-all duration-300 group border-2 border-transparent hover:border-slate-100">
                   <div className="bg-slate-900 text-white w-12 h-12 min-w-[48px] rounded-2xl flex items-center justify-center font-black text-lg shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                     {idx + 1}
                   </div>
                   <p className="text-slate-700 font-extrabold py-3 leading-relaxed tracking-tight text-lg">{step}</p>
                </div>
              ))}
            </div>
         </Card>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card className="flex-1 border-t-8 border-t-blue-600 shadow-2xl rounded-[3rem] p-10 bg-white hover:-translate-y-2 transition-transform">
               <h4 className="font-black text-slate-800 text-2xl tracking-tight mb-4">Book Specialist</h4>
               <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">Schedule a thorough investigation with our diagnostic clinicians.</p>
               <Link href="/appointments">
                 <Button fullWidth size="lg" className="shadow-2xl shadow-blue-100 rounded-2xl py-6 font-black uppercase tracking-widest text-xs">Find Doctors</Button>
               </Link>
            </Card>
            <Card className="flex-1 border-t-8 border-t-indigo-600 shadow-2xl rounded-[3rem] p-10 bg-white hover:-translate-y-2 transition-transform">
               <h4 className="font-black text-slate-800 text-2xl tracking-tight mb-4">Pharmacy Hub</h4>
               <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">Order verified home-care kits and therapist-approved medications.</p>
               <Button fullWidth size="lg" variant="outline" className="rounded-2xl py-6 font-black uppercase tracking-widest text-xs border-4">Order Now</Button>
            </Card>
         </div>
      </section>

      <div className="mt-20 text-center">
         <Link href="/dashboard" className="inline-flex items-center space-x-3 text-slate-400 font-black hover:text-blue-600 transition-all group">
            <div className="p-3 rounded-full border-2 border-slate-100 group-hover:border-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <span className="uppercase tracking-widest text-xs">Return to Workspace</span>
         </Link>
      </div>
    </div>
  );
}
