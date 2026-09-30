'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@tools-website/ui';
import { useThemeStore } from '../lib/store/theme-store';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = getQueryClient();

  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  React.useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
};
