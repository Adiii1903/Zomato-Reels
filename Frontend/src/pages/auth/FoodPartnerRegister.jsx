import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthToast from '../../components/auth/AuthToast';
import { BuildingIcon, EyeIcon, EyeOffIcon, LocationIcon, LockIcon, MailIcon, PhoneIcon, UserIcon } from '../../components/auth/AuthIcons';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (payload) => {
    setToast(payload);
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value.trim();
    const contactName = e.target.contactName.value.trim();
    const phone = e.target.phone.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const address = e.target.address.value.trim();

    const nextErrors = {};
    if (!businessName) nextErrors.businessName = 'Business name is required.';
    if (!contactName) nextErrors.contactName = 'Contact name is required.';
    if (!phone) nextErrors.phone = 'Phone number is required.';
    if (!email) nextErrors.email = 'Email is required.';
    if (!password) nextErrors.password = 'Password is required.';
    if (!address) nextErrors.address = 'Address is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast({ type: 'error', message: 'Please complete every required field.' });
      return;
    }

    setIsSubmitting(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/register`,
        {
          name: businessName,
          contactName,
          phone,
          email,
          password,
          address
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        showToast({ type: 'success', message: 'Partner account created! Redirecting.' });
        window.setTimeout(() => navigate('/create-food'), 500);
      })
      .catch((error) => {
        console.error('There was an error registering!', error);
        showToast({ type: 'error', message: 'Registration failed. Try again shortly.' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <AuthLayout>
      <AuthToast toast={toast} />
      <AuthCard>
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500/80">Partner sign up</p>
          <h1 id="partner-register-title" className="text-2xl font-semibold text-slate-900 dark:text-white">
            Grow your business with Zomato Reels
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Reach new diners with a premium partner storefront.
          </p>
        </header>

        <nav className="mt-6 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Switch:</span>{' '}
          <Link className="font-semibold text-slate-500 hover:text-indigo-400" to="/user/register">
            User
          </Link>{' '}
          •{' '}
          <Link className="font-semibold text-indigo-500 hover:text-indigo-400" to="/food-partner/register">
            Food partner
          </Link>
        </nav>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <AuthInput
            id="businessName"
            name="businessName"
            label="Business name"
            autoComplete="organization"
            icon={BuildingIcon}
            error={errors.businessName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthInput
              id="contactName"
              name="contactName"
              label="Contact name"
              autoComplete="name"
              icon={UserIcon}
              error={errors.contactName}
            />
            <AuthInput
              id="phone"
              name="phone"
              label="Phone number"
              autoComplete="tel"
              icon={PhoneIcon}
              error={errors.phone}
            />
          </div>
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
            label="Create password"
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
          <AuthInput
            id="address"
            name="address"
            label="Business address"
            autoComplete="street-address"
            icon={LocationIcon}
            error={errors.address}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Full address helps customers find you faster.
          </p>
          <AuthButton type="submit" isLoading={isSubmitting}>
            {isSubmitting ? 'Creating account' : 'Create partner account'}
          </AuthButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already a partner?{' '}
          <Link className="font-semibold text-indigo-500 hover:text-indigo-400" to="/food-partner/login">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

export default FoodPartnerRegister;
