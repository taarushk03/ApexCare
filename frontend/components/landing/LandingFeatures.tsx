"use client";

import React from 'react';
import { Card } from '@/components/ui/InputCard';

const FEATURES = [
  {
    title: "Secure & Private Data",
    description: "Your medical history is protected with enterprise-grade encryption and HIPAA-compliant storage protocols.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "AI Symptom Checker",
    description: "Get instant, personalized health insights powered by our proprietary symptom analysis engine.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10c0 5.5 4.5 10 10 10s10-4.5 10-10V2h-10z"/><path d="m9 12 2 2 4-4"/></svg>,
    color: "bg-teal-50 text-teal-600"
  },
  {
    title: "Book Appointments",
    description: "Find the right specialist and secure your slot in seconds with our integrated booking system.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Access Medical Records",
    description: "All your prescriptions, lab results, and history are available 24/7 in your secure patient portal.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
    color: "bg-amber-50 text-amber-600"
  }
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-32 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
           <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Smart Features</h4>
           <h2 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight">Digital First Healthcare</h2>
           <p className="text-slate-500 font-medium max-w-xl mx-auto">Modern tools designed to make managing your wellbeing intuitive and stress-free.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {FEATURES.map((feat, i) => (
             <Card key={i} className="p-10 border-2 border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[3rem] bg-white group">
                <div className={`${feat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border-4 border-white shadow-sm group-hover:scale-110 transition-transform`}>
                   {feat.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4 uppercase italic italic">{feat.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.description}</p>
             </Card>
           ))}
        </div>
      </div>
    </section>
  );
}
