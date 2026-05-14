"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSharedAppointments, initSharedData, Appointment, getSharedDoctors, updateSharedAppointment } from '@/lib/sharedData';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All'); // All, Today, Upcoming, Completed
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.doctorId) return;
      try {
        const response = await fetch(`http://localhost:3001/appointments/doctor/${user.doctorId}`);
        const data = await response.json();
        
        const mappedAppts: Appointment[] = data.map((a: any) => ({
          id: a.id,
          patientEmail: a.patient?.email || '',
          patientName: `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`.trim() || 'Unknown Patient',
          doctorId: a.doctorId,
          doctorName: user.firstName + ' ' + user.lastName,
          specialty: 'Specialist',
          time: new Date(a.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(a.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: a.reason.includes('Video') ? 'Video' : 'In-Person',
          status: a.status,
          phone: a.patient?.phone || ''
        }));
        setAppointments(mappedAppts);
      } catch (error) {
        console.error('Failed to fetch doctor appointments:', error);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleUpdateStatus = async (apt: Appointment, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, status: newStatus } : a));
      }
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isToday = apt.date === today;

    if (filter === 'Today') return isToday && apt.status !== 'Cancelled';
    if (filter === 'Upcoming') return (apt.status === 'Pending' || apt.status === 'Confirmed' || apt.status === 'In Progress') && !isToday;
    if (filter === 'Completed') return apt.status === 'Completed';
    if (filter === 'Cancelled') return apt.status === 'Cancelled';
    return apt.status !== 'Cancelled'; // For 'All', hide cancelled
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your consultations and video call schedules.</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Appointment
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-2 overflow-x-auto custom-scrollbar">
        {['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
          <div key={apt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 ${
                  apt.type === 'Video' 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {apt.type === 'Video' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  )}
                  {apt.type}
                </span>
                <h3 className="font-bold text-lg text-slate-800">{apt.patientName}</h3>
                <p className="text-sm text-slate-500">{apt.condition || `${apt.type} Consultation`}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {apt.status}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 border border-slate-100">
              <div className="flex items-center text-slate-600 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="mr-2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {apt.time} • {apt.date}
              </div>
              <div className="flex items-center text-slate-600 text-sm font-medium hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="mr-2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {apt.phone || "No phone listed"}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50 flex gap-2">
              {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                <button 
                  onClick={() => handleUpdateStatus(apt, 'In Progress')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-sm ${
                  apt.type === 'Video' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                  {apt.type === 'Video' ? 'Join Call' : 'Start Visit'}
                </button>
              )}
              {apt.status === 'In Progress' && (
                <button 
                  onClick={() => handleUpdateStatus(apt, 'Completed')}
                  className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Mark Completed
                </button>
              )}
              {(apt.status === 'Pending' || apt.status === 'Confirmed' || apt.status === 'In Progress') && (
                 <button 
                 onClick={() => handleUpdateStatus(apt, 'Cancelled')}
                 className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                 Cancel
               </button>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 border-dashed text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-300"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <p className="text-lg font-bold text-slate-700">No {filter.toLowerCase()} appointments</p>
            <p className="text-sm">Enjoy your available time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
