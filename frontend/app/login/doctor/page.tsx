"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/InputCard';
import EmailInput from '@/components/ui/EmailInput';
import { Logo } from '@/components/ui/Logo';

export default function DoctorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isEmailValid, setIsEmailValid] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Security password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Security password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormEmpty = !email.trim() || !password.trim();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => { const next = { ...prev }; delete next.email; return next; });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors(prev => { const next = { ...prev }; delete next.password; return next; });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef?: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else if (email.trim() && password.trim() && isEmailValid) {
        handleSubmit(e as any);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (!isEmailValid) return;
    
    if (validateForm()) {
      // Doctor login — check localStorage for doctor users
      const doctorsJson = localStorage.getItem('doctors');
      const doctors: { name: string; email: string; password: string }[] = doctorsJson ? JSON.parse(doctorsJson) : [];
      
      const foundDoctor = doctors.find(d => d.email === email);
      
      if (!foundDoctor) {
        setErrors({ email: 'Doctor account not found' });
        return;
      }
      
      if (foundDoctor.password !== password) {
        setErrors({ password: 'Invalid security password' });
        return;
      }

      const { password: _, ...doctorWithoutPassword } = foundDoctor;
      localStorage.setItem('currentDoctor', JSON.stringify(doctorWithoutPassword));
      localStorage.setItem('isDoctorAuthenticated', 'true');
      router.push('/doctor/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <Logo isLink={false} className="mb-4 transform scale-110" />
          <div className="flex items-center space-x-3 mt-4 mb-2">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/>
                <circle cx="20" cy="10" r="2"/>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Login</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage patients &amp; appointments
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <EmailInput
              label="Email Address"
              placeholder="doctor@hospital.com"
              value={email}
              onChange={handleEmailChange}
              onValidationChange={setIsEmailValid}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              error={errors.email}
              required
            />
            <Input
              ref={passwordRef}
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={(e) => handleKeyDown(e)}
              error={errors.password}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="doctor-remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
              />
              <label htmlFor="doctor-remember-me" className="ml-2 block text-sm text-slate-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                Forgot password?
              </a>
            </div>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            disabled={isFormEmpty}
            className={isFormEmpty ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Sign In as Doctor
          </Button>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-slate-500">
            Don&apos;t have a doctor account?{' '}
            <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-500">
              Contact administration
            </Link>
          </p>
          <p className="text-sm text-slate-400">
            Are you a patient?{' '}
            <Link href="/login/patient" className="font-semibold text-blue-600 hover:text-blue-500">
              Patient Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
