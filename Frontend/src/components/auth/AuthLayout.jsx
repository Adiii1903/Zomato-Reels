import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-grid opacity-50 dark:opacity-30" />
      <div className="absolute -top-24 left-[-10%] h-72 w-72 animate-float rounded-full bg-gradient-to-br from-indigo-400/40 via-purple-400/30 to-sky-400/30 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-5%] h-80 w-80 animate-float rounded-full bg-gradient-to-br from-sky-400/30 via-indigo-500/20 to-purple-500/20 blur-3xl [animation-delay:2s]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/70 via-slate-50/40 to-slate-100/30 dark:from-slate-950/80 dark:via-slate-950/60 dark:to-slate-900/70" />
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  )
}

export default AuthLayout
