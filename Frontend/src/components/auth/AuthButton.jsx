import React from 'react'
import { motion } from 'framer-motion'

const AuthButton = ({ children, isLoading, ...props }) => {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  )
}

export default AuthButton
