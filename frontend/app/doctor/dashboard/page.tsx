"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { getSharedAppointments, initSharedData, Appointment, getSharedDoctors, Doctor } from '@/lib/sharedData';

const AppointmentItem = ({ app, showActions = true, onUpdateStatus }: { app: Appointment, showActions?: boolean, onUpdateStatus: (id: number, status: string) => void }) => (
  <div key={app.id} className="flex items-center p-4 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-all group">
    <div className="w-20 text-center border-r border-slate-200 pr-4 shrink-0">
      <span className="block text-sm font-bold text-slate-800">{app.time.split(' ')[0]}</span>
      <span className="block text-[10px] font-black text-slate-400 uppercase">{app.time.split(' ')[1]}</span>
    </div>
    <div className="pl-4 flex-1">
      <div className="flex items-center gap-2">
        <h4 className="font-bold text-slate-800">{app.patientName}</h4>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${app.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
          {app.type}
        </span>
      </div>
      <p className="text-xs text-slate-500 font-medium">{app.patientEmail}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
        app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
        app.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
        app.status === 'In Progress' ? 'bg-blue-600 text-white animate-pulse' :
        app.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
        'bg-amber-100 text-amber-700'
      }`}>
        {app.status}
      </span>
      
      {showActions && app.status !== 'Cancelled' && app.status !== 'Completed' && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {(app.status === 'Pending' || app.status === 'Confirmed') && (
            <button 
              onClick={() => onUpdateStatus(app.id, app.status === 'Pending' ? 'Confirmed' : 'In Progress')}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
              title={app.status === 'Pending' ? 'Accept Appointment' : 'Start Visit'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {app.status === 'Pending' ? <path d="M20 6 9 17l-5-5"/> : <><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></>}
              </svg>
            </button>
          )}
          {app.status === 'In Progress' && (
            <button 
              onClick={() => onUpdateStatus(app.id, 'Completed')}
              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
              title="Mark Completed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </button>
          )}
          {(app.status === 'Pending' || app.status === 'Confirmed' || app.status === 'In Progress') && (
            <button 
              onClick={() => onUpdateStatus(app.id, 'Cancelled')}
              className="p-1.5 bg-white text-red-600 border border-red-100 rounded-lg hover:bg-red-50 shadow-sm"
              title="Cancel Appointment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingReports: 0,
    availableHours: 6
  });

  const [todaySchedule, setTodaySchedule] = useState<Appointment[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<Appointment[]>([]);
  const [cancelledSchedule, setCancelledSchedule] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.doctorId) return;
    try {
      console.log('--- Fetching Doctor Dashboard Data ---');
      
      // Fetch Doctor Profile
      const profileRes = await fetch(`http://localhost:3001/doctors/${user.doctorId}`);
      const profileData = await profileRes.json();
      setDoctorProfile(profileData);

      // Fetch Appointments
      const response = await fetch(`http://localhost:3001/appointments/doctor/${user.doctorId}`);
      const data = await response.json();
      
      const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const now = new Date();
      
      const mappedAppts: Appointment[] = data.map((a: any) => ({
        id: a.id,
        patientEmail: a.patient?.email || '',
        patientName: `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`.trim() || 'Unknown Patient',
        doctorId: a.doctorId,
        doctorName: profileData.fullName,
        specialty: profileData.specialization,
        time: new Date(a.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(a.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        rawDate: new Date(a.appointmentDate),
        type: a.reason.includes('Video') ? 'Video' : 'In-Person',
        status: a.status
      }));

      // Sort by date/time ascending for schedule
      mappedAppts.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

      const today = mappedAppts.filter(a => a.date === todayStr && a.status !== 'Cancelled');
      const upcoming = mappedAppts.filter(a => a.rawDate > now && a.date !== todayStr && a.status !== 'Cancelled');
      const cancelled = mappedAppts.filter(a => a.status === 'Cancelled');
      
      const uniquePatients = new Set(mappedAppts.filter(a => a.status !== 'Cancelled').map(a => a.patientEmail)).size;

      setStats({
        totalPatients: uniquePatients,
        todayAppointments: today.length,
        pendingReports: mappedAppts.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length,
        availableHours: 6
      });

      setTodaySchedule(today);
      setUpcomingSchedule(upcoming.slice(0, 5));
      setCancelledSchedule(cancelled.slice(0, 5));

      const recent = mappedAppts
        .filter(a => a.status === 'Completed')
        .slice(0, 5)
        .map(a => ({
          id: a.id,
          name: a.patientName,
          condition: a.type + ' Consultation',
          lastVisit: a.date,
          status: a.status
        }));
      setRecentPatients(recent);
      setLoading(false);

    } catch (error) {
      console.error('Failed to fetch doctor dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    initSharedData();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchDashboardData();
  }, [user]);

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    try {
      console.log(`--- Updating Appointment ${appointmentId} to ${newStatus} ---`);
      const response = await fetch(`http://localhost:3001/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        console.log('Status update successful');
        fetchDashboardData();
      } else {
        const err = await response.json();
        console.error('Status update failed:', err);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            {greeting}, {doctorProfile?.fullName ? (doctorProfile.fullName.toLowerCase().startsWith('dr') ? doctorProfile.fullName : `Dr. ${doctorProfile.fullName}`) : 'Doctor'}
          </h1>
          <p className="text-blue-100 mb-6 max-w-xl font-medium">
            Here's what your day looks like. You have {stats.todayAppointments} appointments scheduled for today.
          </p>
          <div className="flex gap-4">
            <Link href="/doctor/appointments" className="px-6 py-2.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:scale-105">
              Full Schedule
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: stats.totalPatients, icon: 'Users', color: 'blue' },
          { label: "Today's Appointments", value: stats.todayAppointments, icon: 'Calendar', color: 'indigo' },
          { label: 'Pending Requests', value: stats.pendingReports, icon: 'FileText', color: 'amber' },
          { label: 'Clinical Hours', value: stats.availableHours, icon: 'Clock', color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
              <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {stat.icon === 'Users' && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                  {stat.icon === 'Calendar' && <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                  {stat.icon === 'FileText' && <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>}
                  {stat.icon === 'Clock' && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schedule Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Today's Schedule
                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{todaySchedule.length}</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedule.length > 0 ? todaySchedule.map(app => (
                  <AppointmentItem key={app.id} app={app} onUpdateStatus={handleUpdateStatus} />
                )) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <p className="text-slate-400 font-bold">No appointments for today.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              Upcoming
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{upcomingSchedule.length}</span>
            </h2>
            <div className="space-y-4">
              {upcomingSchedule.length > 0 ? upcomingSchedule.map(app => (
                <div key={app.id} className="flex items-center p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                   <div className="w-24 border-r border-slate-200 pr-4 shrink-0">
                    <span className="block text-[10px] font-black text-blue-600 uppercase mb-1">{app.date.split(',')[0]}</span>
                    <span className="block text-sm font-bold text-slate-800">{app.time}</span>
                  </div>
                  <div className="pl-4 flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{app.patientName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{app.type} Consultation</p>
                  </div>
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'Cancelled')}
                    className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )) : (
                <p className="text-center py-6 text-slate-400 font-medium text-sm">No upcoming appointments scheduled.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Quick Stats/Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentPatients.length > 0 ? recentPatients.map((patient) => (
                <div key={patient.id} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{patient.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{patient.condition}</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-tighter">Completed</span>
                </div>
              )) : (
                <p className="text-xs text-slate-400 font-medium text-center py-4">No recent activity.</p>
              )}
            </div>
          </div>

          {/* Cancelled Log */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
            <h2 className="text-lg font-bold mb-6 flex items-center justify-between">
              Cancelled
              <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{cancelledSchedule.length}</span>
            </h2>
            <div className="space-y-4">
              {cancelledSchedule.length > 0 ? cancelledSchedule.map(app => (
                <div key={app.id} className="pb-4 border-b border-slate-800 last:border-0 last:pb-0 opacity-60">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{app.date}</span>
                      <span className="text-[10px] font-black text-slate-500">{app.time}</span>
                   </div>
                   <h4 className="text-sm font-bold">{app.patientName}</h4>
                </div>
              )) : (
                <p className="text-xs text-slate-500 font-medium text-center py-4">No cancelled appointments.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
