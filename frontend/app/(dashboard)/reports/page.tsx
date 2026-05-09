"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/InputCard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = user?.email || 'guest';
    const historyKey = `apexcare_medical_reports_${email}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    // Sort by newest first
    history.reverse();
    setReports(history);
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-bold">Loading reports...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tightest leading-tight">Medical Records Hub</h1>
          <p className="text-slate-400 mt-2 font-bold max-w-xl leading-relaxed">
            Your saved diagnostic results and AI symptom analysis reports.
          </p>
        </div>
        <div>
          <Link href="/ai-check" className="px-5 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-colors inline-block text-sm">
            New AI Check
          </Link>
        </div>
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-slate-50 shadow-sm">
          <div className="bg-slate-100 p-8 rounded-full w-fit mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
               <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
             </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">No Reports Saved</h2>
          <p className="text-slate-500 font-bold max-w-md mx-auto">
            You haven't saved any consultation reports yet. Run the AI Symptom Checker to generate and save your first report.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report: any, idx: number) => (
            <Card key={idx} className="p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:shadow-xl hover:border-slate-100 transition-all bg-white relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-2 h-full ${report.emergency ? 'bg-red-500' : report.severity.toLowerCase().includes('high') ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
              
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{report.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{report.id}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{report.condition}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      report.emergency ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      Severity: {report.severity}
                    </span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Specialist: {report.specialist}
                    </span>
                    {report.urgency && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Urgency: {report.urgency}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl w-full md:w-auto text-sm text-slate-600 font-medium">
                  <div className="flex items-center space-x-2 mb-2 font-bold text-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                    <span>Summary</span>
                  </div>
                  <p className="max-w-xs leading-relaxed">{report.summary}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-16 text-center">
         <Link href="/dashboard" className="inline-flex items-center space-x-3 text-slate-400 font-black hover:text-blue-600 transition-all group">
            <div className="p-3 rounded-full border-2 border-slate-100 group-hover:border-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <span className="uppercase tracking-widest text-xs">Back to Workspace</span>
         </Link>
      </div>
    </div>
  );
}
