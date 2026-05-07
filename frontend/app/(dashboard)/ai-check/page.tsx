"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/InputCard';

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
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center justify-center p-6 bg-blue-600 rounded-[2rem] mb-10 shadow-2xl shadow-blue-100 border-4 border-white rotate-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v10"/><path d="M18.4 6.9c.8.8 1.3 1.9 1.5 3.1.2 1.1 0 2.2-.4 3.1a6.4 6.4 0 0 1-5.3 4.4 6.4 6.4 0 0 1-5.3-4.4c-.4-.9-.6-2-.4-3.1.2-1.2.7-2.3 1.5-3.1"/><path d="m9 15 3-3 3 3"/>
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tightest leading-tight">AI Symptom Checker</h1>
        <p className="text-slate-400 mt-4 text-lg max-w-xl mx-auto font-bold">
          Provide as much detail as possible for a better preliminary analysis of your health state.
        </p>
      </div>

      <Card className="p-10 shadow-2xl border-2 border-slate-50 rounded-[3rem] overflow-visible relative group">
        <div className="absolute -top-6 -left-6 bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-100 z-10 -rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21 11-8-8L5 11l8 8 8-8Z"/><path d="M13 10V6"/><path d="M13 14v-4l-4 4"/></svg>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-10">
          <div>
            <label htmlFor="symptoms" className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-4 mb-4">
              Describe your state
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSymptoms(e.target.value)}
              placeholder="I've been experiencing a sharp pain in my lower back for the past 12 hours..."
              className="w-full h-56 px-8 py-6 bg-slate-50 border-4 border-transparent rounded-[2rem] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none font-bold text-lg leading-relaxed shadow-inner"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
            {[
                { label: 'Feverish', sub: 'Body temp > 99°F', color: 'blue', icon: '🌡️' },
                { label: 'Difficulty Breathing', sub: 'Shortness of breath', color: 'amber', icon: '🫁' }
            ].map((item) => (
                <div key={item.label} className="bg-slate-50/50 p-6 rounded-[1.75rem] flex items-center space-x-4 border-2 border-slate-50 hover:border-blue-100 hover:bg-white transition-all group">
                  <div className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{item.sub}</p>
                  </div>
                  <input type="checkbox" className="h-6 w-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                </div>
            ))}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={isAnalyzing || !symptoms.trim()}
            className="py-10 text-xl font-black shadow-2xl shadow-blue-100 rounded-[2rem]"
          >
            {isAnalyzing ? (
              <span className="flex items-center space-x-6">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="tracking-widest uppercase">Deep Analysis...</span>
              </span>
            ) : (
              'Run Checker'
            )}
          </Button>
        </form>
      </Card>

      <div className="mt-20 bg-white rounded-[2.5rem] border-4 border-slate-50 p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="bg-amber-50 p-5 rounded-[1.5rem] text-amber-600 border-2 border-white shadow-xl rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
        </div>
        <div>
          <h3 className="font-black text-slate-800 text-xl tracking-tight mb-3">Medical Disclaimer</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-bold italic">
            This preliminary analysis is <strong>not a medical diagnosis</strong>. 
            Information provided should not be considered medical advice. 
            In case of emergency, contact your local emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
