'use client';

import * as React from 'react';
import { Menu, Search, User, LogOut, ChevronDown, Laptop, Sun, Moon } from 'lucide-react';
import { siteConfig } from '@tools-website/config';
import { Button, Dropdown, Drawer, ThemeToggle } from '@tools-website/ui';
import { useAuthStore } from '../lib/store/auth-store';
import { useThemeStore } from '../lib/store/theme-store';
import { useSearchStore } from '../lib/store/search-store';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { query, setQuery } = useSearchStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const categoryItems = siteConfig.categories.map((c) => ({
    label: c.name,
    href: `/${c.slug}`,
  }));

  const userDropdownItems = isAuthenticated
    ? [
        { label: 'My Profile', href: '/profile' },
        {
          label: 'Admin Dashboard',
          href: '/admin',
          // Only show if user role is ADMIN
          ...(user?.role !== 'ADMIN' && { divider: true, label: '', href: '' }), // Simple skip check
        },
        { divider: true, label: '' },
        {
          label: 'Logout',
          onClick: () => clearAuth(),
          icon: <LogOut className="h-4 w-4" />,
        },
      ].filter(item => item.label !== '')
    : [
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <a href="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt={siteConfig.name}
              className="h-9 w-9 rounded-lg object-contain transition-transform group-hover:scale-105"
            />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-2xl font-black tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
              {siteConfig.name}
            </span>
          </a>

          {/* Desktop Categories Dropdown */}
          <div className="hidden md:block">
            <Dropdown
              align="left"
              trigger={
                <button className="flex items-center space-x-1.5 text-sm font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              }
              items={categoryItems}
            />
          </div>
        </div>

        {/* Global Nav Search input */}
        <div className="hidden max-w-md flex-1 px-8 lg:block">
          <div className="relative">
            <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-zinc-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-4">
          {/* Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeToggle theme={theme} onChange={setTheme} />
          </div>

          {/* User profile dropdown */}
          <Dropdown
            trigger={
              <Button variant="ghost" size="icon" className="rounded-full">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                )}
              </Button>
            }
            items={userDropdownItems}
          />

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          >
            <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Menu"
        position="left"
      >
        <div className="flex flex-col space-y-6">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute inset-y-0 left-3 h-4 w-4 my-auto text-zinc-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Mobile Categories Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Categories</h4>
            {siteConfig.categories.map((c) => (
              <a
                key={c.slug}
                href={`/${c.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                {c.name}
              </a>
            ))}
          </div>

          {/* Mobile theme adjust */}
          <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Theme</h4>
            <ThemeToggle theme={theme} onChange={setTheme} />
          </div>
        </div>
      </Drawer>
    </header>
  );
};
