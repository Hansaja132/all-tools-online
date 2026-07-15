'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema, ForgotPasswordInput } from '@tools-website/shared-types';
import { Button, Input, Card } from '@tools-website/ui';
import { axiosClient } from '../../../lib/api/axios-client';

export default function ForgotPasswordPage() {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Request failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card className="p-8 shadow-xl">
        <h2 className="text-2xl font-black text-center text-zinc-900 dark:text-white">Reset Password</h2>
        <p className="text-sm text-center text-zinc-500 mt-1.5 mb-6">Enter email to receive reset instructions</p>

        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700 dark:bg-green-950/20 dark:text-green-400">
            If this email is registered, we have sent a reset password link to your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}

            <Input
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-zinc-500">
          Remember credentials?{' '}
          <a href="/login" className="font-bold text-violet-600 hover:underline dark:text-violet-400">
            Sign in
          </a>
        </div>
      </Card>
    </div>
  );
}
