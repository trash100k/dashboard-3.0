import { type ReactNode, useEffect, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';

interface NumberTickerProps {
  value: number;
  duration?: number; // in seconds
  className?: string;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<number>(0);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  const animatedValue = useTransform(
    ref,
    (v) => v,
    (v) => v
  );

  const formattedValue = animatedValue
    .map((v) => {
      const num = parseFloat(v.toString());
      if (isNaN(num)) return '0';
      const fixed = num.toFixed(decimalPlaces);
      return prefix + fixed + suffix;
    })
    .map((v) => v);

  return (
    <motion.span
      className={cn(
        'text-2xl font-bold text-fog feature-text-0',
        className
      )}
    >
      {formattedValue}
    </motion.span>
  );
}