import { type ReactNode, type CSSProperties } from 'react';
import { cn } from '../lib/utils';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: number; // 1-5, defaults to 1
  style?: CSSProperties;
}

export function BentoCard({
  children,
  className = '',
  span = 1,
  style,
}: BentoCardProps) {
  // Calculate column span: span * 1 (since base grid is 1 column per card in md)
  // We'll use col-span-{span} for lg and xl, but for sm we want it to be full width if span>1?
  // Let's keep it simple: use col-span-{span} for lg and xl, and for sm and below, let it be full width (col-span-2)
  // But note: the base grid is 2 columns in sm, 4 in lg, 5 in xl.
  // We want the card to span a certain number of the base grid columns.
  // We'll use: col-span-{span} for lg, and for sm we'll do: if span >= 2 then col-span-2 else col-span-1?
  // Instead, let's use a different approach: we'll define the grid to have 12 columns (like Tailwind) and then use col-span.
  // However, to avoid changing the grid structure, we can use the existing grid and adjust the span value.

  // The grid has:
  //   sm: 2 columns -> each column is 6 units (if we think 12)
  //   lg: 4 columns -> each column is 3 units
  //   xl: 5 columns -> each column is 2.4 units (not integer)

  // Alternatively, we can use the grid as is and use the span as a multiplier for the base column.
  // We'll use: col-span-{span} but note that the base grid is not 12.

  // Let's change the grid to use a 12-column grid for consistency? But that would break the current layout.

  // Instead, we'll use the grid as defined and compute the actual column span based on the breakpoint.
  // We'll use Tailwind's responsive prefixes: col-span-{span} for base, then adjust for sm, lg, xl.

  // We'll define:
  //   base: col-span-{span} (but base is mobile first, so we start with sm)
  //   sm: col-span-{span} (but note: sm grid has 2 columns, so span 2 is full, span 1 is half)
  //   lg: col-span-{span * 0.5}? Not possible.

  // Let's take a simpler approach: we'll make the BentoGrid a container that uses CSS grid and we define the grid-template-columns as repeat(auto-fit, minmax(200px, 1fr))?
  // But the design might require a specific layout.

  // Looking at the AppHub usage, they are using BentoCard with span={2} for the first item and span={1} for others.
  // And the grid is set to: sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5

  // We can achieve the span by using the grid-column property: 
  //   grid-column: span <span>;
  // But we need to adjust for the different breakpoints.

  // We'll use inline style to set gridColumnEnd: `span ${span}`; and rely on the grid auto-placement.

  // However, note that the grid has a fixed number of columns per breakpoint, so we can set:
  //   gridColumn: `span ${span}`;
  // and let the grid handle it.

  // We'll set the grid auto-flow to dense? Not by default.

  // Let's try: we'll set the card to have gridColumnEnd: `span ${span}`; and then the grid will place it accordingly.

  // We'll also need to set gridRow: auto; (default)

  // We'll use style: { gridColumnEnd: `span ${span}` } and then merge with the passed style.

  const containerStyle = {
    gridColumnEnd: `span ${span}`,
    ...style,
  };

  return (
    <div
      className={cn(
        'bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 relative transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(100,220,180,0.1)] magic-card-glow',
        className
      )}
      style={containerStyle}
    >
      {children}
    </div>
  );
}