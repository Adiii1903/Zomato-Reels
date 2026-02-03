import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';

const ChooseRegister = () => {
  return (
    <AuthLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <AuthCard>
          <div className="space-y-8 text-center">
            <header className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Get started</p>
              <h1 id="choose-register-title" className="text-3xl font-semibold text-slate-900 dark:text-white">
                Create your account
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Choose how you want to join our platform.
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/user/register"
                className="flex h-14 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200/80 hover:text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200"
              >
                Register as User
              </Link>
              <Link
                to="/food-partner/register"
                className="flex h-14 items-center justify-center rounded-2xl border border-slate-200/70 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90"
              >
                Register as Food Partner
              </Link>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-300">
              Already have an account?{' '}
              <Link to="/user/login" className="font-semibold text-indigo-500 hover:text-indigo-400">
                Sign in
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default ChooseRegister;
