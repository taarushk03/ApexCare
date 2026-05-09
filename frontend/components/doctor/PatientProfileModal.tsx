"use client";

import React from 'react';

interface Patient {
  id: string | number;
  name: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  phone: string;
  email: string;
  bloodGroup: string;
  height: string;
  weight: string;
  allergies: string[];
  medications: string[];
  medicalHistory: { date: string; diagnosis: string; notes: string }[];
}

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({ isOpen, onClose, patient }) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
              <p className="text-slate-500 font-medium">#{patient.id} • {patient.age} yrs • {patient.gender}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column - Vitals & Contact */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Vitals & Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Group</span>
                    <span className="font-bold text-slate-800">{patient.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Height</span>
                    <span className="font-bold text-slate-800">{patient.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weight</span>
                    <span className="font-bold text-slate-800">{patient.weight}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-bold text-slate-800 text-sm">{patient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-bold text-slate-800 text-sm">{patient.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Medical Data */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 font-bold mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.length > 0 ? patient.allergies.map((allergy, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-red-200 rounded-full text-xs font-bold text-red-600 shadow-sm">{allergy}</span>
                    )) : <span className="text-sm opacity-70">No known allergies</span>}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 font-bold mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                    Current Medications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.medications.length > 0 ? patient.medications.map((med, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs font-bold text-blue-600 shadow-sm">{med}</span>
                    )) : <span className="text-sm opacity-70">None</span>}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                  <h3 className="font-bold text-slate-800">Medical History</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {patient.medicalHistory.map((history, i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm text-slate-800">{history.diagnosis}</h4>
                        <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-full">{history.date}</span>
                      </div>
                      <p className="text-sm text-slate-600">{history.notes}</p>
                    </div>
                  ))}
                  {patient.medicalHistory.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      No previous medical history available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl shrink-0 flex justify-end gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors bg-white">
            Send Message
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Add Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;
