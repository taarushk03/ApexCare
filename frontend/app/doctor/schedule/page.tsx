"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSharedAppointments, initSharedData, getSharedDoctors, Appointment } from '@/lib/sharedData';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function SchedulePage() {
  const { user } = useAuth();
  const [busySlots, setBusySlots] = useState<Set<string>>(new Set());
  const [unavailableSlots, setUnavailableSlots] = useState<Set<string>>(new Set());
  const [appointmentsMap, setAppointmentsMap] = useState<Record<string, Appointment>>({});

  useEffect(() => {
    initSharedData();
    if (!user?.email) return;

    // Fetch Unavailable slots from localStorage
    const savedUnavailable = localStorage.getItem(`apexcare_doctor_schedule_${user.email}`);
    if (savedUnavailable) {
      setUnavailableSlots(new Set(JSON.parse(savedUnavailable)));
    }

    // Compute Busy slots from Appointments
    const allAppts = getSharedAppointments();
    const doctors = getSharedDoctors();
    const myDoctorRecord = doctors.find(d => d.email === user.email);

    let myAppts = allAppts.filter(a => a.doctorName.toLowerCase().includes(user?.name?.toLowerCase().split(' ')[0] || ''));
    if (myDoctorRecord) {
      myAppts = allAppts.filter(a => a.doctorId === myDoctorRecord.id);
    }

    // Only consider upcoming or in-progress for "busy"
    const activeAppts = myAppts.filter(a => a.status === 'Upcoming' || a.status === 'In Progress');
    
    const computedBusy = new Set<string>();
    const mapping: Record<string, Appointment> = {};

    activeAppts.forEach(apt => {
      // Convert date string to day name
      try {
        const d = new Date(apt.date);
        if (!isNaN(d.getTime())) {
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          if (DAYS.includes(dayName)) {
            const slotId = `${dayName}-${apt.time}`;
            computedBusy.add(slotId);
            mapping[slotId] = apt;
          }
        } else {
          // If the date parsing fails (e.g., "Today"), fall back to today's day
          const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
          const slotId = `${todayName}-${apt.time}`;
          computedBusy.add(slotId);
          mapping[slotId] = apt;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    });

    setBusySlots(computedBusy);
    setAppointmentsMap(mapping);
  }, [user]);

  const toggleAvailability = (slotId: string) => {
    if (busySlots.has(slotId)) return;

    setUnavailableSlots(prev => {
      const next = new Set(prev);
      if (next.has(slotId)) {
        next.delete(slotId);
      } else {
        next.add(slotId);
      }
      
      // Save to localStorage
      if (user?.email) {
        localStorage.setItem(`apexcare_doctor_schedule_${user.email}`, JSON.stringify(Array.from(next)));
      }
      
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your weekly availability and block out timings.</p>
        </div>
        <div className="flex gap-4 items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm text-sm font-medium">
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-md border border-slate-200"></span> Available
          </div>
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-300"></span> Unavailable
          </div>
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-md bg-blue-500"></span> Booked
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-6 border-b border-slate-100 bg-slate-50">
          <div className="p-4 border-r border-slate-100 text-center font-bold text-slate-400 text-xs uppercase tracking-wider">
            Time
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-4 border-r border-slate-100 last:border-0 text-center font-bold text-slate-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="divide-y divide-slate-100 bg-slate-50/30">
          {TIME_SLOTS.map(time => (
            <div key={time} className="grid grid-cols-6">
              <div className="p-4 border-r border-slate-100 text-center text-xs font-bold text-slate-500 flex items-center justify-center bg-white">
                {time}
              </div>
              {DAYS.map(day => {
                const slotId = `${day}-${time}`;
                const isBusy = busySlots.has(slotId);
                const isUnavailable = unavailableSlots.has(slotId);
                const apt = appointmentsMap[slotId];
                
                return (
                  <div 
                    key={slotId} 
                    onClick={() => toggleAvailability(slotId)}
                    className={`p-2 border-r border-slate-100 last:border-0 min-h-[80px] transition-all cursor-pointer relative group ${
                      isBusy ? 'bg-blue-50 cursor-not-allowed' :
                      isUnavailable ? 'bg-slate-200/50' : 
                      'bg-white hover:bg-slate-50'
                    }`}
                  >
                    {!isBusy && !isUnavailable && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-slate-400">Mark Blocked</span>
                      </div>
                    )}
                    
                    {isUnavailable && (
                      <div className="absolute inset-x-2 top-2 bottom-2 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-100/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                      </div>
                    )}

                    {isBusy && (
                      <div className="absolute inset-x-2 top-2 bottom-2 rounded-lg bg-blue-500 text-white p-2 shadow-sm shadow-blue-200 flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase truncate max-w-full">Booked</span>
                        <span className="text-xs font-semibold truncate max-w-full">{apt?.patientName.split(' ')[0] || 'Patient'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
