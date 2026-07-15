import * as React from 'react';
import { cn } from './utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-zinc-200 bg-white p-6 shadow-sm text-zinc-950 transition-all dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:shadow-md/50',
          hoverable && 'hover:-translate-y-1 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-800/80',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
