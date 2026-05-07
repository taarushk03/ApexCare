"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">ApexCare</span>
        </Link>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-10">
          <Link href="#features" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">How it works</Link>
          <Link href="#about" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">About Us</Link>
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center space-x-4">
           <Link href="/login">
              <button className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-6 py-3 hover:text-blue-600 transition-colors">Login</button>
           </Link>
           <Link href="/register">
              <Button className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-100">Get Started</Button>
           </Link>
        </div>
      </div>
    </nav>
  );
}
