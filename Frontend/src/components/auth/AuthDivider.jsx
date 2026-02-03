import React from 'react'

const AuthDivider = ({ label = 'or continue with' }) => {
  return (
    <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
      <span className="h-px flex-1 bg-slate-200/70 dark:bg-slate-700/70" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-slate-200/70 dark:bg-slate-700/70" />
    </div>
  )
}

export default AuthDivider
