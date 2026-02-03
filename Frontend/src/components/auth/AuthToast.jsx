import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon, CheckCircleIcon } from './AuthIcons';

const styles = {
  success: {
    container:
      'border-emerald-200/60 bg-emerald-50/90 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-100',
    icon: 'text-emerald-500'
  },
  error: {
    container:
      'border-rose-200/70 bg-rose-50/90 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-100',
    icon: 'text-rose-500'
  }
};

const AuthToast = ({ toast }) => (
  <AnimatePresence>
    {toast ? (
      <motion.div
        className="fixed right-6 top-6 z-50"
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur ${
            styles[toast.type]?.container
          }`}
          role="status"
        >
          {toast.type === 'success' ? (
            <CheckCircleIcon className={`h-5 w-5 ${styles.success.icon}`} />
          ) : (
            <AlertTriangleIcon className={`h-5 w-5 ${styles.error.icon}`} />
          )}
          <div className="text-sm font-medium">{toast.message}</div>
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default AuthToast;
