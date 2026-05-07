"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 lg:mb-24">
           {/* Logo Column */}
           <div className="col-span-1 md:col-span-1 space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
                <span className="text-xl font-black text-slate-800 tracking-tighter uppercase italic italic">ApexCare</span>
              </Link>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Pioneering the future of digital-first personal healthcare management.</p>
           </div>

           {/* About Column */}
           <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Platform</h5>
              <ul className="space-y-3">
                 <li><Link href="#features" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Features</Link></li>
                 <li><Link href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">How it works</Link></li>
                 <li><Link href="/insurance" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Insurance Sync</Link></li>
              </ul>
           </div>

           {/* Contact Column */}
           <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Company</h5>
              <ul className="space-y-3">
                 <li><Link href="/about" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">About Us</Link></li>
                 <li><Link href="/contact" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Contact</Link></li>
                 <li><Link href="/careers" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Careers</Link></li>
              </ul>
           </div>

           {/* Privacy Column */}
           <div className="space-y-6">
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Legal</h5>
              <ul className="space-y-3">
                 <li><Link href="/privacy" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                 <li><Link href="/terms" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                 <li><Link href="/hippa" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">HIPAA Compliance</Link></li>
              </ul>
           </div>
        </div>

        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <p>© 2026 ApexCare Digital Health. All Rights Reserved.</p>
           <div className="flex items-center space-x-6">
              <Link href="#" className="hover:text-blue-600 transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Instagram</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
