"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/InputCard';
import Button from '@/components/ui/Button';

// --- Shared Types ---
export interface ProfileData {
  identity: {
    name: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
    patientId: string;
  };
  medical: {
    bloodType: string;
    height: string;
    weight: string;
    allergies: string;
  };
  family: Array<{
    id: string;
    name: string;
    relation: string;
    age: number;
    phone: string;
    color: string;
  }>;
  emergency: {
    name: string;
    relation: string;
    phone: string;
  };
}

// --- Edit Profile & Medical Modal ---
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProfileData;
  onSave: (updatedData: Partial<ProfileData>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData(data);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50 relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Edit Identity & Health</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Identity Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Personal Identifiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={formData.identity.name} onChange={(e) => setFormData({...formData, identity: {...formData.identity, name: e.target.value}})} required/>
              <Input label="DOB" type="date" value={formData.identity.dob} onChange={(e) => setFormData({...formData, identity: {...formData.identity, dob: e.target.value}})} required/>
              <Input label="Email Address" value={formData.identity.email} onChange={(e) => setFormData({...formData, identity: {...formData.identity, email: e.target.value}})} required/>
              <Input label="Phone Number" value={formData.identity.phone} onChange={(e) => setFormData({...formData, identity: {...formData.identity, phone: e.target.value}})} required/>
              <Input label="Patient ID" value={formData.identity.patientId} onChange={(e) => setFormData({...formData, identity: {...formData.identity, patientId: e.target.value}})} required/>
              <Input label="Residential Address" value={formData.identity.address} onChange={(e) => setFormData({...formData, identity: {...formData.identity, address: e.target.value}})} required/>
            </div>
          </div>

          <div className="h-0.5 bg-slate-50"></div>

          {/* Medical Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-teal-600 uppercase tracking-widest px-1">Biometric Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Blood Type" placeholder="e.g. AB+" value={formData.medical.bloodType} onChange={(e) => setFormData({...formData, medical: {...formData.medical, bloodType: e.target.value}})} />
              <Input label="Height (cm)" type="number" value={formData.medical.height} onChange={(e) => setFormData({...formData, medical: {...formData.medical, height: e.target.value}})} />
              <Input label="Weight (kg)" type="number" value={formData.medical.weight} onChange={(e) => setFormData({...formData, medical: {...formData.medical, weight: e.target.value}})} />
              <Input label="Allergies" placeholder="e.g. Peanuts, Penicillin" value={formData.medical.allergies} onChange={(e) => setFormData({...formData, medical: {...formData.medical, allergies: e.target.value}})} />
            </div>
          </div>

          <div className="h-0.5 bg-slate-50"></div>

          {/* Emergency Section */}
          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest px-1">Emergency Contact</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Emergency Contact Name" value={formData.emergency.name} onChange={(e) => setFormData({...formData, emergency: {...formData.emergency, name: e.target.value}})} />
                <Input label="Relation" value={formData.emergency.relation} onChange={(e) => setFormData({...formData, emergency: {...formData.emergency, relation: e.target.value}})} />
                <Input label="Direct Hotline" className="md:col-span-2" value={formData.emergency.phone} onChange={(e) => setFormData({...formData, emergency: {...formData.emergency, phone: e.target.value}})} />
             </div>
          </div>

          <div className="flex space-x-4 pt-8">
            <Button variant="outline" fullWidth size="lg" onClick={onClose} type="button" className="rounded-2xl py-6 font-black uppercase tracking-widest text-[10px] border-4">Discard</Button>
            <Button fullWidth size="lg" type="submit" className="rounded-2xl py-6 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-100">Save Identity</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Add Family Member Modal ---
interface AddFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: { name: string; relation: string; age: number; phone: string }) => void;
}

export const AddFamilyModal: React.FC<AddFamilyModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({ name: '', relation: '', age: '', phone: '' });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.relation && formData.age && formData.phone) {
        onAdd({ 
          name: formData.name, 
          relation: formData.relation, 
          age: parseInt(formData.age),
          phone: formData.phone
        });
        setFormData({ name: '', relation: '', age: '', phone: '' });
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50 relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="bg-teal-500 p-3 rounded-2xl text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add Dependent</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Full Name" placeholder="e.g. Sarah Smith" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Relation" placeholder="e.g. Spouse" value={formData.relation} onChange={(e) => setFormData({...formData, relation: e.target.value})} required />
            <Input label="Age" type="number" placeholder="32" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required />
          </div>
          <Input label="Phone Number" placeholder="+1 (234) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
          <div className="flex space-x-4 pt-4">
            <Button variant="outline" fullWidth onClick={onClose} type="button" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-2">Cancel</Button>
            <Button fullWidth type="submit" className="bg-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Confirm Member</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
