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

  const { user } = useAuth();

  useEffect(() => {
    initSharedData();
    setDoctors(getSharedDoctors());

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

  useEffect(() => {
    if (!user?.email) return;
    const allAppts = getSharedAppointments();
    setBookedAppointments(allAppts.filter(a => a.patientEmail === user.email));
  }, [user]);

  const handleBook = () => {
    if (bookingDoctor && selectedTime && selectedDate && user?.email) {
      const newAppointment: Appointment = {
        id: Date.now(),
        patientEmail: user.email,
        patientName: user.name || 'Unknown Patient',
        doctorId: bookingDoctor.id,
        doctorName: bookingDoctor.name,
        specialty: bookingDoctor.specialty,
        time: selectedTime,
        date: selectedDate,
        type: consultationType,
        status: 'Upcoming'
      };
      
      saveSharedAppointment(newAppointment);
      
      // Update local state
      const allAppts = getSharedAppointments();
      setBookedAppointments(allAppts.filter(a => a.patientEmail === user.email));

      setIsBooked(true);
      // Success message will be shown, then reset
      setTimeout(() => {
        setIsBooked(false);
        setBookingDoctor(null);
        setSelectedTime(null);
      }, 3000);
    }
  };

  const handleCancelAppointment = (id: number) => {
    if (user?.email) {
      deleteSharedAppointment(id);
      const allAppts = getSharedAppointments();
      setBookedAppointments(allAppts.filter(a => a.patientEmail === user.email));
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
      {bookedAppointments.length > 0 && (
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2.5 rounded-xl mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                </span>
                Upcoming Appointments
            </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookedAppointments.map((app) => (
                <Card key={app.id} className="border-l-4 border-l-blue-600 shadow-sm hover:shadow-xl transition-all border border-slate-100 p-5">
                    <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="font-black text-slate-800 tracking-tight">{app.doctorName}</h4>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{app.specialty}</p>
                    </div>
                    <div className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tight ${app.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {app.type}
                    </div>
                    </div>
                    <div className="flex items-center text-xs text-slate-400 mb-6 font-bold bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {app.date} • {app.time}
                    </div>
                    <button 
                    onClick={() => handleCancelAppointment(app.id)}
                    className="text-[10px] font-black text-red-500 hover:text-red-600 flex items-center uppercase tracking-widest transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    Cancel Booking
                    </button>
                </Card>
                ))}
            </div>
        </section>
      )}

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
                                  {bookingDoctor.availableTime.map((time: string) => (
                                      <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-4 rounded-2xl font-black text-sm transition-all border-4 ${
                                          selectedTime === time 
                                          ? 'bg-slate-900 border-slate-700 text-white shadow-xl translate-y-[-2px]' 
                                          : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                                        }`}
                                      >
                                          {time}
                                      </button>
                                  ))}
                              </div>
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
                                  <Button 
                                    className="mt-10 shadow-2xl shadow-blue-200" 
                                    fullWidth 
                                    size="lg"
                                    disabled={!selectedTime}
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
