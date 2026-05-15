"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingSignIn() {
  return (
    <section id="sign-in" className="py-32 bg-slate-50/50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 w-[40rem] h-[40rem] bg-blue-50/40 rounded-full blur-3xl -translate-x-1/2 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-teal-50/40 rounded-full blur-3xl -mr-32 -mb-32"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-20">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Get Started</h4>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight">
            Sign In to <span className="text-blue-600 italic">ApexCare</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Choose your portal to access personalized healthcare tools and services.
          </p>
        </div>

        {/* Sign In Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Patient Card */}
          <Link href="/login/patient" id="patient-sign-in-card">
            <div className="group relative bg-white border-2 border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[3rem] p-10 cursor-pointer overflow-hidden">
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:to-blue-100/30 rounded-[3rem] transition-all duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                {/* Icon */}
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">
                  Patient Sign In
                </h3>

                {/* Subtitle */}
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[250px]">
                  Book appointments, view reports &amp; manage your health journey
                </p>

                {/* CTA Arrow */}
                <div className="flex items-center space-x-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">
                  <span>Continue</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Doctor Card */}
          <Link href="/login/doctor" id="doctor-sign-in-card">
            <div className="group relative bg-white border-2 border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[3rem] p-10 cursor-pointer overflow-hidden">
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-teal-100/0 group-hover:from-teal-50/50 group-hover:to-teal-100/30 rounded-[3rem] transition-all duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                {/* Icon — Stethoscope */}
                <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-sm group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                    <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/>
                    <circle cx="20" cy="10" r="2"/>
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">
                  Doctor Sign In
                </h3>

                {/* Subtitle */}
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[250px]">
                  Manage patients, appointments &amp; clinical workflows
                </p>

                {/* CTA Arrow */}
                <div className="flex items-center space-x-2 text-teal-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500">
                  <span>Continue</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
