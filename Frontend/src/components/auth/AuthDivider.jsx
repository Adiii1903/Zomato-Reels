import React from 'react';

const AuthDivider = ({ label = 'or continue with' }) => (
  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
    <span className="h-px flex-1 bg-slate-200/80 dark:bg-slate-700/70" />
    <span className="text-[0.65rem] font-semibold">{label}</span>
    <span className="h-px flex-1 bg-slate-200/80 dark:bg-slate-700/70" />
  </div>
);

export default AuthDivider;
