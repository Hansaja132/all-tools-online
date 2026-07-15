'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, Sidebar, LoadingSpinner } from '@tools-website/ui';
import { useAuthStore } from '../../lib/store/auth-store';
import { axiosClient } from '../../lib/api/axios-client';
import { Users, FileCode, Eye, ShieldAlert, BarChart3, Settings } from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-zinc-500 mt-2">Admin credentials are required to access this dashboard.</p>
        <a href="/" className="mt-4 inline-block">
          <Button>Back to Home</Button>
        </a>
      </div>
    );
  }

  // Fetch admin statistics from express backend API
  const { data: stats, isLoading: statsLoading } = useQuery(['adminStats'], async () => {
    const res = await axiosClient.get('/admin/stats');
    return res.data;
  });

  // Fetch registered users list from express backend API
  const { data: users, isLoading: usersLoading } = useQuery(['adminUsers'], async () => {
    const res = await axiosClient.get('/admin/users');
    return res.data;
  });

  const sidebarItems = [
    { label: 'Overview', href: '/admin', icon: <BarChart3 className="h-5 w-5" />, active: true },
    { label: 'Users', href: '/admin', icon: <Users className="h-5 w-5" /> },
    { label: 'Tools Config', href: '/admin', icon: <FileCode className="h-5 w-5" /> },
    { label: 'System Settings', href: '/admin', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar Nav */}
      <Sidebar
        items={sidebarItems}
        header={
          <span className="text-lg font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
            Admin Suite
          </span>
        }
      />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Monitor site usage statistics and user directory</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
            Return to Site
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="flex items-center space-x-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-semibold uppercase">Total Users</p>
              <h3 className="text-2xl font-bold">{statsLoading ? '...' : stats?.users ?? 0}</h3>
            </div>
          </Card>

          <Card className="flex items-center space-x-4">
            <div className="rounded-lg bg-violet-50 dark:bg-violet-950/30 p-3 text-violet-600">
              <FileCode className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-semibold uppercase">Active Tools</p>
              <h3 className="text-2xl font-bold">{statsLoading ? '...' : stats?.tools ?? 8}</h3>
            </div>
          </Card>

          <Card className="flex items-center space-x-4">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-emerald-600">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-semibold uppercase">Page Views</p>
              <h3 className="text-2xl font-bold">{statsLoading ? '...' : stats?.views ?? 142}</h3>
            </div>
          </Card>

          <Card className="flex items-center space-x-4">
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-red-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-semibold uppercase">Alert Logs</p>
              <h3 className="text-2xl font-bold">{statsLoading ? '...' : stats?.likes ?? 0}</h3>
            </div>
          </Card>
        </div>

        {/* User Directory */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">User Directory</h2>

          {usersLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="md" />
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">OAuth Provider</th>
                    <th className="pb-3 font-semibold">Email Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {users.map((u: any) => (
                    <tr key={u.id} className="text-zinc-700 dark:text-zinc-300">
                      <td className="py-3.5 font-medium">{u.name}</td>
                      <td className="py-3.5">{u.email}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                          u.role === 'ADMIN'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5">{u.provider}</td>
                      <td className="py-3.5">
                        <span className={`text-xs font-bold ${u.emailVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {u.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-6">No users found.</p>
          )}
        </Card>
      </main>
    </div>
  );
}
