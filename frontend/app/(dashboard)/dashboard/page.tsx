"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Input } from '@/components/ui/InputCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>({ bp: '', temp: '', glucose: '' });
  const [bmi, setBmi] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ bp: '', temp: '', glucose: '' });

  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/appointments/patient/${user.id}`);
        const data = await response.json();
        
        // Find nearest upcoming appointment (Pending, Confirmed, or In Progress)
        const upcoming = data
          .filter((a: any) => a.status === 'Pending' || a.status === 'Confirmed' || a.status === 'In Progress')
          .sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0];

        if (upcoming) {
          setUpcomingAppointment({
            id: upcoming.id,
            doctorName: upcoming.doctor?.fullName || 'Dr. Specialist',
            specialty: upcoming.doctor?.specialization || 'Healthcare',
            date: new Date(upcoming.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: upcoming.status
          });
        } else {
          setUpcomingAppointment(null);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard appointments:', error);
      }

      // Fetch Health Metrics
      const savedHealth = localStorage.getItem(`apexCare_health_metrics_${user.email}`);
      if (savedHealth) {
        const parsedHealth = JSON.parse(savedHealth);
        setHealthData(parsedHealth);
        setFormData(parsedHealth);
      }

      const savedPhysical = localStorage.getItem(`apexCare_physicalData_${user.email}`);
      if (savedPhysical) {
        const data = JSON.parse(savedPhysical);
        if (data.height && data.weight) {
          setBmi((parseFloat(data.weight) / Math.pow(parseFloat(data.height) / 100, 2)).toFixed(1));
        }
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleSaveHealthData = () => {
    if (user?.email) {
      setHealthData(formData);
      localStorage.setItem(`apexCare_health_metrics_${user.email}`, JSON.stringify(formData));
      setIsModalOpen(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const healthStats = [
    { label: 'Blood Pressure', value: healthData.bp || 'No data', icon: '🩺', color: 'text-blue-500' },
    { label: 'Temperature', value: healthData.temp ? `${healthData.temp}°F` : 'No data', icon: '🌡️', color: 'text-red-500' },
    { label: 'Glucose Level', value: healthData.glucose ? `${healthData.glucose} mg/dL` : 'No data', icon: '🩸', color: 'text-green-500' },
    { label: 'Calculated BMI', value: bmi || 'No data', icon: '⚕️', color: 'text-indigo-500' },
  ];

  const dashboardCards = [
    {
      title: 'Book Appointment',
      description: 'Consult with our best medical specialists',
      href: '/appointments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      title: 'AI Symptom Checker',
      description: 'Get instant feedback on your symptoms',
      href: '/ai-check',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <path d="M12 2v10" /><path d="M18.4 6.9c.8.8 1.3 1.9 1.5 3.1.2 1.1 0 2.2-.4 3.1a6.4 6.4 0 0 1-5.3 4.4 6.4 6.4 0 0 1-5.3-4.4c-.4-.9-.6-2-.4-3.1.2-1.2.7-2.3 1.5-3.1" /><path d="m9 15 3-3 3 3" />
        </svg>
      ),
      color: 'bg-green-50',
    },
    {
      title: 'Medical Reports',
      description: 'View and download your diagnostic reports',
      href: '/reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
      ),
      color: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-10 pb-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.firstName || user?.name || 'John'}
          </h1>
          <p className="text-slate-500 mt-2">Here is your health overview for today.</p>
        </div>

        <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-xl shadow-blue-100 flex items-center space-x-6 max-w-md w-full border border-blue-400/20">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Upcoming appointment</p>
            {upcomingAppointment ? (
              <>
                <h3 className="font-bold text-lg leading-tight">{upcomingAppointment.doctorName}</h3>
                <p className="text-xs text-blue-100/80 mt-0.5">
                  {upcomingAppointment.specialty} • {upcomingAppointment.date}
                </p>
              </>
            ) : (
              <h3 className="font-bold text-lg italic text-blue-200">No appointments</h3>
            )}
          </div>
          <Link href="/appointments">
            <button className="bg-white text-blue-600 h-10 w-10 flex items-center justify-center rounded-2xl shadow-lg hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </Link>
        </div>
      </header>

      <section className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-xs">Your Health Metrics</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-slate-50 text-blue-600 font-bold py-2 px-5 rounded-2xl text-xs transition-all border-2 border-slate-100 shadow-sm flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            <span>Log Data</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {healthStats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-2 border-transparent hover:border-blue-50 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <p className={`text-xl font-black mt-1 ${stat.value === 'No data' ? 'text-slate-300 italic text-sm' : stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <Link key={card.title} href={card.href} className="block group">
            <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/20">
              <div className={`p-4 rounded-2xl ${card.color} w-fit mb-4 group-hover:rotate-6 transition-transform duration-300`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">{card.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
              <div className="mt-6 flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Activity Timeline</h2>
          <Card className="p-0 overflow-hidden divide-y-2 divide-slate-50">
            {[
              { title: 'Full Body Checkup Result', date: '2 days ago', icon: '📝', type: 'Report' },
              { title: 'Medicine Order #Sync102', date: '4 days ago', icon: '💊', type: 'Pharmacy' },
              { title: 'Weight Target Met!', date: '1 week ago', icon: '🎯', type: 'Goal' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-5 hover:bg-slate-50 transition-colors group">
                <div className="bg-white p-3 rounded-2xl text-xl border-2 border-slate-50 shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-2 border-slate-100 px-2 py-0.5 rounded-lg">{item.type}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.date}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Reports</h2>
          <Card className="divide-y-2 divide-slate-50 p-0 overflow-hidden">
            {['Full Body Checkup', 'X-ray Chest', 'Blood Test'].map((report, idx) => (
              <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-900 transition-colors">{report}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">2d ago</span>
              </div>
            ))}
            <div className="p-4 bg-slate-50/50">
              <button className="w-full text-blue-600 font-black text-xs uppercase tracking-widest hover:underline underline-offset-4">View all</button>
            </div>
          </Card>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Log Health</h3>
            </div>

            <div className="space-y-6 mb-10">
              <Input
                label="Blood Pressure"
                placeholder="e.g. 120/80"
                value={formData.bp}
                onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
              />
              <Input
                label="Temperature (°F)"
                placeholder="e.g. 98.6"
                type="number"
                value={formData.temp}
                onChange={(e) => setFormData({ ...formData, temp: e.target.value })}
              />
              <Input
                label="Glucose (mg/dL)"
                placeholder="e.g. 95"
                type="number"
                value={formData.glucose}
                onChange={(e) => setFormData({ ...formData, glucose: e.target.value })}
              />
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" fullWidth size="lg" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button fullWidth size="lg" onClick={handleSaveHealthData} className="shadow-lg shadow-blue-100">Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
