import * as React from 'react';
import { cn } from './utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              'h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-violet-400',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
