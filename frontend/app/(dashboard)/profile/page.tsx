"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/InputCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { EditProfileModal, AddFamilyModal, ProfileData } from '@/components/profile/ProfileModals';

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Initial empty state (baseline from Auth)
  const [profileData, setProfileData] = useState<ProfileData>({
    identity: {
      name: user?.name || '',
      dob: '',
      email: user?.email || '',
      phone: '',
      address: '',
      patientId: '',
    },
    medical: {
      bloodType: '',
      height: '',
      weight: '',
      allergies: '',
    },
    family: [],
    emergency: {
      name: '',
      relation: '',
      phone: '',
    }
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Hydrate State ---
  useEffect(() => {
    if (user?.email) {
      const storageKey = `apexCare_profileData_${user.email}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Merge with current auth if necessary
          setProfileData(parsed);
        } catch (err) {
          console.error("Failed to parse profile data", err);
        }
      } else {
        // First time: Initialize with auth data
        setProfileData(prev => ({
          ...prev,
          identity: {
            ...prev.identity,
            name: user.name || '',
            email: user.email || '',
          }
        }));
      }
      setIsLoading(false);
    }
  }, [user]);

  const saveToStorage = (data: ProfileData) => {
    if (user?.email) {
      const storageKey = `apexCare_profileData_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // --- Handlers ---
  const handleUpdateProfile = (updated: Partial<ProfileData>) => {
    const newData = { ...profileData, ...updated };
    setProfileData(newData);
    saveToStorage(newData);
    setNotification('Profile Updated Successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddFamilyMember = (member: { name: string; relation: string; age: number; phone: string }) => {
    const colors = [
      'bg-purple-100 text-purple-600',
      'bg-teal-100 text-teal-600',
      'bg-blue-100 text-blue-600',
      'bg-amber-100 text-amber-600'
    ];
    
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      ...member,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    const newData = {
      ...profileData,
      family: [...profileData.family, newMember]
    };
    
    setProfileData(newData);
    saveToStorage(newData);
    setNotification('Family Member Added!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper for "Not set" display
  const renderVal = (val: string | undefined, fallback: string = "Not set") => {
    if (!val || val.trim() === "") {
        return <span className="text-slate-300 italic font-medium">{fallback}</span>;
    }
    return <span className="text-slate-700 font-bold">{val}</span>;
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="animate-pulse flex flex-col items-center space-y-4">
           <div className="w-16 h-16 bg-slate-100 rounded-full"></div>
           <div className="h-4 w-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-8 right-8 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-4 fade-in duration-300 font-black uppercase tracking-widest text-[10px]">
          {notification}
        </div>
      )}

      <header className="px-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Patient Profile</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your identity and medical metrics securely.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SECTION (70%) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Identity Card */}
          <Card className="p-10 border-2 border-slate-50 shadow-sm rounded-[3rem] bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-100 ring-4 ring-white">
                    {profileData.identity.name ? getInitials(profileData.identity.name) : '??'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profileData.identity.name || 'Anonymous Patient'}</h2>
                      <div className="bg-blue-100 p-1 rounded-full text-blue-600" title="Verified Account">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400">
                       <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg">DOB: {renderVal(profileData.identity.dob, "Add DOB")}</span>
                       <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                       <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg">ID: {renderVal(profileData.identity.patientId, "Assign ID")}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="px-8 h-12 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] shadow-sm">Edit Profile</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 px-2">
                {[
                  { label: 'Registered Email', value: profileData.identity.email || user?.email, icon: '✉️' },
                  { label: 'Primary Contact', value: profileData.identity.phone, icon: '📱' },
                  { label: 'Residential Address', value: profileData.identity.address, icon: '🏠' },
                  { label: 'Identity Protection', value: 'ApexCare Shield Enabled', icon: '🛡️' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">{item.icon}</div>
                    <div className="pt-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{item.label}</p>
                      <div className="text-sm truncate max-w-[220px]">{renderVal(item.value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Medical Snapshot */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Medical Snapshot</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Blood Group', value: profileData.medical.bloodType, color: 'bg-red-50 text-red-600', icon: '🩸' },
                { label: 'Height', value: profileData.medical.height ? `${profileData.medical.height} cm` : '', color: 'bg-blue-50 text-blue-600', icon: '📏' },
                { label: 'Weight', value: profileData.medical.weight ? `${profileData.medical.weight} kg` : '', color: 'bg-green-50 text-green-600', icon: '⚖️' },
                { label: 'Allergies', value: profileData.medical.allergies, color: 'bg-amber-50 text-amber-600', icon: '🛡️' }
              ].map((stat, i) => (
                <Card key={i} onClick={() => setIsEditModalOpen(true)} className="p-6 border-2 border-slate-50 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1 rounded-[2rem] cursor-pointer group">
                  <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 shadow-sm border-2 border-white group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="text-sm tracking-tight truncate px-1">{renderVal(stat.value)}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (30%) */}
        <div className="lg:col-span-4 space-y-10">
          {/* Family Members Card */}
          <Card className="p-8 border-2 border-slate-50 shadow-sm rounded-[2.5rem] bg-white overflow-visible relative">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Family Members</h3>
              <button onClick={() => setIsFamilyModalOpen(true)} className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {profileData.family.length > 0 ? profileData.family.map((member) => (
                <div key={member.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-3 rounded-2xl transition-colors -mx-1">
                   <div className="flex items-center space-x-4">
                      <div className={`${member.color} w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm`}>{getInitials(member.name)}</div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{member.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{member.relation} • {member.age} yrs</p>
                        <div className="flex items-center space-x-1.5 mt-1">
                           <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.31-2.31a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 18.92Z"/></svg>
                           <p className="text-[9px] font-bold text-slate-500 tracking-tight">{member.phone}</p>
                        </div>
                      </div>
                   </div>
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m9 18 6-6-6-6"/></svg>
                   </div>
                </div>
              )) : (
                <div className="py-14 text-center border-4 border-dashed border-slate-50 rounded-[2rem] bg-slate-50/20">
                   <div className="text-slate-200 mb-3 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                   </div>
                   <p className="text-slate-300 font-black text-[9px] uppercase tracking-widest max-w-[150px] mx-auto leading-relaxed">No family members registered in your portal yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Emergency Contact Card */}
          <Card onClick={() => setIsEditModalOpen(true)} className="p-8 bg-slate-900 shadow-2xl shadow-slate-200 rounded-[2.5rem] relative overflow-hidden group border-0 cursor-pointer">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
             
             <div className="relative z-10">
               <div className="flex items-center space-x-4 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.31-2.31a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 18.92Z"/></svg>
                 </div>
                 <h3 className="text-xs font-black text-white uppercase tracking-widest">Emergency Hotline</h3>
               </div>
               
               <div className="space-y-1">
                 <p className="text-lg font-black text-white tracking-tight uppercase">{profileData.emergency.name || "None Registered"}</p>
                 <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black text-red-400 uppercase tracking-widest px-2 py-0.5 bg-red-500/10 rounded-full">Primary</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">• {profileData.emergency.relation || "Not set"}</span>
                 </div>
               </div>
               
               <div className="mt-8 pt-8 border-t border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Number</p>
                  <p className="text-xl font-bold text-slate-300 tracking-wider truncate">{profileData.emergency.phone || "Add Contact"}</p>
               </div>
             </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        data={profileData} 
        onSave={handleUpdateProfile} 
      />

      <AddFamilyModal 
        isOpen={isFamilyModalOpen} 
        onClose={() => setIsFamilyModalOpen(false)} 
        onAdd={handleAddFamilyMember} 
      />
    </div>
  );
}
