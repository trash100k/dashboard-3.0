import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface MagicCardProps {
  children: ReactNode;
  className?: string;
}

export function MagicCard({ children, className = '' }: MagicCardProps) {
  return (
    <div
      className={cn(
        'relative bg-bg-surface border border-border rounded-xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(100,220,180,0.15)]',
        className
      )}
    >
      {/* Glossy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-emerald/5 to-transparent pointer-events-none" />
      {/* Border gradient */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-[linear-theme:to_r(var(--background),var(--background))] bg-[linear-gradient_to_bottom_right,var(--emerald),var(--fog)] bg-[length:200%_200%] bg-[animation:gradient-shift_15s_ease_infinite] mask-[linear-gradient(#fff_0_0,#fff)] mask-[composite:destination-in] pointer-events-none" aria-hidden="true" />
      <div className="relative p-6">{children}</div>
    </div>
  );
}