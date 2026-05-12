"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/InputCard';
import EmailInput from '@/components/ui/EmailInput';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';

export default function PatientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('registered') === 'true') {
        setSuccessMessage('Account created successfully. Please login.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

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
      const result = await login(email, password);
      if (!result.success) {
        if (result.error?.includes('found')) {
          setErrors({ email: result.error });
        } else {
          setErrors({ password: result.error });
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <Logo isLink={false} className="mb-4 transform scale-110" />
          <div className="flex items-center space-x-3 mt-4 mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Login</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to book appointments &amp; view your reports
          </p>
        </div>
        
        {successMessage && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <EmailInput
              label="Email Address"
              placeholder="john.doe@example.com"
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
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
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
            Sign In as Patient
          </Button>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
              Create an account
            </Link>
          </p>
          <p className="text-sm text-slate-400">
            Are you a doctor?{' '}
            <Link href="/login/doctor" className="font-semibold text-teal-600 hover:text-teal-500">
              Doctor Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
