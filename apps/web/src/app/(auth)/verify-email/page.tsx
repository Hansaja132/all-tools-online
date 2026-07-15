'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button, LoadingSpinner } from '@tools-website/ui';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { axiosClient } from '../../../lib/api/axios-client';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token parameter.');
      return;
    }

    const verify = async () => {
      try {
        await axiosClient.post('/auth/verify-email', { token });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification token is invalid or expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card className="p-8 shadow-xl text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center py-6">
            <LoadingSpinner size="lg" className="mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Verifying your email...</h3>
            <p className="text-sm text-zinc-500 mt-1">Please wait while we confirm your credentials</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-6">
            <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Email Verified!</h3>
            <p className="text-sm text-zinc-500 mt-1 mb-6">Your email address has been successfully verified.</p>
            <a href="/login" className="w-full">
              <Button className="w-full">Login to your account</Button>
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-6">
            <AlertCircle className="h-14 w-14 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Verification Failed</h3>
            <p className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-950/10 p-2.5 rounded-lg mt-1 mb-6">
              {message}
            </p>
            <a href="/login" className="w-full">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}
