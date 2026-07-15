'use client';

import * as React from 'react';
import { Button, Input, Card } from '@tools-website/ui';
import { useAuthStore } from '../../lib/store/auth-store';
import { axiosClient } from '../../lib/api/axios-client';

export default function ProfilePage() {
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const [profileName, setProfileName] = React.useState('');
  const [profileAvatar, setProfileAvatar] = React.useState('');
  const [passwordCurrent, setPasswordCurrent] = React.useState('');
  const [passwordNew, setPasswordNew] = React.useState('');
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [loadingPassword, setLoadingPassword] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileAvatar(user.avatar || '');
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-zinc-500 mt-2">Please login to view your profile settings.</p>
        <a href="/login" className="mt-4 inline-block">
          <Button>Go to Login</Button>
        </a>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await axiosClient.patch('/users/profile', {
        name: profileName,
        avatar: profileAvatar,
      });
      // Sync local state
      const token = localStorage.getItem('access_token') || '';
      setAuth(response.data, token);
      setMessage({ type: 'success', text: 'Profile details updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    setMessage({ type: '', text: '' });
    try {
      await axiosClient.post('/users/change-password', {
        currentPassword: passwordCurrent,
        newPassword: passwordNew,
      });
      setPasswordCurrent('');
      setPasswordNew('');
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-6">Account Settings</h1>

      {message.text && (
        <div className={`mb-6 rounded-lg p-4 text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
            : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Edit Profile Info</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Your Name"
            />
            <Input
              label="Avatar Image URL"
              value={profileAvatar}
              onChange={(e) => setProfileAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <Button type="submit" isLoading={loadingProfile}>
              Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Password Card */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={passwordCurrent}
              onChange={(e) => setPasswordCurrent(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              type="password"
              label="New Password"
              value={passwordNew}
              onChange={(e) => setPasswordNew(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" isLoading={loadingPassword}>
              Change Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
