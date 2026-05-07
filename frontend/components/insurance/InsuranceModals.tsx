"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/InputCard';
import Button from '@/components/ui/Button';

// --- Shared Types ---
interface Claim {
  id: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  description?: string;
}

interface Policy {
  id: string;
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  validityDate: string;
  status: 'Active' | 'Expired' | 'Expiring Soon';
  claims: Claim[];
}

// --- Add Policy Modal ---
interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (policy: Omit<Policy, 'id' | 'status' | 'claims'>) => void;
}

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    provider: '',
    policyNumber: '',
    coverageAmount: '',
    validityDate: ''
  });

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
    if (formData.provider && formData.policyNumber && formData.coverageAmount) {
      onAdd({
        provider: formData.provider,
        policyNumber: formData.policyNumber,
        coverageAmount: parseFloat(formData.coverageAmount),
        validityDate: formData.validityDate || 'Dec 31, 2026'
      });
      setFormData({ provider: '', policyNumber: '', coverageAmount: '', validityDate: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Register Policy</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Provider" placeholder="e.g. Blue Cross" value={formData.provider} onChange={(e) => setFormData({...formData, provider: e.target.value})} required />
            <Input label="Policy #" placeholder="e.g. BCS-29930" value={formData.policyNumber} onChange={(e) => setFormData({...formData, policyNumber: e.target.value})} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Coverage ($)" type="number" placeholder="150000" value={formData.coverageAmount} onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})} required />
            <Input label="Expiry Date" type="date" value={formData.validityDate} onChange={(e) => setFormData({...formData, validityDate: e.target.value})} required />
          </div>
          <div className="flex space-x-4 pt-8">
            <Button variant="outline" fullWidth size="lg" onClick={onClose} type="button" className="rounded-2xl py-6 font-black uppercase tracking-widest text-xs border-4">Cancel</Button>
            <Button fullWidth size="lg" type="submit" className="rounded-2xl py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100">Add Policy</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Policy Details Modal ---
interface PolicyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy | null;
  onAddClaim: (policyId: string, claim: Omit<Claim, 'id' | 'date' | 'status'>) => void;
}

export const PolicyDetailsModal: React.FC<PolicyDetailsModalProps> = ({ isOpen, onClose, policy, onAddClaim }) => {
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDesc, setClaimDesc] = useState('');

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

  if (!isOpen || !policy) return null;

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claimAmount && claimDesc) {
      onAddClaim(policy.id, {
        amount: parseFloat(claimAmount),
        description: claimDesc
      });
      setClaimAmount('');
      setClaimDesc('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-slate-50 relative flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{policy.provider}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{policy.policyNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-slate-50 p-3 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-10 space-y-12">
          {/* Policy Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-slate-50/50 p-6 rounded-[2rem] border-2 border-white text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Coverage</p>
                <p className="text-xl font-black text-slate-800 tracking-tight">${policy.coverageAmount.toLocaleString()}</p>
             </div>
             <div className="bg-slate-50/50 p-6 rounded-[2rem] border-2 border-white text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Valid Until</p>
                <p className="text-xl font-black text-slate-800 tracking-tight">{new Date(policy.validityDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
             </div>
             <div className="bg-slate-50/50 p-6 rounded-[2rem] border-2 border-white text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Claims filed</p>
                <p className="text-xl font-black text-slate-800 tracking-tight">{policy.claims?.length || 0}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Claims History */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Claims History</h4>
              <div className="space-y-4">
                {policy.claims && policy.claims.length > 0 ? (
                  policy.claims.map((claim) => (
                    <div key={claim.id} className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] flex justify-between items-center group hover:border-blue-100 transition-colors">
                      <div>
                        <p className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-tight">{claim.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{claim.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-700 text-sm mb-1">${claim.amount.toLocaleString()}</p>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          claim.status === 'Approved' ? 'bg-green-100 text-green-600' :
                          claim.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                        }`}>{claim.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                    <p className="text-slate-300 font-black text-xs uppercase tracking-widest">No claims filed yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* New Claim Form */}
            <div className="space-y-6">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">File New Claim</h4>
               <form onSubmit={handleClaimSubmit} className="bg-slate-50/50 p-8 rounded-[2.5rem] border-2 border-white space-y-6">
                 <Input 
                   label="Claim Amount ($)" 
                   type="number" 
                   placeholder="e.g. 1200" 
                   value={claimAmount}
                   onChange={(e) => setClaimAmount(e.target.value)}
                   required
                 />
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                      placeholder="e.g. Hospitalization due to fracture..."
                      value={claimDesc}
                      onChange={(e) => setClaimDesc(e.target.value)}
                      required
                    />
                 </div>
                 <Button fullWidth size="lg" type="submit" className="font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl shadow-xl shadow-blue-100 mt-4">
                    Submit Request
                 </Button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
