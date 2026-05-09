"use client";

import React, { useState } from 'react';
import PatientProfileModal from '@/components/doctor/PatientProfileModal';

// Mock Patient Data
const ALL_PATIENTS = [
  {
    id: "PT-8429",
    name: "Alice Cooper",
    age: 34,
    gender: "Female",
    condition: "Hypertension",
    lastVisit: "May 5, 2026",
    phone: "+1 (555) 123-4567",
    email: "alice.cooper@example.com",
    bloodGroup: "O+",
    height: "5'6\"",
    weight: "145 lbs",
    allergies: ["Penicillin", "Peanuts"],
    medications: ["Lisinopril 10mg", "AmLodipine 5mg"],
    medicalHistory: [
      { date: "May 5, 2026", diagnosis: "Routine Checkup", notes: "Blood pressure elevated. Increased Lisinopril." },
      { date: "Jan 12, 2026", diagnosis: "Migraine", notes: "Prescribed Sumatriptan for acute attacks." }
    ]
  },
  {
    id: "PT-2910",
    name: "John Doe",
    age: 45,
    gender: "Male",
    condition: "Diabetes Type 2",
    lastVisit: "April 28, 2026",
    phone: "+1 (555) 987-6543",
    email: "johndoe@example.com",
    bloodGroup: "A-",
    height: "5'11\"",
    weight: "190 lbs",
    allergies: ["Sulfa drugs"],
    medications: ["Metformin 1000mg"],
    medicalHistory: [
      { date: "April 28, 2026", diagnosis: "Diabetes Review", notes: "HbA1c slightly high. Advised diet control." }
    ]
  },
  {
    id: "PT-5512",
    name: "Linda Smith",
    age: 28,
    gender: "Female",
    condition: "Asthma",
    lastVisit: "May 1, 2026",
    phone: "+1 (555) 678-1234",
    email: "lsmith.88@example.com",
    bloodGroup: "B+",
    height: "5'4\"",
    weight: "130 lbs",
    allergies: ["Dust Mites", "Pollen"],
    medications: ["Albuterol Inhaler"],
    medicalHistory: [
      { date: "May 1, 2026", diagnosis: "Asthma Exacerbation", notes: "Triggered by seasonal allergies. Prescribed short course oral steroids." },
      { date: "Oct 15, 2025", diagnosis: "Annual Physical", notes: "Overall healthy. Asthma well controlled." }
    ]
  },
  {
    id: "PT-1102",
    name: "Robert Johnson",
    age: 62,
    gender: "Male",
    condition: "Arthritis",
    lastVisit: "March 10, 2026",
    phone: "+1 (555) 444-5555",
    email: "rjohnson@example.com",
    bloodGroup: "O-",
    height: "6'0\"",
    weight: "210 lbs",
    allergies: [],
    medications: ["Ibuprofen 400mg", "Celecoxib 200mg"],
    medicalHistory: [
      { date: "March 10, 2026", diagnosis: "Osteoarthritis Follow-up", notes: "Joint pain worsening in right knee. Recommended physical therapy." }
    ]
  }
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const filteredPatients = ALL_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Patients</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and view your patient records easily.</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, ID or condition..."
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Age/Gender</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{patient.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.age} yrs • <span className="text-slate-500">{patient.gender}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {patient.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedPatient(patient)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                      <p className="font-bold text-lg text-slate-700">No patients found</p>
                      <p className="text-sm">Try adjusting your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PatientProfileModal 
        isOpen={selectedPatient !== null}
        onClose={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />
    </div>
  );
}
