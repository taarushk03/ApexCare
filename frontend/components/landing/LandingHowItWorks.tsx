"use client";

import React from 'react';

const STEPS = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up in minutes with secure email verification and start your journey.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
  },
  {
    number: "02",
    title: "Track Health Data",
    description: "Fill out your profile and medical history to enable personalized AI insights.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  },
  {
    number: "03",
    title: "Consult Doctors",
    description: "Connect with certified professionals and manage your care plan seamlessly.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14.5v-7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7"/><path d="M7 22v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/><path d="M12 11h.01"/></svg>
  }
];

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">The Process</h4>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight">How ApexCare Works</h2>
           </div>
           <p className="text-slate-500 font-medium max-w-sm mb-2">Revolutionizing the patient experience through effortless, multi-step digital workflows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[6.5rem] left-[15%] right-[15%] h-0.5 bg-slate-50"></div>
          
          {STEPS.map((step, i) => (
            <div key={i} className="relative z-10 text-center md:text-left group">
               <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mb-10 mx-auto md:mx-0 shadow-2xl transition-transform group-hover:scale-110 group-hover:bg-blue-600 duration-500">
                  {step.icon}
               </div>
               <div className="space-y-4 border-l-4 border-slate-50 pl-6 group-hover:border-blue-500 transition-colors duration-500">
                  <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1 group-hover:translate-x-1 transition-transform">Step {step.number}</h5>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none italic italic uppercase">{step.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[250px] mx-auto md:mx-0">{step.description}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
