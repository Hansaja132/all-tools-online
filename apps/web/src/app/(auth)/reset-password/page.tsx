'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, ResetPasswordInput } from '@tools-website/shared-types';
import { Button, Input, Card } from '@tools-website/ui';
import { axiosClient } from '../../../lib/api/axios-client';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
      password: '',
    },
  });

  React.useEffect(() => {
    if (token) {
      setValue('token', token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post('/auth/reset-password', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed. Try requesting a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card className="p-8 shadow-xl">
        <h2 className="text-2xl font-black text-center text-zinc-900 dark:text-white">Create New Password</h2>
        <p className="text-sm text-center text-zinc-500 mt-1.5 mb-6">Type a secure password for your account</p>

        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-700 dark:bg-green-950/20 dark:text-green-400">
            Password updated successfully. You can now{' '}
            <a href="/login" className="font-bold underline">
              login here
            </a>
            .
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}

            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <input type="hidden" {...register('token')} />

            {!token && (
              <div className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-950/10 p-2.5 rounded-lg">
                Warning: Missing reset token in URL parameters. Please check your email.
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={loading} disabled={!token}>
              Reset Password
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
