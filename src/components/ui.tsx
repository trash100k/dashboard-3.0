import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// ── Button ──────────────────────────────────────────────
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-gold/15 text-gold hover:bg-gold/25 border border-gold/20',
        emerald: 'bg-emerald/15 text-emerald hover:bg-emerald/25 border border-emerald/20',
        violet: 'bg-violet/15 text-violet hover:bg-violet/25 border border-violet/20',
        danger: 'bg-danger/15 text-danger hover:bg-danger/25 border border-danger/20',
        ghost: 'bg-transparent text-fog hover:bg-bg-elevated border border-transparent',
        outline: 'bg-transparent text-fog hover:bg-bg-elevated border border-border-active',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

// ── Card ────────────────────────────────────────────────
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-bg-surface border border-border rounded-xl p-5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Input ───────────────────────────────────────────────
export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full bg-bg-base border border-border rounded-lg px-3 py-2 text-sm text-fog placeholder:text-muted focus:outline-none focus:border-emerald/40 transition-colors',
        className
      )}
      {...props}
    />
  );
}

// ── Badge ───────────────────────────────────────────────
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gold/15 text-gold',
        emerald: 'bg-emerald/15 text-emerald',
        violet: 'bg-violet/15 text-violet',
        danger: 'bg-danger/15 text-danger',
        muted: 'bg-bg-elevated text-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// ── ProgressBar ─────────────────────────────────────────
export function ProgressBar({
  value,
  max = 100,
  className,
  color = 'emerald',
}: {
  value: number;
  max?: number;
  className?: string;
  color?: 'gold' | 'emerald' | 'violet';
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colorMap = {
    gold: 'bg-gold',
    emerald: 'bg-emerald',
    violet: 'bg-violet',
  };
  return (
    <div className={cn('w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', colorMap[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Separator ───────────────────────────────────────────
export function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px bg-border w-full', className)} />;
}

// ── Tooltip (simple) ────────────────────────────────────
export function Tooltip({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-elevated border border-border rounded text-xs text-fog opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {content}
      </div>
    </div>
  );
}
