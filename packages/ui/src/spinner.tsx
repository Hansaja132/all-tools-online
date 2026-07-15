import * as React from 'react';
import { cn } from './utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size = 'md', ...props }) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-transparent border-solid border-violet-600',
        {
          'h-5 w-5 border-2': size === 'sm',
          'h-8 w-8 border-3': size === 'md',
          'h-12 w-12 border-4': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
};
