"use client";

import React from 'react';
import Navbar from '@/components/ui/Navbar';
import { Card } from '@/components/ui/InputCard';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-10 text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-100 ring-4 ring-white">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD'}
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tightest">Your Health Profile</h1>
            <p className="text-slate-500 font-medium">Manage your personal information and preferences.</p>
          </header>

          <Card title="Account Information" className="shadow-2xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                    <p className="font-bold text-slate-800 text-lg border-b-2 border-slate-50 pb-2">{user?.name || 'John Doe'}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-slate-800 text-lg border-b-2 border-slate-50 pb-2">{user?.email || 'john.doe@example.com'}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100/50 flex items-center space-x-4">
                 <div className="text-2xl">🚧</div>
                 <div>
                    <h4 className="font-black text-blue-900">Editing is coming soon</h4>
                    <p className="text-sm text-blue-600 font-medium leading-relaxed">We are currently finalising our secure identity verification system. You will be able to update your profile details shortly.</p>
                 </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                 <Button disabled fullWidth variant="outline">Reset Password</Button>
                 <Button disabled fullWidth>Save Changes</Button>
              </div>
            </div>
          </Card>

          <div className="mt-10">
             <Card title="Communication Preferences" className="opacity-60 grayscale cursor-not-allowed">
                <p className="text-slate-400 font-bold italic py-4">Coming soon with your HealthSync ID...</p>
             </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
