"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingCTA() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 mb-24">
      <div className="bg-blue-600 rounded-[4rem] p-16 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-100">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32 backdrop-blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl -mr-32 -mb-32"></div>

        <div className="relative z-10 space-y-10 max-w-2xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-none">
            Ready to take control <br />
            <span className="text-teal-300">of your health?</span>
          </h2>
          <p className="text-blue-100 text-lg font-medium leading-relaxed">
            Join thousands of active patients who trust ApexCare for their daily wellness monitoring and expert medical consultations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
            <Link href="/register">
               <button className="w-full sm:w-auto bg-white text-blue-600 rounded-[2rem] px-12 py-5 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-800/20 hover:scale-105 transition-all">
                  Get Started Now
               </button>
            </Link>
            <Link href="/about">
               <button className="w-full sm:w-auto bg-blue-700 text-white border-2 border-blue-500 rounded-[2rem] px-12 py-5 font-black uppercase tracking-widest text-xs hover:bg-blue-800 transition-all">
                  Learn More
               </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
