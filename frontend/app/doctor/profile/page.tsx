"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSharedDoctors, saveSharedDoctors, initSharedData, Doctor } from '@/lib/sharedData';

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // If user is not loaded yet, wait
      if (!user) return;

      // If user is loaded but not a doctor or missing ID, stop loading anyway
      if (user.role !== 'DOCTOR' || !user.doctorId) {
        setLoading(false);
        return;
      }

      try {
        console.log('--- Fetching Doctor Profile ---');
        const response = await fetch(`http://localhost:3001/doctors/${user.doctorId}`);
        
        if (!response.ok) {
           throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile({
          id: data.id,
          name: data.fullName,
          email: data.email,
          phone: data.phone || "",
          specialty: data.specialization,
          experience: data.experience?.toString() || "0",
          qualifications: data.qualifications || "",
          bio: data.bio || "",
          clinicAddress: data.clinicLocation || "",
          availableDays: data.availability || "",
          rating: "4.9",
          fee: 50,
          image: data.profileImage || "",
          availableTime: []
        });
      } catch (error) {
        console.error('Failed to fetch doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile || !user?.doctorId) return;
    try {
      const response = await fetch(`http://localhost:3001/doctors/${user.doctorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile.name,
          email: profile.email,
          phone: profile.phone,
          specialization: profile.specialty,
          experience: parseInt(profile.experience) || 0,
          qualifications: profile.qualifications,
          bio: profile.bio,
          clinicLocation: profile.clinicAddress,
          availability: profile.availableDays
        })
      });

      if (response.ok) {
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Profile Not Found</h3>
        <p className="text-slate-500 text-sm mt-1">We couldn't retrieve your doctor profile information.</p>
      </div>
    );
  }

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
