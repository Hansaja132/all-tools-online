'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginInput, AuthResponse } from '@tools-website/shared-types';
import { Button, Input, Card } from '@tools-website/ui';
import { useAuthStore } from '../../../lib/store/auth-store';
import { axiosClient } from '../../../lib/api/axios-client';

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post<AuthResponse>('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      window.location.href = '/profile';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card className="p-8 shadow-xl">
        <h2 className="text-2xl font-black text-center text-zinc-900 dark:text-white">Welcome Back</h2>
        <p className="text-sm text-center text-zinc-500 mt-1.5 mb-6">Sign in to sync favorites and preferences</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400">
              Forgot Password?
            </a>
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <a href="/register" className="font-bold text-violet-600 hover:underline dark:text-violet-400">
            Register here
          </a>
        </div>
      </Card>
    </div>
  );
}
