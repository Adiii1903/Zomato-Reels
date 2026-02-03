import React from 'react';

const AuthLayout = ({ children }) => (
  <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div className="absolute inset-0 bg-grid opacity-60 dark:bg-grid-dark dark:opacity-30" />
    <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-indigo-400/25 blur-3xl animate-float-slow dark:bg-indigo-500/20" />
    <div className="absolute right-[-140px] top-32 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-float dark:bg-purple-500/20" />
    <div className="absolute bottom-[-160px] left-1/3 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-pulse-soft dark:bg-blue-500/20" />
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
      {children}
    </div>
  </div>
);

export default AuthLayout;
