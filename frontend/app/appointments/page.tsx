"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/InputCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Smith',
    specialty: 'Cardiologist',
    experience: '12 years exp.',
    rating: '4.9',
    image: 'SS',
    availableTime: ['10:30 AM', '02:15 PM', '04:45 PM'],
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '8 years exp.',
    rating: '4.8',
    image: 'MC',
    availableTime: ['09:00 AM', '11:30 AM', '03:00 PM'],
  },
  {
    id: 3,
    name: 'Dr. Emily Johnson',
    specialty: 'Pediatrician',
    experience: '15 years exp.',
    rating: '5.0',
    image: 'EJ',
    availableTime: ['01:00 PM', '04:30 PM', '06:15 PM'],
  },
  {
    id: 4,
    name: 'Dr. Robert Wilson',
    specialty: 'Orthopedic',
    experience: '10 years exp.',
    rating: '4.7',
    image: 'RW',
    availableTime: ['10:00 AM', '12:45 PM', '05:30 PM'],
  },
];

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [activeTab, setActiveTab] = useState<'specialists' | 'virtual'>('specialists');
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      setBookedAppointments(JSON.parse(saved));
    }
  }, []);

  const handleBook = () => {
    if (selectedDoctor && selectedTime) {
      const doctor = doctors.find(d => d.id === selectedDoctor);
      if (doctor) {
        const newAppointment = {
          id: Date.now(),
          doctorName: doctor.name,
          specialty: doctor.specialty,
          time: selectedTime,
          date: 'Today, April 2',
          type: activeTab === 'specialists' ? 'In-Person' : 'Virtual'
        };
        
        const updatedAppointments = [...bookedAppointments, newAppointment];
        setBookedAppointments(updatedAppointments);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        // Backward compatibility for dashboard if needed
        localStorage.setItem('healthSync_appointment', JSON.stringify(newAppointment));
      }

      setIsBooked(true);
      // Success message will be shown, then reset
      setTimeout(() => {
        setIsBooked(false);
        setSelectedDoctor(null);
        setSelectedTime(null);
      }, 5000);
    }
  };

  const handleCancelAppointment = (id: number) => {
    const updated = bookedAppointments.filter(app => app.id !== id);
    setBookedAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    if (updated.length > 0) {
      localStorage.setItem('healthSync_appointment', JSON.stringify(updated[updated.length - 1]));
    } else {
      localStorage.removeItem('healthSync_appointment');
    }
  };

  const currentDoctor = doctors.find((d) => d.id === selectedDoctor);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Book an Appointment</h1>
              <p className="text-slate-500 mt-2">Choose from our experienced medical professionals.</p>
            </div>
            <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm relative">
              <button 
                onClick={() => setActiveTab('specialists')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === 'specialists' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Specialists
              </button>
              <button 
                onClick={() => {
                    setActiveTab('virtual');
                    alert('Virtual consultation mode is coming soon!');
                    setTimeout(() => setActiveTab('specialists'), 100);
                }}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === 'virtual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Virtual
              </button>
            </div>
          </header>
          
          {/* Your Appointments Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-blue-600">
                <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
              </svg>
              Your Appointments
            </h2>
            {bookedAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookedAppointments.map((app) => (
                  <Card key={app.id} className="border-l-4 border-l-blue-600 shadow-md hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{app.doctorName}</h4>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{app.specialty}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${app.type === 'Virtual' ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        {app.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mb-4 bg-slate-50 p-2 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-slate-400">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="font-medium">{app.date}, {app.time}</span>
                    </div>
                    <button 
                      onClick={() => handleCancelAppointment(app.id)}
                      className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      Cancel Appointment
                    </button>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                    <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
                  </svg>
                </div>
                <p className="text-slate-400 font-bold">No appointments booked yet</p>
                <p className="text-sm text-slate-400 mt-1">Select a doctor from the list below to schedule one.</p>
              </div>
            )}
          </section>

          <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Specialists</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {doctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className={`transition-all duration-300 cursor-pointer border-2 ${selectedDoctor === doctor.id ? 'border-blue-500 shadow-xl ring-4 ring-blue-50' : 'border-transparent'}`} 
                  onClick={() => {
                    setSelectedDoctor(doctor.id);
                    setSelectedTime(null);
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center border border-blue-200 shadow-inner">
                        <span className="text-blue-700 font-black text-xl tracking-tighter">{doctor.image}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-lg">{doctor.name}</h4>
                          <span className="flex items-center text-amber-500 text-sm font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            {doctor.rating}
                          </span>
                        </div>
                        <p className="text-blue-600 font-bold text-sm tracking-tight">{doctor.specialty}</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{doctor.experience}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableTime.map((time) => (
                        <button
                          key={time}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelectedDoctor(doctor.id);
                            setSelectedTime(time);
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
                            selectedDoctor === doctor.id && selectedTime === time
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              {isBooked ? (
                <Card className="bg-green-50 border-green-200 text-center py-10 shadow-2xl animate-in fade-in zoom-in duration-500">
                  <div className="bg-green-500 text-white p-4 rounded-full w-fit mx-auto mb-6 shadow-lg shadow-green-200 border-4 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-green-800 mb-2">Booking Confirmed!</h3>
                  <p className="text-green-700 font-medium px-6">
                    Your appointment with {currentDoctor?.name} has been successfully scheduled.
                  </p>
                  <p className="text-xs text-green-600 mt-6 font-bold uppercase tracking-widest">
                    Confirmation email sent
                  </p>
                </Card>
              ) : (
                <Card title="Booking Summary" className="shadow-2xl border-t-4 border-t-blue-600">
                  {selectedDoctor ? (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-700 shadow-inner">
                          {currentDoctor?.image}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                          <p className="font-bold text-slate-800 leading-tight">{currentDoctor?.name}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center font-bold text-teal-700 shadow-inner">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                          <p className="font-bold text-slate-800 leading-tight">
                            {selectedTime ? selectedTime : 'Select a Slot'}
                          </p>
                          <p className="text-xs text-slate-400 font-medium tracking-tight">Today, April 2</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Consultation Fee</span>
                          <span className="font-bold text-slate-800">$50.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Service Fee</span>
                          <span className="font-bold text-slate-800">$5.00</span>
                        </div>
                        <div className="flex justify-between text-xl font-black pt-2 border-t border-dashed border-slate-200">
                          <span className="text-slate-900 tracking-tight">Total</span>
                          <span className="text-blue-600">$55.00</span>
                        </div>
                      </div>

                      <Button 
                        fullWidth 
                        size="lg" 
                        disabled={!selectedTime}
                        onClick={handleBook}
                        className="py-4 shadow-xl shadow-blue-100 font-bold active:scale-95 transition-transform"
                      >
                        Confirm Booking
                      </Button>
                      
                      <p className="text-center text-xs text-slate-400 font-medium">
                        Secure 256-bit encrypted checkout
                      </p>
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-4">
                      <div className="bg-slate-50 p-6 rounded-full w-fit mx-auto border-2 border-dashed border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                          <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
                        </svg>
                      </div>
                      <p className="text-slate-400 text-sm font-medium px-8 leading-relaxed">
                        Select a specialist and preferred time slot to proceed with your booking summary.
                      </p>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
