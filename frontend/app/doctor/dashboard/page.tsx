"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { getSharedAppointments, initSharedData, Appointment, getSharedDoctors, Doctor } from '@/lib/sharedData';

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
  const [recentPatients, setRecentPatients] = useState<any[]>([]);

  useEffect(() => {
    initSharedData();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    // We assume the logged in user email matches the doctor's email
    const allAppts = getSharedAppointments();
    const myAppts = allAppts.filter(a => a.doctorName.toLowerCase().includes(user?.name?.toLowerCase().split(' ')[0] || '')); 
    // Fallback if name doesn't match perfectly - ideal would be matching by doctorId or email 
    // but in booking flow we only have the mock emails.
    // Let's find the doctor ID first to be safe
    const doctors = getSharedDoctors();
    const myDoctorRecord = doctors.find(d => d.email === user.email);

    let finalAppts = myAppts;
    if (myDoctorRecord) {
      finalAppts = allAppts.filter(a => a.doctorId === myDoctorRecord.id);
    }

    // Calculate stats
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const todaysAppts = finalAppts.filter(a => a.date === today || a.date === new Date().getDate().toString() || a.date.includes(new Date().getDate().toString()));
    
    // Simplistic unique patients count
    const uniquePatients = new Set(finalAppts.map(a => a.patientEmail)).size;
    
    setStats({
      totalPatients: uniquePatients > 0 ? uniquePatients : 0,
      todayAppointments: todaysAppts.length,
      pendingReports: finalAppts.filter(a => a.status === 'Completed').length, // Mock pending reports as completed appts
      availableHours: myDoctorRecord ? myDoctorRecord.availableTime.length : 6
    });

    setTodaySchedule(todaysAppts.slice(0, 4));

    // Map to recent patients format
    const recent = finalAppts.slice(0, 5).map(a => ({
      id: a.id,
      name: a.patientName,
      condition: a.type + ' Consultation',
      lastVisit: a.date,
      status: a.status
    }));
    setRecentPatients(recent);

  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, Dr. {user?.name?.split(' ')[0] || 'Doctor'}
          </h1>
          <p className="text-blue-100 mb-6 max-w-xl">
            Here's what your day looks like. You have {stats.todayAppointments} appointments scheduled for today.
          </p>
          <div className="flex gap-4">
            <Link href="/doctor/schedule" className="px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              View Schedule
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
          { label: 'Pending Reports', value: stats.pendingReports, icon: 'FileText', color: 'amber' },
          { label: 'Available Hours', value: stats.availableHours, icon: 'Clock', color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-slate-500 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
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
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Today's Schedule</h2>
            <Link href="/doctor/appointments" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="space-y-4">
            {todaySchedule.length > 0 ? todaySchedule.map((appointment) => (
              <div key={appointment.id} className="flex items-center p-4 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-20 text-center border-r border-slate-200 pr-4 shrink-0">
                  <span className="block text-sm font-bold text-slate-800">{appointment.time.split(' ')[0]}</span>
                  <span className="block text-xs font-semibold text-slate-500 uppercase">{appointment.time.split(' ')[1]}</span>
                </div>
                <div className="pl-4 flex-1">
                  <h4 className="font-bold text-slate-800">{appointment.patientName}</h4>
                  <p className="text-sm text-slate-500">{appointment.type} Consultation</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    appointment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-slate-500">No appointments scheduled for today.</div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <span className="text-xs font-bold text-slate-700">Prescription</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="text-xs font-bold text-slate-700">Upload Report</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-blue-600 transition-colors col-span-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M15 14c.2-1 .7-1.7 1.5-2.2 2.1-1.1 2.1-4.1 0-5.2-.8-.5-1.3-1.2-1.5-2.2-.4-2.2-3.5-2.2-3.9 0-.2 1-.7 1.7-1.5 2.2-2.1 1.1-2.1 4.1 0 5.2.8.5 1.3 1.2 1.5 2.2.4 2.2-3.5 2.2-3.9 0Z"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                <span className="text-xs font-bold text-slate-700">Start Consultation</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Recent Patients</h2>
              <Link href="/doctor/patients" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="space-y-4">
              {recentPatients.length > 0 ? recentPatients.map((patient) => (
                <div key={patient.id} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{patient.name}</h4>
                    <p className="text-xs text-slate-500">{patient.condition}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{patient.lastVisit}</span>
                </div>
              )) : (
                <div className="text-sm text-slate-500">No recent patients.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
