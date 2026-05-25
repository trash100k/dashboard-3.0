import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface ParticlesProps {
  className?: string;
  particleCount?: number;
  size?: number; // base size of particle
  color?: string; // color of particles
  opacity?: number; // base opacity
}

export function Particles({
  className = '',
  particleCount = 20,
  size = 2,
  color = '#8b5cf6', // violet
  opacity = 0.3,
}: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initParticles = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: size + Math.random() * 2,
          color,
        });
      }
      setParticles(newParticles);
    };

    initParticles();
    const handleResize = () => initParticles();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount, size, color]);

  useEffect(() => {
    if (particles.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    let animationFrame: number;
    const update = () => {
      const updatedParticles = particles.map((p) => {
        let newX = p.x + p.vx;
        let newY = p.y + p.vy;
        let newVx = p.vx;
        let newVy = p.vy;

        // Bounce off edges
        if (newX < 0 || newX > width) {
          newVx = -p.vx;
          newX = p.x + newVx; // adjust position after bounce
        }
        if (newY < 0 || newY > height) {
          newVy = -p.vy;
          newY = p.y + newVy;
        }

        // Add slight drift to avoid stagnation
        newVx += (Math.random() - 0.5) * 0.1;
        newVy += (Math.random() - 0.5) * 0.1;

        // Limit velocity
        const speed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (speed > 2) {
          const scale = 2 / speed;
          newVx *= scale;
          newVy *= scale;
        }

        return {
          ...p,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      });

      setParticles(updatedParticles);
      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles, width, height]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 pointer-events-hidden overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}