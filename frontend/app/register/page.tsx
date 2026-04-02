"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/InputCard';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Legal first name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Registered email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Strong password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match exactly';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    // Auto capitalization for name fields
    if (name === 'firstName' || name === 'lastName') {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const index = Array.from(form.elements).indexOf(e.currentTarget);
        const nextElement = form.elements[index + 1] as HTMLElement;
        if (nextElement && (nextElement.tagName === 'INPUT' || nextElement.tagName === 'BUTTON')) {
            nextElement.focus();
        } else if (isFormValid) {
            handleSubmit(e as any);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.password.trim() || !isTermsAgreed) return;

    if (validateForm()) {
      const result = register({ 
        name: `${formData.firstName} ${formData.lastName}`.trim(), 
        email: formData.email,
        password: formData.password
      });

      if (!result.success) {
        setErrors({ email: result.error || 'Registration failed' });
      }
    }
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const isFormValid = formData.firstName.trim().length > 0 && 
                      isEmailValid && 
                      formData.password.length >= 6 && 
                      formData.password === formData.confirmPassword && 
                      isTermsAgreed;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-teal-500 rounded-xl mb-4 shadow-lg shadow-teal-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Join HealthSync to manage your healthcare journey
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                error={errors.lastName}
              />
            </div>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              error={errors.password}
              required
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={isTermsAgreed}
                onChange={(e) => setIsTermsAgreed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-slate-700 cursor-pointer">
                I agree to the{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            disabled={!isFormValid}
            className={!isFormValid ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98] transition-transform'}
          >
            Get Started
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
