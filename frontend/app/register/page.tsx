"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/InputCard';
import EmailInput from '@/components/ui/EmailInput';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';

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
  const router = useRouter();

  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validations = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const strengthScore = Object.values(validations).filter(Boolean).length;
  const isPasswordValid = strengthScore === 5;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Legal first name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Registered email is required';
    }

    if (!isPasswordValid) {
      newErrors.password = 'Password does not meet all requirements';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match exactly';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === 'firstName' || name === 'lastName') {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name] && name !== 'email') {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef?: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else if (isFormValid) {
        handleSubmit(e as any);
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
      } else {
        router.push('/login?registered=true');
      }
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = formData.firstName.trim().length > 0 && 
                      isEmailValid && 
                      isPasswordValid && 
                      formData.password === formData.confirmPassword && 
                      isTermsAgreed;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <Logo isLink={false} className="mb-4 transform scale-110" />
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Join ApexCare to manage your healthcare journey
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
                onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
                error={errors.firstName}
                isValid={formData.firstName.trim().length > 0 && !errors.firstName}
                required
              />
              <Input
                ref={lastNameRef}
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                error={errors.lastName}
                isValid={formData.lastName.trim().length > 0 && !errors.lastName}
              />
            </div>
            <EmailInput
              ref={emailRef}
              label="Email Address"
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              error={errors.email}
              required
            />
            <div>
              <Input
                ref={passwordRef}
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
                error={errors.password}
                isValid={isPasswordValid && !errors.password}
                required
              />
              {formData.password && (
                <div className="space-y-2 mt-3 px-1">
                  <div className="flex space-x-1 h-1.5">
                    <div className={`flex-1 rounded-full transition-colors ${strengthScore > 0 ? (strengthScore < 3 ? 'bg-red-500' : strengthScore < 5 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-slate-200'}`}></div>
                    <div className={`flex-1 rounded-full transition-colors ${strengthScore > 2 ? (strengthScore < 5 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-slate-200'}`}></div>
                    <div className={`flex-1 rounded-full transition-colors ${strengthScore === 5 ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-2">
                    <div className={`flex items-center space-x-1 ${validations.length ? 'text-green-600 font-bold' : ''}`}>
                      <span>{validations.length ? '✔' : '❌'}</span><span>Min 8 characters</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${validations.uppercase ? 'text-green-600 font-bold' : ''}`}>
                      <span>{validations.uppercase ? '✔' : '❌'}</span><span>1 uppercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${validations.lowercase ? 'text-green-600 font-bold' : ''}`}>
                      <span>{validations.lowercase ? '✔' : '❌'}</span><span>1 lowercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${validations.number ? 'text-green-600 font-bold' : ''}`}>
                      <span>{validations.number ? '✔' : '❌'}</span><span>1 number</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${validations.special ? 'text-green-600 font-bold' : ''}`}>
                      <span>{validations.special ? '✔' : '❌'}</span><span>1 special char</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Input
                ref={confirmPasswordRef}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e)}
                error={errors.confirmPassword}
                isValid={formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password && !errors.confirmPassword}
                required
              />
              {formData.confirmPassword.length > 0 && (
                <div className={`mt-2 text-xs font-semibold px-1 ${formData.confirmPassword === formData.password ? 'text-green-600' : 'text-red-500'}`}>
                  {formData.confirmPassword === formData.password ? '✅ Passwords match' : '❌ Passwords do not match'}
                </div>
              )}
            </div>
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
