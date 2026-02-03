import React from 'react';
import { motion } from 'framer-motion';

const baseStyles =
  'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-slate-950';

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
  secondary:
    'border border-slate-200/70 bg-white/70 text-slate-900 hover:border-slate-300 hover:bg-white dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-500',
  ghost:
    'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
};

const AuthButton = ({ as, children, variant = 'primary', isLoading = false, disabled, ...props }) => {
  const MotionComponent = as ? motion(as) : motion.button;
  const isDisabled = isLoading || disabled;
  const sharedProps = as
    ? {
        'aria-disabled': isDisabled,
        tabIndex: isDisabled ? -1 : props.tabIndex
      }
    : { disabled: isDisabled };

  return (
    <MotionComponent
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]}`}
      {...props}
      {...sharedProps}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
      ) : null}
      {children}
    </MotionComponent>
  );
};

export default AuthButton;
