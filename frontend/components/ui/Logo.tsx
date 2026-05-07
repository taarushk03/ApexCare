import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  isLink?: boolean;
  hideText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', isLink = true, hideText = false }) => {
  const content = (
    <div className={`flex items-center space-x-3 group ${className}`}>
      <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-50 flex items-center justify-center flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </div>
      <div className={`flex flex-col text-left transition-all duration-300 origin-left ${hideText ? 'opacity-0 scale-95 w-0 invisible overflow-hidden' : 'opacity-100 scale-100 pt-1.5'}`}>
        <span className="text-2xl font-black text-slate-900 tracking-tightest group-hover:tracking-tight transition-all whitespace-nowrap">
          Apex<span className="text-blue-600">Care</span>
        </span>
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-0.5 leading-none whitespace-nowrap">
          Smart Digital Healthcare
        </span>
      </div>
    </div>
  );

  if (isLink) {
    return <Link href="/dashboard">{content}</Link>;
  }
  return content;
};

export default Logo;
