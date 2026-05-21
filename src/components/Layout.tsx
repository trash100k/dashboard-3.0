import { useState, useEffect, type ReactNode } from 'react';
import {
  Home,
  FolderTree,
  Grid3x3,
  Image,
  Kanban,
  FileText,
  Settings,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'superfolders', label: 'Super Folders', icon: FolderTree },
  { id: 'apphub', label: 'App Hub', icon: Grid3x3 },
  { id: 'assets', label: 'Asset Library', icon: Image },
  { id: 'projects', label: 'Projects', icon: Kanban },
  { id: 'livingdoc', label: 'Living Doc', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const pageTitles: Record<string, string> = {
  home: 'Dashboard',
  superfolders: 'Super Folders',
  apphub: 'App Hub',
  assets: 'Asset Library',
  projects: 'Projects',
  livingdoc: 'Living Doc',
  settings: 'Settings',
};

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-xs text-muted font-mono tabular-nums">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base text-fog">
      {/* Left Sidebar — 64px icon bar */}
      <aside className="w-16 flex-shrink-0 bg-bg-surface border-r border-border flex flex-col items-center py-4 gap-2">
        {/* Logo / brand mark at top */}
        <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center mb-4">
          <span className="text-gold font-bold text-sm">🦉</span>
        </div>

        {/* Nav icons */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                'relative w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer group',
                isActive
                  ? 'bg-emerald/15 text-emerald shadow-[0_0_12px_rgba(100,220,180,0.2)]'
                  : 'text-muted hover:text-fog hover:bg-bg-elevated'
              )}
              title={item.label}
            >
              {/* Gold accent line on active */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r" />
              )}
              <Icon size={20} />
            </button>
          );
        })}
      </aside>

      {/* Right side: header + main + status bar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header — 48px */}
        <header className="h-12 flex-shrink-0 bg-bg-surface border-b border-border flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-fog tracking-wide">
            {pageTitles[currentPage] ?? 'Dashboard'}
          </h1>
          <LiveClock />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Bottom Status Bar — 28px */}
        <footer className="h-7 flex-shrink-0 bg-bg-surface border-t border-border flex items-center justify-between px-4">
          <span className="text-[10px] text-muted font-mono tracking-wider">
            OWL Dashboard v3.0
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            <span className="text-[10px] text-muted font-mono">connected</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
