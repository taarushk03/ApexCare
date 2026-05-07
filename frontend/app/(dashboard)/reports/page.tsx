"use client";

import React from 'react';
import { Card } from '@/components/ui/InputCard';
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <div className="bg-indigo-600 p-10 rounded-[3rem] w-fit mx-auto shadow-2xl shadow-indigo-100 border-4 border-white mb-12 rotate-6">
         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
           <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
         </svg>
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tightest leading-tight">Medical Records Hub</h1>
      <p className="text-xl text-slate-400 mt-6 font-bold max-w-xl mx-auto leading-relaxed">
        Your diagnostic results and laboratory data are being compiled into our new encrypted portal.
      </p>
      
      <div className="mt-16 flex flex-col items-center">
        <div className="bg-white px-10 py-5 rounded-[2rem] border-4 border-indigo-50 text-indigo-600 font-black text-xl shadow-xl shadow-indigo-50/50 animate-pulse uppercase tracking-widest">
            Coming Soon • Spring &apos;26
        </div>
      </div>
      
      <div className="mt-24">
         <Link href="/dashboard" className="inline-flex items-center space-x-3 text-slate-400 font-black hover:text-indigo-600 transition-all group">
            <div className="p-3 rounded-full border-2 border-slate-100 group-hover:border-indigo-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <span className="uppercase tracking-widest text-xs">Back to Workspace</span>
         </Link>
      </div>
    </div>
  );
}
