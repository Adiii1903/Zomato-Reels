import React from 'react';
import { motion } from 'framer-motion';

const AuthCard = ({ children }) => (
  <motion.section
    className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-card backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.section>
);

export default AuthCard;
