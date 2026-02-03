import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthToast from '../../components/auth/AuthToast';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from '../../components/auth/AuthIcons';

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (payload) => {
    setToast(payload);
    window.setTimeout(() => setToast(null), 2800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const nextErrors = {};
    if (!firstName) nextErrors.firstName = 'First name is required.';
    if (!lastName) nextErrors.lastName = 'Last name is required.';
    if (!email) nextErrors.email = 'Email is required.';
    if (!password) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/user/register`,
        {
          fullName: `${firstName} ${lastName}`.trim(),
          email,
          password
        },
        {
          withCredentials: true
        }
      );

      console.log(response.data);
      showToast({ type: 'success', message: 'Account created! Taking you home.' });
      window.setTimeout(() => navigate('/home'), 500);
    } catch (error) {
      console.error('Registration failed', error);
      showToast({ type: 'error', message: 'Unable to create account. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthToast toast={toast} />
      <AuthCard>
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500/80">Create account</p>
          <h1 id="user-register-title" className="text-2xl font-semibold text-slate-900 dark:text-white">
            Join Zomato Reels today
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Discover flavors, save reels, and build your food playlist.
          </p>
        </header>

        <nav className="mt-6 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Switch:</span>{' '}
          <Link className="font-semibold text-indigo-500 hover:text-indigo-400" to="/user/register">
            User
          </Link>{' '}
          •{' '}
          <Link className="font-semibold text-slate-500 hover:text-indigo-400" to="/food-partner/register">
            Food partner
          </Link>
        </nav>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthInput
              id="firstName"
              name="firstName"
              label="First name"
              autoComplete="given-name"
              icon={UserIcon}
              error={errors.firstName}
            />
            <AuthInput
              id="lastName"
              name="lastName"
              label="Last name"
              autoComplete="family-name"
              icon={UserIcon}
              error={errors.lastName}
            />
          </div>
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            icon={MailIcon}
            error={errors.email}
          />
          <AuthInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            autoComplete="new-password"
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
          <AuthButton type="submit" isLoading={isSubmitting}>
            {isSubmitting ? 'Creating account' : 'Create account'}
          </AuthButton>
        </form>

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

export default UserRegister;
