import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthDivider from '../../components/auth/AuthDivider';
import AuthToast from '../../components/auth/AuthToast';
import SocialButton from '../../components/auth/SocialButton';
import {
  BuildingIcon,
  EyeIcon,
  EyeOffIcon,
  GithubIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '../../components/auth/AuthIcons';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
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

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/food-partner/register`,
        {
          name: businessName,
          contactName,
          phone,
          email,
          password,
          address,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      setToast({ type: 'success', message: 'Partner account created! Redirecting you now.' });
      navigate("/create-food"); // Redirect to create food page after successful registration
    } catch (error) {
      console.error("There was an error registering!", error);
      setToast({ type: 'error', message: 'Registration failed. Please try again.' });
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Partner Onboarding</p>
              <h1 id="partner-register-title" className="text-3xl font-semibold text-slate-900 dark:text-white">
                Partner sign up
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Grow your business with curated visibility and loyal customers.
              </p>
            </header>

            <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
              <Link to="/user/register" className="hover:text-indigo-400">
                User
              </Link>
              <span className="h-3 w-px bg-slate-300/70 dark:bg-slate-600" />
              <span className="text-indigo-500">Food partner</span>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <AuthInput
                id="businessName"
                name="businessName"
                label="Business name"
                autoComplete="organization"
                icon={<BuildingIcon className="h-5 w-5" />}
                error={errors.businessName}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthInput
                  id="contactName"
                  name="contactName"
                  label="Contact name"
                  autoComplete="name"
                  icon={<UserIcon className="h-5 w-5" />}
                  error={errors.contactName}
                />
                <AuthInput
                  id="phone"
                  name="phone"
                  label="Phone number"
                  autoComplete="tel"
                  icon={<PhoneIcon className="h-5 w-5" />}
                  error={errors.phone}
                />
              </div>
              <AuthInput
                id="email"
                name="email"
                type="email"
                label="Business email"
                autoComplete="email"
                icon={<MailIcon className="h-5 w-5" />}
                error={errors.email}
              />
              <AuthInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Create password"
                autoComplete="new-password"
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
              <AuthInput
                id="address"
                name="address"
                label="Business address"
                autoComplete="street-address"
                icon={<MapPinIcon className="h-5 w-5" />}
                error={errors.address}
              />
              <p className="text-xs text-slate-400">
                Full address helps customers find you faster.
              </p>

              <AuthButton type="submit" isLoading={isSubmitting}>
                Create partner account
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
              Already a partner?{' '}
              <Link to="/food-partner/login" className="font-semibold text-indigo-500 hover:text-indigo-400">
                Sign in
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
};

export default FoodPartnerRegister;
