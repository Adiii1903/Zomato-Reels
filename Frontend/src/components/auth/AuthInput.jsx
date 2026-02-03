import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const AuthInput = ({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  icon: Icon,
  rightSlot,
  error,
  placeholder = ' ',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <motion.div
        className="relative"
        animate={{ boxShadow: isFocused ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : '0 0 0 0 rgba(99, 102, 241, 0)' }}
        transition={{ duration: 0.2 }}
      >
        {Icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={Boolean(error)}
          className="peer w-full rounded-2xl border border-slate-200/70 bg-white/70 px-11 pb-2 pt-6 text-sm text-slate-900 outline-none transition focus:border-indigo-400/60 focus:bg-white focus:ring-2 focus:ring-indigo-200 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-indigo-400/60 dark:focus:bg-slate-900 dark:focus:ring-indigo-500/20"
          {...rest}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-500 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-slate-600 peer-[&:-webkit-autofill]:top-2 peer-[&:-webkit-autofill]:text-xs dark:text-slate-400 dark:peer-[&:not(:placeholder-shown)]:text-slate-300"
        >
          {label}
        </label>
        {rightSlot ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        ) : null}
      </motion.div>
      <AnimatePresence mode="popLayout">
        {error ? (
          <motion.p
            className="text-xs font-medium text-rose-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AuthInput;
