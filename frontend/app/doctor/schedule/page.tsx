"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSharedAppointments, initSharedData, getSharedDoctors, Appointment } from '@/lib/sharedData';
import { Card } from '@/components/ui/InputCard';
import Button from '@/components/ui/Button';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const formatDateLocal = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatTimeLocal = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const strHours = displayHours < 10 ? '0' + displayHours : displayHours;
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${strHours}:${strMinutes} ${ampm}`;
};

const getCurrentWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const dates: Record<string, string> = {};
  DAYS.forEach((dayName, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    dates[dayName] = formatDateLocal(d);
  });
  return dates;
};

const SLOT_HEIGHT = 100; // px per hour
const START_HOUR = 9; // 09:00 AM

const timeToMinutes = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const getRelativeTop = (timeStr: string) => {
  const mins = timeToMinutes(timeStr);
  const startMins = START_HOUR * 60;
  return ((mins - startMins) / 60) * SLOT_HEIGHT;
};

const AppointmentDetailModal = ({ appointment, onClose }: { appointment: any, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50 overflow-hidden">
      <div className="p-8 border-b-2 border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800">Appointment Details</h3>
        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border-2 border-slate-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-2xl shadow-inner border-2 border-white">
            {appointment.patientName?.[0] || 'P'}
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">{appointment.patientName}</h4>
            <p className="text-blue-600 text-xs font-black uppercase tracking-widest">{appointment.type} Consultation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
            <p className="font-bold text-slate-800">{appointment.date}</p>
            <p className="text-xs text-slate-500 font-bold">{appointment.time}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
              appointment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
              appointment.status === 'In Progress' ? 'bg-blue-600 text-white animate-pulse' :
              'bg-blue-100 text-blue-700'
            }`}>
              {appointment.status}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100/50">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Reason for visit</p>
          <p className="text-blue-900 font-bold leading-relaxed">{appointment.reason || "General health checkup and consultation."}</p>
        </div>

        <Button fullWidth size="lg" onClick={onClose} className="shadow-xl shadow-blue-100">Close Details</Button>
      </div>
    </div>
  </div>
);

