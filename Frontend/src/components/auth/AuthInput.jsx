import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const AuthInput = ({
  id,
  name,
  type = 'text',
  label,
  icon,
  error,
  rightElement,
  autoComplete,
}) => {
  return (
    <motion.div className="space-y-2" whileFocusWithin={{ scale: 1.01 }}>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          placeholder=" "
          autoComplete={autoComplete}
          className={`peer h-14 w-full rounded-2xl border border-slate-200/70 bg-white/80 pl-11 pr-12 text-sm text-slate-900 shadow-sm shadow-slate-900/5 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-indigo-300 dark:focus:ring-indigo-500/30 ${
            error ? 'border-rose-400/70 focus:border-rose-400 focus:ring-rose-200' : ''
          }`}
        />
        <label
          htmlFor={id}
          className="absolute left-11 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-[11px] peer-focus:text-indigo-500 dark:text-slate-400 dark:peer-focus:text-indigo-300"
        >
          {label}
        </label>
        {rightElement ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</span>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            className="text-xs font-medium text-rose-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

export default AuthInput
