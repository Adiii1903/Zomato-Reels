import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthToast from '../../components/auth/AuthToast';
import AuthDivider from '../../components/auth/AuthDivider';
import { EyeIcon, EyeOffIcon, GoogleIcon, LockIcon, MailIcon } from '../../components/auth/AuthIcons';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const socialButtons = useMemo(
    () => [
      { label: 'Google', icon: GoogleIcon }
    ],
    []
  );

  const showToast = (payload) => {
    setToast(payload);
    window.setTimeout(() => setToast(null), 2800);
  };

  const handleSocialLogin = (provider) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    if (!baseUrl) {
      showToast({ type: 'error', message: `Unable to start ${provider} login. Try again later.` });
      return;
    }
    window.location.href = `${baseUrl}/api/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const nextErrors = {};
    if (!email) nextErrors.email = 'Email is required.';
    if (!password) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast({ type: 'error', message: 'Please enter your partner credentials.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);
      showToast({ type: 'success', message: 'Welcome back, partner! Loading your dashboard.' });
      window.setTimeout(() => navigate('/create-food'), 450);
    } catch (error) {
      console.error('Partner login failed', error);
      showToast({ type: 'error', message: 'Unable to sign in. Please check your details.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthToast toast={toast} />
      <AuthCard>
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500/80">Partner login</p>
          <h1 id="partner-login-title" className="text-2xl font-semibold text-slate-900 dark:text-white">
            Access your partner workspace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Manage menus, orders, and growth insights in one place.
          </p>
        </header>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Business email"
            autoComplete="email"
            icon={MailIcon}
            error={errors.email}
          />
          <AuthInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            autoComplete="current-password"
            icon={LockIcon}
            error={errors.password}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-full p-1 text-slate-400 transition hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-sm text-slate-500">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-400 dark:border-slate-600"
              />
              Remember me
            </label>
            <Link className="font-medium text-indigo-500 hover:text-indigo-400" to="#">
              Forgot password?
            </Link>
          </div>

          <AuthButton type="submit" isLoading={isSubmitting}>
            {isSubmitting ? 'Signing in' : 'Sign in'}
          </AuthButton>
        </form>

        <div className="mt-6 space-y-4">
          <AuthDivider />
          <div className="grid gap-3">
            {socialButtons.map(({ label, icon: Icon }) => (
              <AuthButton
                key={label}
                type="button"
                variant="secondary"
                onClick={() => handleSocialLogin(label.toLowerCase())}
              >
                <Icon className="h-5 w-5" />
                {label}
              </AuthButton>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          New partner?{' '}
          <Link className="font-semibold text-indigo-500 hover:text-indigo-400" to="/food-partner/register">
            Create an account
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default FoodPartnerLogin;
