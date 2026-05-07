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

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard Overview',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      )
    },
    {
      href: '/appointments',
      label: 'My Appointments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
      )
    },
    {
      href: '/ai-check',
      label: 'AI Health Checker',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="M18.4 6.9a9 9 0 1 1-12.8 0"/><path d="m12 12 4 4"/></svg>
      )
    },
    {
      href: '/consultation',
      label: 'Start Consultation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.2 2.1-1.1 2.1-4.1 0-5.2-.8-.5-1.3-1.2-1.5-2.2-.4-2.2-3.5-2.2-3.9 0-.2 1-.7 1.7-1.5 2.2-2.1 1.1-2.1 4.1 0 5.2.8.5 1.3 1.2 1.5 2.2.4 2.2-3.5 2.2-3.9 0Z"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
      )
    },
    {
      href: '/reports',
      label: 'Medical Reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
      )
    },
    {
      href: '/profile',
      label: 'Personal Profile',
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
          Main Menu
        </p>
        
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
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

export default Sidebar;
