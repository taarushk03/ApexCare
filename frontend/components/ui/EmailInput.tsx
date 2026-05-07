import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { Input, InputProps } from './InputCard';

interface EmailInputProps extends Omit<InputProps, 'onChange'> {
  label?: string;
  onValidationChange?: (isValid: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(({
  label = "Email Address",
  onValidationChange,
  onChange,
  value,
  className = "",
  error: propError,
  ...props
}, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const email = isControlled ? (value as string) : internalValue;
  
  type EmailStatus = 'valid' | 'invalid' | 'empty';
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('empty');

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      setEmailStatus('empty');
      if (onValidationChange) onValidationChange(false);
      return;
    }
    
    // Validate email layout
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(val)) {
      setEmailStatus('valid');
      if (onValidationChange) onValidationChange(true);
    } else {
      setEmailStatus('invalid');
      if (onValidationChange) onValidationChange(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    if (onChange) {
      onChange(e);
    }
    // Realtime while typing validation
    validateEmail(val);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateEmail(e.target.value);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const getErrorString = () => propError || (emailStatus === 'invalid' ? 'Please enter a valid email address' : '');
  const getSuccessString = () => !propError && emailStatus === 'valid' ? 'Valid email' : '';

  return (
    <Input
      {...props}
      ref={ref}
      type="email"
      label={label}
      value={email}
      onChange={handleChange}
      onBlur={handleBlur}
      error={getErrorString()}
      success={getSuccessString()}
      isValid={!propError && emailStatus === 'valid'}
      className={className}
    />
  );
});

EmailInput.displayName = 'EmailInput';

export default EmailInput;
