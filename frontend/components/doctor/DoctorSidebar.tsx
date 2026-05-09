"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, active }) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-3 rounded-2xl font-bold transition-all duration-300 group outline-none focus:ring-4 focus:ring-blue-100 ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
        : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
    }`}
  >
    <div className={`transition-all duration-300 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="ml-4 text-sm whitespace-nowrap">
      {label}
    </span>
  </Link>
);

const DoctorSidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    {
      href: '/doctor/dashboard',
      label: 'Doctor Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      )
    },
    {
      href: '/doctor/patients',
      label: 'My Patients',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      )
    },
    {
      href: '/doctor/appointments',
      label: 'Appointments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      )
    },
    {
      href: '/doctor/schedule',
      label: 'My Schedule',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      )
    },
    {
      href: '/doctor/reports',
      label: 'Patient Reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
      )
    },
    {
      href: '/doctor/profile',
      label: 'Doctor Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      )
    }
  ];

  return (
    <aside className="h-screen w-[240px] bg-white border-r-2 border-slate-100 flex flex-col sticky top-0 transition-all duration-300 ease-in-out overflow-hidden z-40">
      {/* Sidebar Header Section */}
      <div className="h-20 px-6 flex items-center border-b-2 border-slate-50 bg-white shrink-0">
        <Logo />
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2 no-scrollbar overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Doctor Portal
        </p>
        
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <div className="p-4 border-t-2 border-slate-50 mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all duration-300 group/logout"
        >
          <div className="transition-transform duration-300 group-hover/logout:translate-x-1 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <span className="ml-4 text-sm whitespace-nowrap">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
