"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/InputCard';

export default function LandingHero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-50/50 rounded-full blur-3xl -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-50/50 rounded-full blur-3xl -ml-64 -mb-64"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="lg:w-1/2 space-y-10 animate-in slide-in-from-left-8 fade-in duration-1000">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">
             <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Next-Gen Patient Portal</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-800 tracking-tighter leading-none">
            Smart Healthcare <br />
            <span className="text-blue-600 italic">for Your Wellbeing</span>
          </h1>

          <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            ApexCare blends cutting-edge AI with seamless data management to empower your health journey. From instant symptom checks to real-time records access—experience the digital medical evolution.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
             <Link href="/register">
                <button className="w-full sm:w-auto bg-slate-900 text-white rounded-[2rem] px-10 py-5 font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:scale-105 transition-all">
                  Book Appointment
                </button>
             </Link>
             <Link href="/dashboard">
                <button className="w-full sm:w-auto bg-white border-4 border-slate-50 text-slate-800 rounded-[2rem] px-10 py-5 font-black uppercase tracking-widest text-xs hover:border-blue-50 transition-all shadow-sm">
                  Check Symptoms
                </button>
             </Link>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start space-x-8 pt-8">
             <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-sm">
                     <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-black text-blue-600 uppercase">P{i}</div>
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trusted by 12,000+ Active Patients</p>
          </div>
        </div>

        <div className="lg:w-1/2 relative animate-in zoom-in-95 fade-in duration-1000">
           {/* Visual Element: Stylized Medical Card Stack */}
           <div className="relative">
              <Card className="w-72 h-80 bg-white shadow-2xl rounded-[3rem] border-4 border-slate-50 relative z-30 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                 </div>
                 <h4 className="text-xl font-black text-slate-800 tracking-tight leading-7 mb-4 italic uppercase italic">My Medical <br />Reports</h4>
                 <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-2 bg-slate-50 rounded-full w-full"></div>
                    ))}
                    <div className="h-2 bg-blue-50 rounded-full w-2/3"></div>
                 </div>
              </Card>
              <div className="absolute top-10 left-10 w-72 h-80 bg-teal-500/10 shadow-xl rounded-[3rem] border-4 border-white/20 z-20 backdrop-blur-md transform -rotate-12 group-hover:-rotate-15 transition-transform duration-1000"></div>
              <div className="absolute -bottom-10 left-32 w-72 h-80 bg-blue-500 rounded-[3rem] z-10 opacity-10 blur-2xl"></div>
           </div>
        </div>
      </div>
    </section>
  );
}
