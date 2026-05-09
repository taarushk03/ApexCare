"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/InputCard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ConsultationPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const email = user?.email || 'guest';
    const storedReport = localStorage.getItem(`apexcare_active_report_${email}`);
    
    if (storedReport) {
      setReport(JSON.parse(storedReport));
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-bold">Loading report...</div>;
  }

  if (!report) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No Active Report Found</h2>
        <Link href="/ai-check">
          <Button>Run AI Symptom Checker</Button>
        </Link>
      </div>
    );
  }

  const { 
    condition, severity, confidence, riskLevel, recommendedActions, 
    emergency, specialist, summary, primaryCondition, secondaryConditions, 
    reasoning, urgency, extractedSymptoms, cannotRuleOut, warningSigns,
    recoveryTimeline, recommendedTests
  } = report;

  // Determine severity visual cues
  const getSeverityProps = () => {
    switch (severity.toLowerCase()) {
      case 'critical': return { color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500', pct: 95 };
      case 'high risk': return { color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500', pct: 80 };
      case 'moderate': return { color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500', pct: 45 };
      default: return { color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500', pct: 20 };
    }
  };

  const getUrgencyProps = () => {
    switch (urgency?.toLowerCase()) {
      case 'emergency care immediately': return { bg: 'bg-red-100', text: 'text-red-700', icon: '🚨' };
      case 'urgent consultation recommended': return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚡' };
      case 'visit doctor in 24 hours': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '⏱️' };
      default: return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🏠' };
    }
  };

  const sevProps = getSeverityProps();
  const urgProps = getUrgencyProps();

  const handleSaveReport = () => {
    const email = user?.email || 'guest';
    const historyKey = `apexcare_medical_reports_${email}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    const newReport = {
      id: `REP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...report
    };

    history.push(newReport);
    localStorage.setItem(historyKey, JSON.stringify(history));
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {emergency && (
        <div className="bg-red-600 text-white p-6 rounded-3xl mb-8 shadow-2xl animate-in slide-in-from-top-4 flex items-center space-x-6">
          <div className="bg-white/20 p-4 rounded-2xl animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-1">EMERGENCY EVALUATION REQUIRED</h2>
            <p className="font-bold text-red-100">Reported symptoms indicate a high clinical risk. Seek immediate professional care.</p>
          </div>
        </div>
      )}

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="inline-flex items-center space-x-3 bg-blue-50 px-4 py-1.5 rounded-full border-2 border-white shadow-sm">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Medical Analysis Complete</span>
            </div>
            {urgency && (
              <div className={`inline-flex items-center space-x-2 ${urgProps.bg} px-4 py-1.5 rounded-full border-2 border-white shadow-sm`}>
                <span>{urgProps.icon}</span>
                <span className={`text-[10px] font-black ${urgProps.text} uppercase tracking-widest`}>{urgency}</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tightest leading-none">Diagnostic Consultation</h1>
          <p className="text-slate-400 mt-3 font-bold text-sm uppercase tracking-widest">Ref: #AI-{Math.floor(Math.random()*900)+100}-PX • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSaveReport}
             disabled={saved}
             className={`px-5 py-3.5 border-2 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
               saved 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-white border-slate-50 text-slate-600 hover:text-blue-600 hover:border-blue-100'
             }`}
           >
             {saved ? (
               <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Saved to Records</>
             ) : (
               <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Report</>
             )}
           </button>
        </div>
      </header>

      {/* Conditions Cluster */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="md:col-span-2 border-2 border-slate-50 shadow-2xl rounded-[2.5rem] p-8 overflow-visible relative group bg-white">
          <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl shadow-xl shadow-blue-200 border-2 border-white ring-8 ring-blue-50/50 transform rotate-3">
            Primary Confidence: {primaryCondition?.confidence || confidence}%
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
             Conditions Profile
          </h3>
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6 group-hover:text-blue-600 transition-colors">
            {primaryCondition?.name || condition}
          </h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-slate-600 font-bold leading-relaxed">{reasoning}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
             <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Differential Possibilities</h4>
                <div className="space-y-3">
                  {secondaryConditions && secondaryConditions.length > 0 ? secondaryConditions.map((sec: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-white">
                      <span className="text-xs font-black text-slate-700">{sec.name}</span>
                      <span className="text-[10px] font-black text-slate-400">{sec.confidence}%</span>
                    </div>
                  )) : <p className="text-xs text-slate-400 italic">No secondary matches</p>}
                </div>
             </div>
             <div>
                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Cannot Rule Out</h4>
                <div className="space-y-3">
                  {cannotRuleOut && cannotRuleOut.length > 0 ? cannotRuleOut.map((cro: string, i: number) => (
                    <div key={i} className="flex items-center space-x-2 bg-red-50/50 p-3 rounded-xl border border-red-50/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      <span className="text-xs font-black text-red-700">{cro}</span>
                    </div>
                  )) : <p className="text-xs text-slate-400 italic">No clinical rule-outs</p>}
                </div>
             </div>
          </div>
        </Card>

        <Card className="border-2 border-slate-50 shadow-2xl rounded-[2.5rem] p-8 bg-white relative">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Triage Summary</h3>
           <div className="space-y-6">
              <div>
                <div className="flex items-end justify-between mb-2">
                   <span className={`text-xl font-black uppercase ${sevProps.color}`}>{severity}</span>
                   <span className="text-slate-300 font-black">{sevProps.pct}%</span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                   <div className={`h-full ${sevProps.bg} transition-all duration-1000`} style={{ width: `${sevProps.pct}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-white shadow-inner">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Clinical Summary
                 </h4>
                 <p className="text-xs text-slate-600 font-bold italic leading-relaxed">"{summary}"</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Detected Symptoms</h4>
                 <div className="flex flex-wrap gap-1.5">
                   {extractedSymptoms?.map((s: string, i: number) => (
                     <span key={i} className="text-[9px] font-black uppercase tracking-tighter px-2 py-1 bg-slate-100 text-slate-500 rounded-md border border-slate-200">
                       {s}
                     </span>
                   ))}
                 </div>
              </div>
           </div>
        </Card>
      </section>

      {/* Warnings Section */}
      {warningSigns && warningSigns.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-100 p-8 rounded-[2.5rem] mb-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-amber-100 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
           </div>
           <h3 className="text-amber-700 font-black text-xl tracking-tight mb-4 flex items-center gap-3">
              <span className="p-2 bg-amber-600 text-white rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
              Seek Immediate Medical Attention If:
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {warningSigns.map((sign: string, i: number) => (
                <div key={i} className="flex items-center space-x-3 text-amber-800 font-bold text-sm bg-white/50 p-3 rounded-xl border border-white">
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                   <span>{sign}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Recovery & Roadmap */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         <Card className="p-8 border-2 border-slate-50 rounded-[2.5rem] bg-white shadow-xl flex items-center gap-6">
            <div className="bg-emerald-50 p-5 rounded-[1.5rem] text-emerald-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recovery Estimate</h4>
               <p className="text-xl font-black text-slate-800">{recoveryTimeline || "Determined upon exam"}</p>
            </div>
         </Card>
         <Card className="p-8 border-2 border-slate-50 rounded-[2.5rem] bg-white shadow-xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recommended Diagnostics</h4>
            <div className="flex flex-wrap gap-2">
               {recommendedTests?.map((test: string, i: number) => (
                 <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-black rounded-xl border border-indigo-100 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    {test}
                 </span>
               ))}
            </div>
         </Card>
      </section>

      {/* Action Plan */}
      <section className="space-y-10">
         <Card className="shadow-2xl border-4 border-white rounded-[3rem] p-10 bg-white">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 px-4 flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
               Immediate Action Plan
            </h3>
            <div className="space-y-6">
              {recommendedActions.map((step: string, idx: number) => (
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
               <h4 className="font-black text-slate-800 text-2xl tracking-tight mb-2 flex items-center gap-3">
                  Find Specialist
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
               </h4>
               <p className="text-sm font-black text-blue-600 mb-4 uppercase tracking-wider">{specialist}</p>
               <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">Book a prioritized clinical examination with a verified {specialist}.</p>
               <Link href={`/appointments?specialty=${encodeURIComponent(specialist)}`}>
                 <Button fullWidth size="lg" className="shadow-2xl shadow-blue-100 rounded-2xl py-6 font-black uppercase tracking-widest text-xs">Book Appointment</Button>
               </Link>
            </Card>
            <Card className="flex-1 border-t-8 border-t-indigo-600 shadow-2xl rounded-[3rem] p-10 bg-white hover:-translate-y-2 transition-transform">
               <h4 className="font-black text-slate-800 text-2xl tracking-tight mb-4 flex items-center gap-3">
                  Recovery Support
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg></div>
               </h4>
               <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">Access doctor-recommended recovery supplies and medical-grade home care kits.</p>
               <Button fullWidth size="lg" variant="outline" className="rounded-2xl py-6 font-black uppercase tracking-widest text-xs border-4">Order Supplies</Button>
            </Card>
         </div>
      </section>

      {/* Safety Disclaimer */}
      <div className="mt-20 bg-slate-50 rounded-[2.5rem] p-10 border-2 border-slate-100 text-center">
         <p className="text-slate-400 text-sm font-bold italic leading-relaxed">
            <strong>Safety Disclaimer:</strong> This AI assessment is not a confirmed diagnosis and should not replace professional medical evaluation. 
            Information provided is for preliminary triage purposes only. In case of acute symptoms, visit an emergency facility immediately.
         </p>
      </div>

      <div className="mt-12 text-center flex flex-col items-center space-y-4 pb-20">
         <Link href="/reports" className="inline-flex items-center space-x-3 text-slate-500 font-black hover:text-indigo-600 transition-all group">
            <span className="uppercase tracking-widest text-xs">Open Medical Records Hub</span>
         </Link>
         
         <Link href="/dashboard" className="inline-flex items-center space-x-3 text-slate-400 font-black hover:text-blue-600 transition-all group">
            <div className="p-3 rounded-full border-2 border-slate-100 group-hover:border-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <span className="uppercase tracking-widest text-xs">Return to Dashboard</span>
         </Link>
      </div>
    </div>
  );
}
