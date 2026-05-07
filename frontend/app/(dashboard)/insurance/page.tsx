"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/InputCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { AddPolicyModal, PolicyDetailsModal } from '@/components/insurance/InsuranceModals';

// --- Types ---
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

// --- Dynamic Status Helper ---
const getPolicyStatus = (dateString: string): 'Active' | 'Expired' | 'Expiring Soon' => {
  try {
    const today = new Date();
    const expiryDate = new Date(dateString);
    
    if (isNaN(expiryDate.getTime())) return 'Active';

    const diffInDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Expired';
    if (diffInDays <= 30) return 'Expiring Soon';
    return 'Active';
  } catch {
    return 'Active';
  }
};

export default function InsurancePage() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  
  const [notification, setNotification] = useState<string | null>(null);

  // --- Fetch Data ---
  const fetchData = async () => {
    if (!user?.email) {
      setPolicies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storageKey = `apexCare_insurance_${user.email}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPolicies(JSON.parse(stored));
      } else {
        setPolicies([]);
      }
    } catch (err) {
      setError('Could not connect to insurance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.email]);

  // --- Derived Calculations ---
  const activePolicies = policies.filter(p => getPolicyStatus(p.validityDate) !== 'Expired');
  const activeCount = activePolicies.length;
  const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
  
  // Total pending claims across all policies
  const totalPendingClaims = policies.reduce((sum, p) => {
    return sum + (p.claims?.filter(c => c.status === 'Pending').length || 0);
  }, 0);

  // --- Handlers ---
  const handleAddPolicy = (newPolicyData: Omit<Policy, 'id' | 'status' | 'claims'>) => {
    const policyToAdd: Policy = {
      ...newPolicyData,
      id: `POL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: getPolicyStatus(newPolicyData.validityDate),
      claims: []
    };

    const updatedPolicies = [policyToAdd, ...policies];
    setPolicies(updatedPolicies);
    
    if (user?.email) {
      const storageKey = `apexCare_insurance_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedPolicies));
    }
    
    setIsAddModalOpen(false);
    setNotification('Policy Registered Successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenDetails = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsDetailsModalOpen(true);
  };

  const handleAddClaimToPolicy = (policyId: string, claimData: Omit<Claim, 'id' | 'date' | 'status'>) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    const newClaim: Claim = {
      id: `CLM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: formattedDate,
      amount: claimData.amount,
      description: claimData.description || '',
      status: 'Pending'
    };

    const updatedPolicies = policies.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          claims: [newClaim, ...(p.claims || [])]
        };
      }
      return p;
    });

    setPolicies(updatedPolicies);
    
    if (user?.email) {
      const storageKey = `apexCare_insurance_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedPolicies));
    }
    
    // Update selected policy to show new claim in modal immediately
    const updatedSelected = updatedPolicies.find(p => p.id === policyId);
    if (updatedSelected) setSelectedPolicy(updatedSelected);

    setNotification('Claim Request Filed Successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-10 pb-12 relative transition-all duration-500">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-8 right-8 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-4 duration-300 font-black uppercase tracking-widest text-[10px]">
          {notification}
        </div>
      )}

      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Policies & Coverage</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage your active health coverage and claims dynamically.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="shadow-xl shadow-blue-100 py-6 px-10 rounded-[1.5rem] font-black uppercase tracking-widest text-xs">
          Register New Policy
        </Button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Policies', value: activeCount, icon: '🛡️', color: 'bg-blue-50 text-blue-600' },
          { label: 'Current Coverage', value: `$${totalCoverage.toLocaleString()}`, icon: '💰', color: 'bg-green-50 text-green-600' },
          { label: 'Pending Claims', value: totalPendingClaims, icon: '📄', color: 'bg-amber-50 text-amber-600' },
        ].map((stat, idx) => (
          <Card key={idx} className="border-2 border-slate-50 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center space-x-4">
              <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-white`}>{stat.icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                {loading ? <div className="h-6 w-24 bg-slate-100 animate-pulse rounded-lg"></div> : <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {error ? (
        <div className="py-24 text-center bg-red-50 rounded-[3rem] border-4 border-dashed border-red-100 max-w-2xl mx-auto">
          <p className="text-red-500 font-black mb-6 uppercase tracking-widest text-sm">{error}</p>
          <Button onClick={fetchData} className="bg-red-500 hover:bg-red-600">Try Connecting Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          <div className="xl:col-span-3 space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Your Registered Policies</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <div key={i} className="h-44 bg-white rounded-[2.5rem] border-2 border-slate-50 animate-pulse"></div>)}
              </div>
            ) : policies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((p) => {
                  const status = getPolicyStatus(p.validityDate);
                  return (
                    <Card key={p.id} className="group hover:border-blue-100 hover:shadow-2xl transition-all duration-500 relative border-2 border-slate-50 p-8 rounded-[2.5rem] overflow-visible">
                      <div className={`absolute top-6 right-6 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl shadow-lg border-2 border-white ${
                        status === 'Active' ? 'bg-green-500 text-white shadow-green-100' : 
                        status === 'Expiring Soon' ? 'bg-amber-500 text-white shadow-amber-100' : 'bg-red-500 text-white shadow-red-100'
                      }`}>
                        {status}
                      </div>
                      <div className="mb-6">
                        <h4 className="font-extrabold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.provider}</h4>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">ID: {p.policyNumber}</p>
                      </div>
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border-2 border-white">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Coverage</span>
                          <span className="font-black text-slate-800 tracking-tight text-sm">${p.coverageAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center px-4">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Valid Until</span>
                          <span className="text-[10px] font-bold text-slate-500">
                             {new Date(p.validityDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" fullWidth onClick={() => handleOpenDetails(p)} className="font-black tracking-widest uppercase text-[10px] border-2 py-4">View Records</Button>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🛡️</div>
                <p className="text-slate-400 font-black text-sm mb-6 uppercase tracking-widest">No insurance policies found in our system</p>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-slate-900 border-0 py-4 px-8 shadow-xl">Register your first policy</Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">General Activity</h2>
            <Card className="p-0 overflow-hidden border-2 border-slate-50 shadow-sm rounded-[2.5rem]">
              <div className="p-10 text-center bg-slate-50/20">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">View individual policies to manage specific claims and history.</p>
              </div>
            </Card>
          </div>
        </div>
      )}

      <AddPolicyModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddPolicy} 
      />

      <PolicyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        policy={selectedPolicy}
        onAddClaim={handleAddClaimToPolicy}
      />
    </div>
  );
}
