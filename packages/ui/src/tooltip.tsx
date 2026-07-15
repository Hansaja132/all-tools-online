import * as React from 'react';
import { cn } from './utils';

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={cn(
          'absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-md dark:bg-zinc-800 border border-zinc-700/50 animate-in fade-in zoom-in-95 duration-100',
          className
        )}>
          {content}
          <div className="absolute top-full left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-0.5 rotate-45 bg-zinc-950 dark:bg-zinc-800 border-r border-b border-zinc-700/50" />
        </div>
      )}
    </div>
  );
};
