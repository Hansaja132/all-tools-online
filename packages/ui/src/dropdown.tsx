'use client';

import * as React from 'react';
import { cn } from './utils';

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  href?: string;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-40 mt-2 w-56 origin-top-right rounded-xl border border-zinc-200 bg-white shadow-lg focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-100',
            {
              'left-0': align === 'left',
              'right-0': align === 'right',
            },
            className
          )}
        >
          <div className="p-1.5">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="my-1 border-t border-zinc-100 dark:border-zinc-800"
                  />
                );
              }

              const content = (
                <button
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-sm text-zinc-700 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                >
                  {item.icon && <span className="mr-2.5 text-zinc-400">{item.icon}</span>}
                  {item.label}
                </button>
              );

              return (
                <div key={index}>
                  {item.href ? (
                    <a href={item.href} className="no-underline">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
