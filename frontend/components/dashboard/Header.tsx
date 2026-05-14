"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [doctorName, setDoctorName] = React.useState<string | null>(null);

  const isDoctorPortal = pathname.startsWith('/doctor');

  React.useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (isDoctorPortal && user?.doctorId) {
        try {
          const response = await fetch(`http://localhost:3001/doctors/${user.doctorId}`);
          const data = await response.json();
          if (data && data.fullName) {
            setDoctorName(data.fullName);
          }
        } catch (error) {
          console.error('Failed to fetch doctor profile for header:', error);
        }
      }
    };

    fetchDoctorProfile();
  }, [isDoctorPortal, user?.doctorId]);

  const getPageTitle = (path: string) => {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard Overview',
      '/appointments': 'My Appointments',
      '/ai-check': 'AI Health Checker',
      '/consultation': 'Start Consultation',
      '/reports': 'Medical Reports',
      '/profile': 'My Profile',
      '/doctor/dashboard': 'Doctor Dashboard',
      '/doctor/patients': 'My Patients',
      '/doctor/appointments': 'Appointments',
      '/doctor/schedule': 'My Schedule',
      '/doctor/profile': 'Doctor Profile',
    };
    return titles[path] || 'ApexCare';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'JD';
    const parts = name.split(' ');
    const firstInitial = parts[0] ? parts[0][0] : '';
    const lastInitial = parts[parts.length - 1] ? parts[parts.length - 1][0] : '';
    return (firstInitial + lastInitial).toUpperCase() || 'JD';
  };

  const displayName = isDoctorPortal && doctorName 
    ? (doctorName.toLowerCase().startsWith('dr') ? doctorName : `Dr. ${doctorName}`) 
    : (user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest User');

  return (
    <header className="h-20 bg-white border-b-2 border-slate-50 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>

        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          {getPageTitle(pathname)}
        </h2>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border-2 border-transparent hover:border-slate-100 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100 ring-2 ring-white">
            {getInitials(displayName)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Welcome</p>
            <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
              {displayName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
