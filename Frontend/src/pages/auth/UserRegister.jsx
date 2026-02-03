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
    EyeIcon,
    EyeOffIcon,
    GithubIcon,
    GoogleIcon,
    LockIcon,
    MailIcon,
    UserIcon,
} from '../../components/auth/AuthIcons';

const UserRegister = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

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

        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/user/register`,
                {
                    fullName: `${firstName} ${lastName}`,
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log(response.data);
            setToast({ type: 'success', message: 'Account created! Welcome aboard.' });
            navigate("/home");
        } catch (error) {
            console.error(error);
            setToast({ type: 'error', message: 'Registration failed. Please review your details.' });
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
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Join Zomato Reels</p>
                            <h1 id="user-register-title" className="text-3xl font-semibold text-slate-900 dark:text-white">
                                Create your account
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-300">
                                Join to explore and enjoy delicious meals.
                            </p>
                        </header>

                        <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
                            <span className="text-indigo-500">User</span>
                            <span className="h-3 w-px bg-slate-300/70 dark:bg-slate-600" />
                            <Link to="/food-partner/register" className="hover:text-indigo-400">
                                Food partner
                            </Link>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <AuthInput
                                    id="firstName"
                                    name="firstName"
                                    label="First name"
                                    autoComplete="given-name"
                                    icon={<UserIcon className="h-5 w-5" />}
                                    error={errors.firstName}
                                />
                                <AuthInput
                                    id="lastName"
                                    name="lastName"
                                    label="Last name"
                                    autoComplete="family-name"
                                    icon={<UserIcon className="h-5 w-5" />}
                                    error={errors.lastName}
                                />
                            </div>
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

                            <AuthButton type="submit" isLoading={isSubmitting}>
                                Create account
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

export default UserRegister;
