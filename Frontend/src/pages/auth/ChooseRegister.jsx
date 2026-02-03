import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthButton from '../../components/auth/AuthButton';

const ChooseRegister = () => {
  return (
    <AuthLayout>
      <AuthCard>
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500/80">Get started</p>
          <h1 id="choose-register-title" className="text-2xl font-semibold text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Choose how you want to join the Zomato Reels platform.
          </p>
        </header>

        <div className="mt-8 space-y-4">
          <AuthButton as={Link} to="/user/register">
            Register as User
          </AuthButton>
          <AuthButton as={Link} to="/food-partner/register" variant="secondary">
            Register as Food Partner
          </AuthButton>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link className="font-semibold text-indigo-500 hover:text-indigo-400" to="/user/login">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default ChooseRegister;
