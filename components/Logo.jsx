import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-1.5 overflow-hidden shrink-0 transition-transform duration-300`}>
      <img
        src="/abhimanyu_logo.png"
        alt="Abhimanyu Healthcare Assistant Logo"
        className="w-full h-full object-contain scale-110"
      />
    </div>
  );
};

export default Logo;
