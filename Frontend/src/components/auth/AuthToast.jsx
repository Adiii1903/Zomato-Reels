import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const toastStyles = {
  success: 'border-emerald-400/40 bg-emerald-500/90 text-white',
  error: 'border-rose-400/40 bg-rose-500/90 text-white',
}

const AuthToast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => onDismiss?.(), 3200)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          className={`fixed right-6 top-6 z-50 flex min-w-[240px] items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg shadow-slate-900/20 backdrop-blur ${
            toastStyles[toast.type] || toastStyles.success
          }`}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
        >
          <span>{toast.message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default AuthToast
