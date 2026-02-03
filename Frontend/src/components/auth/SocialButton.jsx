import React from 'react'
import { motion } from 'framer-motion'

const SocialButton = ({ icon, children, ...props }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200/80 hover:text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-indigo-400/40"
      {...props}
    >
      <span className="h-4 w-4">{icon}</span>
      {children}
    </motion.button>
  )
}

export default SocialButton
