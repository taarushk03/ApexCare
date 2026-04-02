"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/InputCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AICheckPage() {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    // Simulate AI analysis time
    setTimeout(() => {
      router.push('/consultation');
    }, 2500);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-5 bg-teal-500 rounded-3xl mb-8 shadow-2xl shadow-teal-100 border-4 border-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v10"/><path d="M18.4 6.9c.8.8 1.3 1.9 1.5 3.1.2 1.1 0 2.2-.4 3.1a6.4 6.4 0 0 1-5.3 4.4 6.4 6.4 0 0 1-5.3-4.4c-.4-.9-.6-2-.4-3.1.2-1.2.7-2.3 1.5-3.1"/><path d="m9 15 3-3 3 3"/>
              </svg>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tightest">AI Symptom Checker</h1>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto font-medium">
              Describe your symptoms with as much detail as possible for a more accurate preliminary analysis.
            </p>
          </div>

          <Card className="shadow-2xl border-t-8 border-t-teal-500 overflow-visible">
            <form onSubmit={handleAnalyze} className="space-y-8">
              <div>
                <label htmlFor="symptoms" className="flex items-center space-x-2 text-xl font-bold text-slate-800 mb-4 px-2 border-l-4 border-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="m21 11-8-8L5 11l8 8 8-8Z"/><path d="M13 10V6"/><path d="M13 14v-4l-4 4"/></svg>
                  <span>Describe your state</span>
                </label>
                <textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSymptoms(e.target.value)}
                  placeholder="Example: I've been experiencing a sharp pain in my lower back for the past 12 hours..."
                  className="w-full h-48 px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition-all duration-300 resize-none font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-5 rounded-2xl flex items-start space-x-3 border-2 border-blue-100/50 hover:border-blue-200 transition-colors">
                  <input type="checkbox" className="mt-1.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                  <div>
                    <p className="text-sm font-black text-blue-800 uppercase tracking-wide">Fever</p>
                    <p className="text-xs text-blue-600 font-medium">Temperature above 99°F</p>
                  </div>
                </div>
                <div className="bg-amber-50/50 p-5 rounded-2xl flex items-start space-x-3 border-2 border-amber-100/50 hover:border-amber-200 transition-colors">
                  <input type="checkbox" className="mt-1.5 h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded" />
                  <div>
                    <p className="text-sm font-black text-amber-800 uppercase tracking-wide">Shortness of Breath</p>
                    <p className="text-xs text-amber-600 font-medium">Difficulty breathing deeply</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                variant="secondary"
                disabled={isAnalyzing || !symptoms.trim()}
                className="py-5 text-xl font-black shadow-2xl shadow-teal-100 transform active:scale-[0.98] transition-all"
              >
                {isAnalyzing ? (
                  <span className="flex items-center space-x-4">
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Running Deep Analysis...</span>
                  </span>
                ) : (
                  'Begin Analysis'
                )}
              </Button>
            </form>
          </Card>

          <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 border-2 border-white shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-xl tracking-tight mb-2">Important Medical Disclaimer</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                The HealthSync Symptom Checker provides preliminary analysis only and is <strong>not a medical diagnosis</strong>. 
                Information provided should not be considered medical advice from a professional. 
                In case of a medical emergency, contact your local emergency services or visit the nearest healthcare facility immediately.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
