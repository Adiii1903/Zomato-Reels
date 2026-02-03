import React from 'react'
import { motion } from 'framer-motion'

const AuthCard = ({ children }) => {
  return (
    <motion.section
      className="glass-panel relative w-full max-w-lg rounded-3xl border border-white/40 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-slate-700/60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}

export default AuthCard
