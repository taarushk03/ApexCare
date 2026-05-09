"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSharedDoctors, saveSharedDoctors, initSharedData, Doctor } from '@/lib/sharedData';

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<Doctor>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    qualifications: "",
    bio: "",
    clinicAddress: "",
    availableDays: "",
    rating: "0.0",
    fee: 0,
    image: "",
    availableTime: []
  });

  useEffect(() => {
    initSharedData();
    if (user?.email) {
      const doctors = getSharedDoctors();
      const myDoctorRecord = doctors.find(d => d.email === user.email);
      if (myDoctorRecord) {
        setProfile(myDoctorRecord);
      } else {
        // Fallback for new doctor that doesn't exist in mock data yet
        setProfile(prev => ({
          ...prev,
          name: user.name || "Doctor",
          email: user.email || ""
        }));
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    
    // Save to centralized data
    const doctors = getSharedDoctors();
    const updatedDoctors = doctors.map(d => d.id === profile.id ? profile : d);
    // If not found (new doctor), append it
    if (!doctors.find(d => d.id === profile.id)) {
        profile.id = Date.now(); // assign an ID
        updatedDoctors.push(profile);
    }
    
    saveSharedDoctors(updatedDoctors);
    alert("Profile updated successfully in shared storage!");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your public information and clinical details.</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
            isEditing 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
          }`}
        >
          {isEditing ? (
            <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Save Changes</>
          ) : (
            <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Edit Profile</>
          )}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-800"></div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
              <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-4xl font-bold text-blue-600">
                {profile.name ? profile.name.charAt(0) : '?'}
              </div>
            </div>
            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-slate-800">{profile.name.includes('Dr.') ? profile.name : `Dr. ${profile.name}`}</h2>
              <p className="text-blue-600 font-bold">{profile.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
                    <input 
                      type="text" name="name" 
                      value={profile.name} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                    <input 
                      type="email" name="email" 
                      value={profile.email} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
                    <input 
                      type="tel" name="phone" 
                      value={profile.phone || ''} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Biography</label>
                    <textarea 
                      name="bio" rows={4}
                      value={profile.bio} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed resize-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Professional Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Specialization</label>
                      <input 
                        type="text" name="specialty" 
                        value={profile.specialty} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Experience</label>
                      <input 
                        type="text" name="experience" 
                        value={profile.experience} onChange={handleChange} disabled={!isEditing}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Qualifications</label>
                    <input 
                      type="text" name="qualifications" 
                      value={profile.qualifications} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Primary Clinic/Location</label>
                    <input 
                      type="text" name="clinicAddress" 
                      value={profile.clinicAddress} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Standard Availability</label>
                    <input 
                      type="text" name="availableDays" 
                      value={profile.availableDays} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
