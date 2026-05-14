"use client";

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/InputCard';
import { useAuth } from '@/context/AuthContext';
import { 
  initSharedData, 
  getSharedDoctors, 
  getSharedAppointments, 
  saveSharedAppointment, 
  deleteSharedAppointment,
  Doctor,
  Appointment
} from '@/lib/sharedData';

const specialties = [
  'All Specialties',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'Dermatologist',
  'General Physician',
  'Oncologist',
  'Psychiatatrist',
];

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  
  // Booking Flow States
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<'In-Person' | 'Video'>('In-Person');
  
  // Generate 7-day rolling window for dates
  const [availableDates, setAvailableDates] = useState<{full: string, day: string, date: string}[]>([]);

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3001/doctors');
        const data = await response.json();
        
        // Map backend Doctor entity to frontend Doctor interface
        const mappedDoctors: Doctor[] = data.map((d: any) => ({
          id: d.id,
          name: d.fullName,
          email: d.email,
          specialty: d.specialization,
          experience: `${d.experience} years exp.`,
          rating: '4.9', // Default rating as backend doesn't have it yet
          image: d.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          bio: d.bio || 'Professional healthcare provider at ApexCare.',
          fee: 50, // Default fee
          availableTime: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'], // Default times
          qualifications: d.qualifications,
          clinicAddress: d.clinicLocation,
          availableDays: d.availability || 'Mon - Fri'
        }));
        
        setDoctors(mappedDoctors);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();

    // Generate dates starting from today
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            full: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: d.getDate().toString(),
        });
    }
    setAvailableDates(dates);
    setSelectedDate(dates[0].full);
  }, []);

  const fetchBookedSlots = async () => {
    if (!bookingDoctor || !selectedDate) return;
    try {
      const response = await fetch(`http://localhost:3001/appointments/booked-slots?doctorId=${bookingDoctor.id}&date=${selectedDate}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setBookedSlots(data);
      } else {
        console.error('Booked slots response is not an array:', data);
        setBookedSlots([]);
      }
    } catch (error) {
      console.error('Failed to fetch booked slots:', error);
      setBookedSlots([]);
    }
  };

  useEffect(() => {
    if (bookingDoctor && selectedDate) {
      fetchBookedSlots();
    }
  }, [bookingDoctor, selectedDate]);

  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  const fetchAppointments = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:3001/appointments/patient/${user.id}`);
      const data = await response.json();
      
      const mappedAppts: Appointment[] = data.map((a: any) => ({
        id: a.id,
        patientEmail: user.email,
        patientName: `${user.firstName} ${user.lastName}`.trim(),
        doctorId: a.doctorId,
        doctorName: a.doctor?.fullName || 'Dr. Specialist',
        specialty: a.doctor?.specialization || 'Healthcare',
        time: new Date(a.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(a.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: a.reason.includes('Video') ? 'Video' : 'In-Person',
        status: a.status
      }));
      setBookedAppointments(mappedAppts);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  useEffect(() => {
    if (user?.id && doctors.length > 0) {
      fetchAppointments();
    }
  }, [user, doctors]);

  const handleBook = async () => {
    console.log('--- Booking Attempt ---');
    console.log('Doctor:', bookingDoctor);
    console.log('Date:', selectedDate);
    console.log('Time:', selectedTime);
    console.log('Type:', consultationType);
    console.log('User:', user);

    if (bookingDoctor && selectedTime && selectedDate && user?.id) {
      try {
        // Combine date and time for backend
        const appointmentDate = new Date(`${selectedDate} ${selectedTime}`);
        console.log('Parsed Date:', appointmentDate);

        // Prevent booking past dates
        if (appointmentDate < new Date()) {
          alert('Cannot book appointments in the past.');
          return;
        }

        const response = await fetch('http://localhost:3001/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId: user.id,
            doctorId: bookingDoctor.id,
            appointmentDate: appointmentDate.toISOString(),
            reason: `${consultationType} Consultation`,
            status: 'Pending'
          })
        });

        if (response.ok) {
          console.log('Booking successful!');
          setIsBooked(true);
          fetchAppointments();
          setTimeout(() => {
            setIsBooked(false);
            setBookingDoctor(null);
            setSelectedTime(null);
          }, 3000);
        } else {
          const errData = await response.json();
          console.error('Booking failed:', errData);
          alert(`Booking failed: ${errData.message}`);
        }
      } catch (error) {
        console.error('Failed to book appointment:', error);
      }
    } else {
      console.warn('Booking blocked by validation:', {
        hasDoctor: !!bookingDoctor,
        hasTime: !!selectedTime,
        hasDate: !!selectedDate,
        hasUserId: !!user?.id
      });
    }
  };

  const handleCancelAppointment = async (id: number) => {
    console.log('--- Cancellation Request ---');
    console.log('Appointment ID:', id);
    
    try {
      const response = await fetch(`http://localhost:3001/appointments/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        console.log('Cancellation successful for ID:', id);
        fetchAppointments();
      } else {
        console.error('Cancellation failed for ID:', id);
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-8">
      {/* User's Current Appointments */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2.5 rounded-xl mr-3 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                </span>
                Your Appointments
            </h2>
            
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-50 w-fit">
              {(['Upcoming', 'Past'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-md scale-105' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookedAppointments
                .filter(app => {
                  if (activeTab === 'Upcoming') {
                    return app.status === 'Pending' || app.status === 'Confirmed' || app.status === 'In Progress';
                  } else {
                    return app.status === 'Completed' || app.status === 'Cancelled';
                  }
                })
                .map((app) => (
              <Card key={app.id} className={`shadow-sm hover:shadow-xl transition-all border border-slate-100 p-5 flex flex-col h-full ${
                app.status === 'Cancelled' ? 'opacity-70 grayscale-[0.5]' : ''
              }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-slate-800 tracking-tight text-lg">{app.doctorName}</h4>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight ${
                            app.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                            app.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                            app.status === 'In Progress' ? 'bg-blue-600 text-white animate-pulse' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{app.specialty}</p>
                    </div>
                    <div className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tight shadow-sm shrink-0 ${app.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                        {app.type}
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-slate-400 mb-6 font-bold bg-slate-50 px-3 py-2 rounded-xl w-full border border-slate-100/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-slate-300"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {app.date} • <span className="text-slate-600 ml-1">{app.time}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    {(app.status === 'Pending' || app.status === 'Confirmed') ? (
                      <button 
                        onClick={() => handleCancelAppointment(app.id)}
                        className="text-[10px] font-black text-red-500 hover:text-red-600 flex items-center uppercase tracking-widest transition-colors group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 group-hover:scale-110 transition-transform"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        Cancel Booking
                      </button>
                    ) : (
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        No actions available
                      </div>
                    )}

                    {app.status === 'Completed' && (
                      <button className="text-[10px] font-black text-blue-600 hover:underline underline-offset-4 uppercase tracking-widest">
                        View Summary
                      </button>
                    )}
                  </div>
              </Card>
              ))}

              {bookedAppointments.filter(app => {
                if (activeTab === 'Upcoming') {
                  return app.status === 'Pending' || app.status === 'Confirmed' || app.status === 'In Progress';
                } else {
                  return app.status === 'Completed' || app.status === 'Cancelled';
                }
              }).length === 0 && (
                <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-[2.5rem] border-4 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold">No {activeTab.toLowerCase()} appointments found.</p>
                </div>
              )}
          </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-50 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input
            type="text"
            placeholder="Search doctors by name..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="md:w-72 relative font-bold text-slate-700">
            <select 
                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white appearance-none cursor-pointer"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </span>
        </div>
      </section>

      {/* Doctor Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="group hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 border-2 border-slate-50 flex flex-col p-6">
                    <div className="flex items-center space-x-5 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border-2 border-white shadow-lg group-hover:rotate-6 transition-transform">
                        {doctor.image}
                    </div>
                    <div>
                        <h4 className="font-extrabold text-slate-800 text-lg leading-tight">{doctor.name}</h4>
                        <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-0.5">{doctor.specialty}</p>
                        <div className="flex items-center mt-1.5">
                        <span className="text-amber-500 text-xs font-black flex items-center mr-3 bg-amber-50 px-2 py-0.5 rounded-lg">
                            ⭐ {doctor.rating}
                        </span>
                        <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{doctor.experience}</span>
                        </div>
                    </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                    {doctor.bio}
                    </p>
                    <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        fullWidth 
                        onClick={() => alert(`Profile for ${doctor.name} is coming soon!`)}
                    >
                        Profile
                    </Button>
                    <Button 
                        fullWidth 
                        onClick={() => setBookingDoctor(doctor)}
                        className="shadow-lg shadow-blue-50"
                    >
                        Book Now
                    </Button>
                    </div>
                </Card>
            ))
        ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <p className="text-slate-400 font-black text-lg mb-4">No matching doctors found</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedSpecialty('All Specialties');}}
                  className="bg-blue-600 text-white font-black text-xs uppercase tracking-widest px-8 py-3 rounded-2xl shadow-xl shadow-blue-100 hover:scale-105 transition-transform"
                >
                  Clear Filters
                </button>
            </div>
        )}
      </div>

      {/* Booking Overlay (Modal) */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50">
              {/* Modal Header */}
              <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xl shadow-blue-100">
                          {bookingDoctor.image}
                      </div>
                      <div>
                          <h3 className="font-black text-slate-800 text-2xl tracking-tight">{bookingDoctor.name}</h3>
                          <p className="text-blue-600 text-xs font-black uppercase tracking-widest">{bookingDoctor.specialty}</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => { setBookingDoctor(null); setSelectedTime(null); }}
                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border-2 border-slate-100 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                  {isBooked ? (
                      <div className="py-12 text-center animate-in zoom-in duration-500">
                          <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-100 rotate-6">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Success!</h2>
                          <p className="text-slate-500 font-bold">Your appointment has been confirmed.</p>
                      </div>
                  ) : (
                      <>
                          {/* Date Selector */}
                          <section>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Select Schedule</h4>
                              <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                                  {availableDates.map((d) => (
                                      <button
                                        key={d.full}
                                        onClick={() => setSelectedDate(d.full)}
                                        className={`flex-shrink-0 w-20 h-24 rounded-[1.75rem] flex flex-col items-center justify-center transition-all duration-300 border-4 ${
                                          selectedDate === d.full 
                                          ? 'bg-blue-600 border-blue-100 text-white shadow-2xl shadow-blue-200 scale-110' 
                                          : 'bg-white border-slate-50 text-slate-600 hover:border-blue-100 hover:bg-blue-50/30'
                                        }`}
                                      >
                                          <span className={`text-[10px] font-black tracking-widest mb-1 ${selectedDate === d.full ? 'text-blue-100' : 'text-slate-300'}`}>{d.day}</span>
                                          <span className="text-2xl font-black tracking-tighter">{d.date}</span>
                                      </button>
                                  ))}
                              </div>
                          </section>

                          {/* Time Slots */}
                          <section>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Available Hours</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                  {bookingDoctor.availableTime
                                    .filter(time => {
                                      // If selected date is today, hide past times
                                      const now = new Date();
                                      const isToday = selectedDate === now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                      if (isToday) {
                                        const slotTime = new Date(`${selectedDate} ${time}`);
                                        return slotTime > now;
                                      }
                                      return true;
                                    })
                                    .map((time: string) => {
                                      const isBooked = Array.isArray(bookedSlots) && bookedSlots.includes(time);
                                      const now = new Date();
                                      const isToday = selectedDate === now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                      let isPast = false;
                                      if (isToday) {
                                        const slotTime = new Date(`${selectedDate} ${time}`);
                                        isPast = slotTime <= now;
                                      }

                                      return (
                                        <button
                                          key={time}
                                          disabled={isBooked || isPast}
                                          onClick={() => {
                                            console.log('Time Selected:', time);
                                            setSelectedTime(time);
                                          }}
                                          className={`py-4 rounded-2xl font-black text-sm transition-all border-4 relative ${
                                            selectedTime === time 
                                            ? 'bg-slate-900 border-slate-700 text-white shadow-xl translate-y-[-2px]' 
                                            : isBooked || isPast
                                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-60'
                                            : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                                          }`}
                                        >
                                            {time}
                                            {isBooked && (
                                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg shadow-sm">
                                                {/* If time is in bookedSlots but not necessarily a real appointment, it's blocked */}
                                                BLOCKED
                                              </span>
                                            )}
                                        </button>
                                      );
                                    })}
                              </div>
                              {bookingDoctor.availableTime.filter(time => {
                                const now = new Date();
                                const isToday = selectedDate === now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                if (isToday) {
                                  const slotTime = new Date(`${selectedDate} ${time}`);
                                  return slotTime > now;
                                }
                                return true;
                              }).length === 0 && (
                                <p className="mt-4 text-xs font-bold text-slate-400 text-center bg-slate-50 py-4 rounded-2xl border-2 border-dashed border-slate-100">
                                  No more slots available for today. Please select a later date.
                                </p>
                              )}
                          </section>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                              {/* Consultation Type */}
                              <section>
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Visit Type</h4>
                                  <div className="space-y-4">
                                      {[
                                          { id: 'In-Person', label: 'In-Person Visit', icon: '📍' },
                                          { id: 'Video', label: 'Virtual Consultation', icon: '🎥' }
                                      ].map((t) => (
                                          <button
                                            key={t.id}
                                            onClick={() => setConsultationType(t.id as any)}
                                            className={`w-full p-5 rounded-[1.75rem] flex items-center space-x-4 border-4 transition-all duration-300 ${
                                              consultationType === t.id 
                                              ? 'bg-blue-50 border-blue-200 shadow-lg' 
                                              : 'bg-white border-slate-50 hover:border-slate-100'
                                            }`}
                                          >
                                              <div className="text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm border-2 border-slate-50">{t.icon}</div>
                                              <span className={`font-black text-sm ${consultationType === t.id ? 'text-blue-900' : 'text-slate-700'}`}>{t.label}</span>
                                              {consultationType === t.id && <span className="ml-auto text-blue-600 font-black">✓</span>}
                                          </button>
                                      ))}
                                  </div>
                              </section>

                              {/* Booking Summary Preview */}
                              <section className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-white shadow-inner h-fit">
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Billings</h4>
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center text-sm font-bold">
                                          <span className="text-slate-400">Fee</span>
                                          <span className="text-slate-800">${bookingDoctor.fee}.00</span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm font-bold">
                                          <span className="text-slate-400">Service</span>
                                          <span className="text-slate-800">$5.00</span>
                                      </div>
                                      <div className="pt-6 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline">
                                          <span className="font-black text-slate-900 uppercase text-xs">Total</span>
                                          <span className="text-3xl font-black text-blue-600">${bookingDoctor.fee + 5}</span>
                                      </div>
                                  </div>
                                  {!selectedTime && (
                                    <p className="mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse">
                                      ⚠️ Please select a time slot
                                    </p>
                                  )}
                                  <Button 
                                    className="mt-6 shadow-2xl shadow-blue-200" 
                                    fullWidth 
                                    size="lg"
                                    onClick={handleBook}
                                  >
                                      Confirm Booking
                                  </Button>
                              </section>
                          </div>
                      </>
                  )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