export default function SchedulePage() {
  const { user } = useAuth();
  const [busySlots, setBusySlots] = useState<Set<string>>(new Set());
  const [unavailableSlots, setUnavailableSlots] = useState<Set<string>>(new Set());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [weekDates, setWeekDates] = useState<Record<string, string>>(getCurrentWeekDates());

  const fetchSchedule = async () => {
    if (!user?.doctorId) return;

    const dates = getCurrentWeekDates();
    setWeekDates(dates);

    try {
      // 1. Fetch real appointments
      const apptsRes = await fetch(`http://localhost:3001/appointments/doctor/${user.doctorId}`);
      const apptsData = await apptsRes.json();
      
      // 2. Fetch manually blocked slots from backend
      const availRes = await fetch(`http://localhost:3001/doctors/${user.doctorId}/availability`);
      const availData = await availRes.json();
      
      const computedBusy = new Set<string>();
      const computedUnavailable = new Set<string>();
      const apptsList: any[] = [];

      // Map real appointments
      apptsData.filter((a: any) => a.status !== 'Cancelled').forEach((apt: any) => {
        const d = new Date(apt.appointmentDate);
        if (!isNaN(d.getTime())) {
          const dateStr = formatDateLocal(d);
          const timeStr = formatTimeLocal(d);
          
          const slotId = `${dateStr}-${timeStr}`;
          computedBusy.add(slotId);
          apptsList.push({
            id: apt.id,
            patientName: `${apt.patient?.firstName || ''} ${apt.patient?.lastName || ''}`.trim() || 'Patient',
            status: apt.status,
            type: apt.reason?.includes('Video') ? 'Video' : 'In-Person',
            reason: apt.reason,
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: timeStr,
            fullDate: dateStr
          });
        }
      });

      // Map blocked slots
      availData.forEach((slot: any) => {
        // Use a pipe separator to avoid collision with date hyphens
        computedUnavailable.add(`${slot.date}|${slot.startTime}`);
      });

      setBusySlots(computedBusy);
      setUnavailableSlots(computedUnavailable);
      setAppointments(apptsList);
      console.log('[SCHEDULE SYNC] Data refreshed', { appts: apptsList.length, blocked: computedUnavailable.size });
      console.log('[RAW APPTS]', apptsData.map((a: any) => ({ id: a.id, date: a.appointmentDate, status: a.status })));
    } catch (error) {
      console.error('[SCHEDULE SYNC ERROR]', error);
    }
  };

  useEffect(() => {
    fetchSchedule();
    // Auto-refresh every 30 seconds to catch new bookings
    const interval = setInterval(fetchSchedule, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleAvailability = async (dayName: string, timeStr: string) => {
    if (!user?.doctorId) return;
    
    const dateStr = weekDates[dayName];
    const slotId = `${dateStr}|${timeStr}`;

    if (busySlots.has(slotId.replace('|', '-'))) {
      const apt = appointments.find(a => `${a.fullDate}-${a.time}` === slotId.replace('|', '-'));
      if (apt) setSelectedAppointment(apt);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/doctors/${user.doctorId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, startTime: timeStr })
      });

      if (response.ok) {
        console.log('[SLOT TOGGLED]', slotId);
        // Fully refresh to ensure sync
        await fetchSchedule();
      } else {
        console.error('[TOGGLE FAILED]', await response.text());
      }
    } catch (error) {
      console.error('[TOGGLE ERROR]', error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Schedule</h1>
          <p className="text-slate-500 font-bold mt-1">Manage your weekly availability and view booked consultations.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { console.log('[MANUAL REFRESH]'); fetchSchedule(); }}
            className="bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
            Refresh
          </Button>
          <div className="flex gap-4 items-center bg-white p-3 rounded-[1.5rem] border-2 border-slate-50 shadow-sm text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-md border-2 border-slate-100 bg-white"></span> Available
          </div>
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-md bg-slate-100 border-2 border-slate-200 shadow-inner"></span> Blocked
          </div>
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-md bg-blue-600 shadow-md shadow-blue-100"></span> Booked
          </div>
          <div className="flex items-center gap-2 px-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-md shadow-emerald-100"></span> Completed
          </div>
        </div>
      </div>
    </div>

      <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-2xl shadow-slate-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-6 border-b-4 border-slate-50 bg-slate-50/30">
          <div className="p-6 border-r-4 border-slate-50 text-center font-black text-slate-400 text-[10px] uppercase tracking-widest flex items-center justify-center">
            Timings
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-6 border-r-4 border-slate-50 last:border-0 text-center flex flex-col items-center justify-center">
              <span className="font-black text-slate-800 tracking-tighter text-lg">{day}</span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{weekDates[day]}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="divide-y-4 divide-slate-50">
            {TIME_SLOTS.map(time => (
              <div key={time} className="grid grid-cols-6 h-[100px]">
                <div className="p-4 border-r-4 border-slate-50 text-right text-[10px] font-black text-slate-400 bg-white/50 pt-2">
                  {time}
                </div>
                {DAYS.map(day => {
                  const dateStr = weekDates[day] || 'loading';
                  const slotId = `grid-${day}-${dateStr}-${time}`;
                  return (
                    <div 
                      key={slotId} 
                      onClick={() => toggleAvailability(day, time)}
                      className="border-r-4 border-slate-50 last:border-0 bg-white hover:bg-slate-50/50 transition-colors cursor-pointer relative group"
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/95 px-4 py-2 rounded-xl border-2 border-slate-200 shadow-xl backdrop-blur-sm">Block Slot</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Absolute Overlays Layer */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-6">
            {/* Spacer for the Timings column */}
            <div className="col-span-1"></div>
            
            {/* Content columns for the 5 days */}
            <div className="col-span-5 grid grid-cols-5">
              {DAYS.map((day) => {
                const dateStr = weekDates[day] || 'loading';
                
                // Find appointments for this day
                const dayAppointments = appointments.filter(a => a.fullDate === dateStr);
                
                // Find blocked slots for this day
                const dayBlocks = Array.from(unavailableSlots)
                  .filter(id => id.startsWith(`${dateStr}|`))
                  .map(id => id.split('|')[1]);

                return (
                  <div key={`col-${day}-${dateStr}`} className="relative h-full border-r-4 border-transparent pointer-events-none">
                    {/* Render Blocked Slots */}
                    {dayBlocks.map(startTime => {
                      const blockKey = `block-${dateStr}-${startTime}`;
                      const top = getRelativeTop(startTime);
                      // Check if there's an appointment at the same time to avoid overlap mess
                      const hasAppointment = dayAppointments.some(a => a.time === startTime);
                      if (hasAppointment) return null;

                      return (
                        <div 
                          key={blockKey}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAvailability(day, startTime);
                          }}
                          style={{ top: `${top + 4}px`, height: `${SLOT_HEIGHT - 8}px` }}
                          className="absolute inset-x-1 rounded-xl border-2 border-slate-300 flex items-center justify-center bg-slate-200/50 shadow-inner z-10 pointer-events-auto cursor-pointer hover:bg-slate-300/60 transition-all duration-300 group/block"
                        >
                           <div className="flex flex-col items-center gap-1.5">
                             <div className="w-6 h-6 rounded-lg bg-slate-400/20 flex items-center justify-center group-hover/block:bg-red-100 group-hover/block:text-red-500 transition-colors">
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                             </div>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover/block:text-red-600">Blocked</span>
                           </div>
                           <div className="absolute inset-0 bg-red-500/0 group-hover/block:bg-red-500/5 rounded-xl transition-colors"></div>
                        </div>
                      );
                    })}

                    {/* Render Appointment Cards */}
                    {dayAppointments.map((apt, idx) => {
                      const apptKey = `appt-${apt.id}-${apt.time}`;
                      const top = getRelativeTop(apt.time);
                      const isCompleted = apt.status === 'Completed';
                      
                      // Simple overlap detection
                      const overlapping = dayAppointments.slice(0, idx).filter(other => getRelativeTop(other.time) === top);
                      const leftOffset = overlapping.length * 15;
                      const width = 100 - (overlapping.length * 15);

                      return (
                        <div 
                          key={apptKey}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(apt);
                          }}
                          style={{ 
                            top: `${top + 4}px`, 
                            height: `${SLOT_HEIGHT - 8}px`,
                            left: `${leftOffset}%`,
                            width: `${width - 2}%`
                          }}
                          className={`absolute rounded-xl p-3 shadow-xl flex flex-col justify-center transition-all hover:scale-[1.02] z-20 pointer-events-auto cursor-pointer border-2 border-white/30 ${
                            isCompleted 
                            ? 'bg-emerald-500 text-white shadow-emerald-100' 
                            : 'bg-blue-600 text-white shadow-blue-100'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[7px] font-black uppercase tracking-tighter opacity-70">{isCompleted ? 'Completed' : 'Booked'}</span>
                            {apt.type === 'Video' && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></svg>}
                          </div>
                          <span className="text-xs font-black truncate leading-tight tracking-tight">{apt.patientName}</span>
                          <div className="flex items-center gap-1 mt-1 opacity-80">
                            <span className="text-[8px] font-black bg-white/20 px-1.5 py-0.5 rounded-md">{apt.time}</span>
                            <span className="text-[8px] font-bold truncate">• {apt.type}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>

      {selectedAppointment && (
        <AppointmentDetailModal 
          appointment={selectedAppointment} 
          onClose={() => setSelectedAppointment(null)} 
        />
      )}
    </div>
  );
}
