"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Appointments', href: '/appointments' },
    { name: 'AI Checker', href: '/ai-check' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="bg-white border-b-2 border-slate-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tightest group-hover:tracking-tight transition-all">
                Health<span className="text-blue-600">Sync</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-black transition-all duration-300 py-2.5 px-5 rounded-xl border-2 ${
                  pathname === link.href
                    ? 'text-blue-700 bg-blue-50/50 border-blue-100/50 shadow-sm'
                    : 'text-slate-500 border-transparent hover:text-blue-600 hover:bg-slate-50/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 group bg-slate-50 p-1.5 pr-4 rounded-2xl border-2 border-transparent hover:border-slate-100 hover:bg-white transition-all duration-300 shadow-inner"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-100 ring-2 ring-white group-hover:rotate-6 transition-transform">
                  {user ? getInitials(user.name) : 'JD'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Profile</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{user?.name || 'Guest User'}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-300 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border-2 border-slate-50 p-3 animate-in fade-in slide-in-from-top-4 duration-300 ring-8 ring-slate-50/50">
                  <div className="p-4 border-b-2 border-slate-50 mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.email || 'guest@example.com'}</p>
                  </div>
                  <Link 
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center space-x-3 p-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-bold transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Account Settings</span>
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-colors mt-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
