import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthDivider from '../../components/auth/AuthDivider';
import AuthToast from '../../components/auth/AuthToast';
import SocialButton from '../../components/auth/SocialButton';
import {
  EyeIcon,
  EyeOffIcon,
  GithubIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
} from '../../components/auth/AuthIcons';

const UserLogin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const nextErrors = {};

    if (!email) nextErrors.email = 'Email is required.';
    if (!password) nextErrors.password = 'Password is required.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      setToast({ type: 'success', message: 'Welcome back! Redirecting you now.' });
      navigate("/home"); // Redirect to home after login
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: 'Login failed. Check your credentials and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthToast toast={toast} onDismiss={() => setToast(null)} />
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <AuthCard>
          <div className="space-y-6">
            <header className="space-y-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Zomato Reels</p>
              <h1 id="user-login-title" className="text-3xl font-semibold text-slate-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Sign in to continue your food discovery journey.
              </p>
            </header>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <AuthInput
                id="email"
                name="email"
                type="email"
                label="Email address"
                autoComplete="email"
                icon={<MailIcon className="h-5 w-5" />}
                error={errors.email}
              />
              <AuthInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                autoComplete="current-password"
                icon={<LockIcon className="h-5 w-5" />}
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-full p-1 text-slate-400 transition hover:text-indigo-400"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                }
              />

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-slate-500 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-400"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-indigo-500 hover:text-indigo-400">
                  Forgot password?
                </Link>
              </div>

              <AuthButton type="submit" isLoading={isSubmitting}>
                Sign In
              </AuthButton>
            </form>

            <AuthDivider />

            <div className="grid gap-3 sm:grid-cols-2">
              <SocialButton icon={<GoogleIcon className="h-4 w-4 text-rose-500" />}>Google</SocialButton>
              <SocialButton icon={<GithubIcon className="h-4 w-4 text-slate-900 dark:text-white" />}>
                GitHub
              </SocialButton>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-300">
              New here?{' '}
              <Link to="/user/register" className="font-semibold text-indigo-500 hover:text-indigo-400">
                Create account
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;
