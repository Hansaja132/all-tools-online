import * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from './utils';

export interface BreadcrumbLink {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbLink[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn('flex items-center space-x-1.5 text-sm text-zinc-500 dark:text-zinc-400', className)}>
      <a
        href="/"
        className="flex items-center hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
      >
        <Home className="h-4 w-4" />
      </a>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
          {item.href && index < items.length - 1 ? (
            <a
              href={item.href}
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-medium"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
