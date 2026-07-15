import * as React from 'react';
import { cn } from './utils';

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  className,
  header,
  footer,
}) => {
  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
    >
      {header && (
        <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
          {header}
        </div>
      )}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
              item.active
                ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
                : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
            )}
          >
            <span className="flex-shrink-0 text-current">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      {footer && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          {footer}
        </div>
      )}
    </aside>
  );
};
