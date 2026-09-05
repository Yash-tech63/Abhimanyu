import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-2`}>
      <svg viewBox="0 0 50 50" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Red Pulse Line */}
        <path 
          d="M5 25H15L18 10L25 40L32 20L35 25H45" 
          stroke="#ef4444" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Blue Plus Icon - Offset to the right slightly */}
        <path 
          d="M38 8V18M33 13H43" 
          stroke="#2f80ed" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Logo;
