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
    recoveryTimeline, recommendedTests, riskJustification, possibleCauses
  } = report;

  // Determine severity visual cues
  const getSeverityProps = () => {
    switch (severity.toLowerCase()) {
      case 'critical': return { color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500', pct: 95, iconColor: 'text-red-600', iconBg: 'bg-red-50', theme: 'danger' };
      case 'high risk': return { color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500', pct: 80, iconColor: 'text-orange-600', iconBg: 'bg-orange-50', theme: 'warning' };
      case 'moderate': return { color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500', pct: 45, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', theme: 'neutral' };
      case 'indeterminate': return { color: 'text-slate-400', bg: 'bg-slate-300', border: 'border-slate-300', pct: 10, iconColor: 'text-slate-400', iconBg: 'bg-slate-50', theme: 'neutral' };
      default: return { color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500', pct: 20, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', theme: 'safe' };
    }
  };

  const getUrgencyProps = () => {
    switch (urgency?.toLowerCase()) {
      case 'emergency care immediately': return { bg: 'bg-red-50', text: 'text-red-700', icon: '🚨' };
      case 'urgent consultation recommended': return { bg: 'bg-orange-50', text: 'text-orange-700', icon: '⚡' };
      case 'visit doctor in 24 hours': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: '⏱️' };
      default: return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🏠' };
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      {emergency && (
        <div className="bg-red-600 text-white p-6 rounded-[2.5rem] mb-10 shadow-2xl animate-in slide-in-from-top-4 flex items-center space-x-6 border-4 border-white">
          <div className="bg-white/20 p-4 rounded-2xl animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-1">EMERGENCY ESCALATION</h2>
            <p className="font-bold text-red-100">Clinical markers suggest high acuity. Immediate emergency evaluation is mandatory.</p>
          </div>
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="inline-flex items-center space-x-3 bg-blue-50 px-4 py-1.5 rounded-full border-2 border-white shadow-sm">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Analysis Finalized</span>
            </div>
            {urgency && (
              <div className={`inline-flex items-center space-x-2 ${urgProps.bg} px-4 py-1.5 rounded-full border-2 border-white shadow-sm`}>
                <span>{urgProps.icon}</span>
                <span className={`text-[10px] font-black ${urgProps.text} uppercase tracking-widest`}>{urgency}</span>
              </div>
            )}
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none">Consultation Report</h1>
          <p className="text-slate-400 mt-4 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-0.5 bg-slate-200"></span>
            Case ID: AI-{Math.floor(Math.random()*900)+100}-TRIAGE • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSaveReport}
             disabled={saved}
             className={`px-6 py-4 border-2 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-3 ${
               saved 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-white border-slate-50 text-slate-600 hover:text-blue-600 hover:border-blue-100 hover:scale-105 active:scale-95'
             }`}
           >
             {saved ? (
               <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Saved to Records</>
             ) : (
               <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Diagnostic</>
             )}
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        {/* Primary Diagnosis Card */}
        <Card className={`md:col-span-8 border-4 border-slate-50 shadow-2xl rounded-[3.5rem] p-8 bg-white relative overflow-visible group ${sevProps.theme === 'danger' ? 'ring-4 ring-red-50/50' : ''}`}>
          <div className={`absolute -top-5 -right-5 ${sevProps.bg} text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl shadow-xl border-4 border-white z-20`}>
            Confidence: {primaryCondition?.confidence || confidence}%
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                 <div className={`p-1.5 ${sevProps.iconBg} ${sevProps.iconColor} rounded-lg`}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
                 </div>
                 Primary Clinical Assessment
              </h3>
              <h2 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2">
                {primaryCondition?.name || condition}
              </h2>
              <p className="text-indigo-600 font-black text-sm italic mb-6">AI Clinical Summary: {summary}</p>
              <p className="text-slate-600 font-bold text-lg leading-snug">{reasoning}</p>
            </div>

            {possibleCauses?.length > 0 && (
              <div className="pt-6 border-t-2 border-slate-50">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Potential Biological Causes</h4>
                <div className="flex flex-wrap gap-2">
                  {possibleCauses.map((cause: string, i: number) => (
                    <span key={i} className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100">{cause}</span>
                  ))}
                </div>
              </div>
            )}

            {(secondaryConditions?.length > 0 || cannotRuleOut?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t-2 border-slate-50">
                 {secondaryConditions?.length > 0 && (
                   <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Differential Possibilities
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                      </h4>
                      <div className="space-y-2">
                        {secondaryConditions.map((sec: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-white shadow-sm">
                            <span className="text-xs font-black text-slate-800">{sec.name}</span>
                            <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-100">{sec.confidence}%</span>
                          </div>
                        ))}
                      </div>
                   </div>
                 )}
                 {cannotRuleOut?.length > 0 && (
                   <div>
                      <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Critical Rule-Outs
                        <span className="w-1.5 h-1.5 bg-red-200 rounded-full"></span>
                      </h4>
                      <div className="space-y-2">
                        {cannotRuleOut.map((cro: string, i: number) => (
                          <div key={i} className="flex items-center space-x-3 bg-red-50/30 p-3 rounded-2xl border border-red-50/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="text-xs font-black text-red-700 tracking-tight">{cro}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        </Card>

        {/* Triage & Recovery Sidebar */}
        <div className="md:col-span-4 space-y-8">
          <Card className="border-4 border-slate-50 shadow-2xl rounded-[3rem] p-8 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-10 -mt-10"></div>
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Triage Profile</h3>
             <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex items-end justify-between mb-2 px-1">
                     <span className={`text-2xl font-black uppercase tracking-tighter ${sevProps.color}`}>{severity}</span>
                     <span className="text-slate-300 font-black text-sm">{sevProps.pct}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50 p-0.5">
                     <div className={`h-full ${sevProps.bg} rounded-full transition-all duration-[1.5s]`} style={{ width: `${sevProps.pct}%` }}></div>
                  </div>
                </div>

                {riskJustification && (
                  <div className={`${sevProps.theme === 'danger' ? 'bg-red-950' : 'bg-slate-900'} p-5 rounded-[2rem] shadow-xl border-2 ${sevProps.theme === 'danger' ? 'border-red-900' : 'border-slate-800'}`}>
                     <h4 className={`text-[10px] font-black ${sevProps.theme === 'danger' ? 'text-red-400' : 'text-slate-500'} uppercase tracking-widest mb-2 flex items-center gap-2`}>
                        <div className={`w-1.5 h-1.5 ${sevProps.theme === 'danger' ? 'bg-red-500' : 'bg-blue-500'} rounded-full`}></div>
                        Risk Justification
                     </h4>
                     <p className="text-xs text-white font-bold leading-relaxed">{riskJustification}</p>
                  </div>
                )}

                {extractedSymptoms?.length > 0 && (
                  <div className="pt-4 border-t-2 border-slate-50">
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Detected Markers</h4>
                     <div className="flex flex-wrap gap-2">
                       {extractedSymptoms.map((s: string, i: number) => (
                         <span key={i} className="text-[9px] font-black uppercase tracking-tight px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100">
                           {s}
                         </span>
                       ))}
                     </div>
                  </div>
                )}
             </div>
          </Card>

          {recoveryTimeline && (
            <Card className="p-6 border-4 border-slate-50 rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-white shadow-xl flex items-center gap-5">
              <div className="bg-white p-3 rounded-[1.25rem] text-indigo-600 shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                 <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Recovery Window</h4>
                 <p className="text-base font-black text-slate-800 leading-tight">{recoveryTimeline}</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Warnings & Diagnostics Row */}
      {(warningSigns?.length > 0 || recommendedTests?.length > 0) && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {warningSigns?.length > 0 && (
            <div className="bg-amber-50 border-4 border-amber-100/30 p-8 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-amber-100/10">
               <h3 className="text-amber-900 font-black text-xl tracking-tight mb-6 flex items-center gap-3 relative z-10">
                  <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-200"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                  Escalation Indicators:
               </h3>
               <div className="grid grid-cols-1 gap-3 relative z-10">
                  {warningSigns.map((sign: string, i: number) => (
                    <div key={i} className="flex items-center space-x-3 text-amber-900 font-bold text-xs bg-white/50 backdrop-blur-sm p-3.5 rounded-2xl border border-white">
                       <div className="w-1.5 h-1.5 bg-amber-600 rounded-full flex-shrink-0"></div>
                       <span>{sign}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {recommendedTests?.length > 0 && (
            <Card className="p-8 border-4 border-slate-50 rounded-[3.5rem] bg-white shadow-2xl relative overflow-hidden">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                   </div>
                   Recommended Triage Tests
                </h3>
                <div className="grid grid-cols-1 gap-3 relative z-10">
                   {recommendedTests.map((test: string, i: number) => (
                     <div key={i} className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border border-white rounded-[1.25rem]">
                        <span className="text-sm font-black text-slate-800">{test}</span>
                        <div className="p-1.5 bg-white text-indigo-400 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                     </div>
                   ))}
                </div>
            </Card>
          )}
        </section>
      )}

      {/* Action Plan */}
      <section className="space-y-8 mb-16">
         <Card className="shadow-2xl border-4 border-slate-50 rounded-[3.5rem] p-10 bg-white relative overflow-visible">
            <div className="absolute -top-6 left-12 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] border-4 border-white">
               Strategic Action Plan
            </div>
            <div className="space-y-4 mt-4">
              {recommendedActions.map((step: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-6 p-4 hover:bg-slate-50 rounded-[2rem] transition-all group border-2 border-transparent">
                   <div className="bg-slate-900 text-white w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-105 transition-transform">
                     {idx + 1}
                   </div>
                   <div className="flex-1">
                     <p className="text-slate-800 font-black text-lg leading-tight tracking-tight">{step}</p>
                   </div>
                </div>
              ))}
            </div>
         </Card>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex-1 border-b-[8px] border-b-blue-600 shadow-xl rounded-[3rem] p-10 bg-white hover:-translate-y-2 transition-all group">
               <div className="flex items-start justify-between mb-6">
                 <div>
                    <h4 className="font-black text-slate-900 text-2xl tracking-tighter mb-1">Clinical Exam</h4>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{specialist}</p>
                 </div>
                 <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
               </div>
               <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed">Book a pre-briefed physical examination with an board-certified {specialist}.</p>
               <Link href={`/appointments?specialty=${encodeURIComponent(specialist)}`}>
                 <Button fullWidth className="shadow-lg shadow-blue-100 rounded-xl py-6 text-xs font-black uppercase tracking-widest">Instant Booking</Button>
               </Link>
            </Card>
            
            <Card className="flex-1 border-b-[8px] border-b-indigo-600 shadow-xl rounded-[3rem] p-10 bg-white hover:-translate-y-2 transition-all group">
               <div className="flex items-start justify-between mb-6">
                 <div>
                    <h4 className="font-black text-slate-900 text-2xl tracking-tighter mb-1">Supplies</h4>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Medical Support</p>
                 </div>
                 <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg></div>
               </div>
               <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed">Access doctor-recommended home care supplies and recovery monitoring kits.</p>
               <Button fullWidth variant="outline" className="rounded-xl py-6 text-xs font-black uppercase tracking-widest border-2 hover:bg-indigo-50">Explore Marketplace</Button>
            </Card>
         </div>
      </section>

      {/* Final Safety Disclaimer */}
      <div className="bg-slate-900 rounded-[3rem] p-10 border-4 border-white shadow-2xl text-center relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
         <div className="relative z-10">
           <div className="inline-flex items-center space-x-3 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-5 shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
             Medical Advisory
           </div>
           <p className="text-slate-400 text-xs font-bold italic leading-relaxed max-w-2xl mx-auto">
             This AI-generated assessment is for preliminary triage purposes only and <strong>is not a medical diagnosis</strong>. 
             In case of emergency, seek professional medical attention immediately.
           </p>
         </div>
      </div>

      <div className="mt-12 text-center flex flex-col items-center space-y-6 pb-20">
         <Link href="/reports" className="inline-flex items-center space-x-3 text-slate-500 font-black hover:text-indigo-600 transition-all group px-6 py-2.5 bg-white rounded-xl shadow-sm border border-slate-50">
            <span className="uppercase tracking-widest text-[9px]">Secure Records Hub</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
         </Link>
         
         <Link href="/ai-check" className="inline-flex items-center space-x-4 text-slate-400 font-black hover:text-blue-600 transition-all group">
            <div className="p-4 rounded-2xl border-4 border-slate-50 bg-white group-hover:border-blue-100 group-hover:shadow-lg transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <span className="uppercase tracking-widest text-[10px]">Return to Triage Center</span>
         </Link>
      </div>
    </div>
  );
}
