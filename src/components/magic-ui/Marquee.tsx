import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number; // in seconds for one loop
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className = '',
  speed = 5,
  direction = 'left',
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden hidden sm:block',
        className
      )}
      onMouseEnter={pauseOnHover ? (e: React.MouseEvent) => {
        const marquee = e.currentTarget.querySelector('.marquee-track') as HTMLElement;
        if (marquee) marquee.style.animationPlayState = 'paused';
      } : undefined}
      onMouseLeave={pauseOnHover ? (e: React.MouseEvent) => {
        const marquee = e.currentTarget.querySelector('.marquee-track') as HTMLElement;
        if (marquee) marquee.style.animationPlayState = 'running';
      } : undefined}
    >
      <div
        className="flex items-center space-x-6 marquee-track"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === 'left' ? 'normal' : 'reverse',
        }}
      >
        {children}
        {/* Duplicate children for seamless loop */}
        {children}
      </div>
    </div>
  );
}