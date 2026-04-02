"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import { Card } from '@/components/ui/InputCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [upcomingAppointment, setUpcomingAppointment] = React.useState<any>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      const appointments = JSON.parse(saved);
      if (appointments.length > 0) {
        // Show the most recently added appointment
        setUpcomingAppointment(appointments[appointments.length - 1]);
      } else {
        setUpcomingAppointment(null);
      }
    }
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const healthStats = [
    { label: 'Heart Rate', value: '72 bpm', icon: '❤️', color: 'text-red-500' },
    { label: 'Steps', value: '8,432', icon: '🏃', color: 'text-blue-500' },
    { label: 'Weight', value: '68 kg', icon: '⚖️', color: 'text-teal-500' },
    { label: 'Sleep', value: '7h 20m', icon: '🌙', color: 'text-indigo-500' },
  ];

  const dashboardCards = [
    {
      title: 'Book Appointment',
      description: 'Consult with our best medical specialists',
      href: '/appointments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      title: 'AI Symptom Checker',
      description: 'Get instant feedback on your symptoms',
      href: '/ai-check',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
          <path d="M12 2v10"/><path d="M18.4 6.9c.8.8 1.3 1.9 1.5 3.1.2 1.1 0 2.2-.4 3.1a6.4 6.4 0 0 1-5.3 4.4 6.4 6.4 0 0 1-5.3-4.4c-.4-.9-.6-2-.4-3.1.2-1.2.7-2.3 1.5-3.1"/><path d="m9 15 3-3 3 3"/>
        </svg>
      ),
      color: 'bg-teal-50',
    },
    {
      title: 'Medical Reports',
      description: 'View and download your diagnostic reports',
      href: '/reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
        </svg>
      ),
      color: 'bg-purple-50',
    },
    {
      title: 'Insurance & Schemes',
      description: 'Manage your medical policies and coverage',
      href: '/insurance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
        </svg>
      ),
      color: 'bg-amber-50',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {getGreeting()}, {user?.name || 'John'}
              </h1>
              <p className="text-slate-500 mt-2">Here is your health overview for today.</p>
            </div>
            
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl shadow-blue-100 flex items-center space-x-6 max-w-md w-full border border-blue-400/20">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Upcoming Appointment</p>
                <h3 className="font-bold text-lg">{upcomingAppointment?.doctorName || 'Dr. Sarah Smith'}</h3>
                <p className="text-sm text-blue-100/80">
                    {upcomingAppointment ? `${upcomingAppointment.specialty} • ${upcomingAppointment.date}, ${upcomingAppointment.time}` : 'Cardiology • Tomorrow, 10:30 AM'}
                </p>
              </div>
              <Link href="/appointments">
                <button className="bg-white text-blue-600 h-10 w-10 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </Link>
            </div>
          </header>

          <section className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {healthStats.map((stat) => (
              <Card key={stat.label} className="p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300 relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-slate-200">Sample</span>
                </div>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </Card>
            ))}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardCards.map((card) => (
              <Link key={card.title} href={card.href} className="block group">
                <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-blue-200 hover:-translate-y-1">
                  <div className={`p-4 rounded-xl ${card.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm">{card.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:underline">
                    View more
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </section>

          <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Activity Timeline</h2>
              <Card className="space-y-6">
                {[
                  { title: 'Full Body Checkup Result', date: '2 days ago', icon: '📝', type: 'Report' },
                  { title: 'Medicine Order #Sync102', date: '4 days ago', icon: '💊', type: 'Pharmacy' },
                  { title: 'Weight Target Met!', date: '1 week ago', icon: '🎯', type: 'Goal' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4 pb-6 last:pb-0 border-b border-slate-50 last:border-0">
                    <div className="bg-slate-50 p-2.5 rounded-lg text-lg border border-slate-100">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{item.type}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Reports</h2>
              <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
                {['Full Body Checkup', 'X-ray Chest', 'Blood Test'].map((report, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-600 transition-colors">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-900 transition-colors">{report}</span>
                    </div>
                    <span className="text-xs text-slate-400">2 days ago</span>
                  </div>
                ))}
                <div className="p-4 text-center bg-slate-50/50">
                  <button className="text-blue-600 font-bold text-sm hover:underline underline-offset-4">View All Reports</button>
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
