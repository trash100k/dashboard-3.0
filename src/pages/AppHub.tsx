import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui';
import { BentoCard, BentoGrid } from '../components/magic-ui/BentoGrid';
import { StatusPill } from '../components/shared/StatusPill';
import { cn } from '../lib/utils';
import { Plus, Pin, Clock, MousePointerClick, Search } from 'lucide-react';

const categories = ['All', 'Dev', 'Design', 'AI', 'Business', 'Communication', 'Infrastructure'] as const;

export default function AppHubPage() {
  const { apps } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = apps.filter(a => {
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    const matchesSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinned = filtered.filter(a => a.clickCount && a.clickCount > 10);
  const recent = [...filtered].sort((a, b) => {
    const order = ['1h', '2h', '3h', '4h', '5h', '1d', '2d', '3d', '1w'];
    const ai = a.lastUsed ? order.findIndex(o => a.lastUsed!.includes(o)) : 99;
    const bi = b.lastUsed ? order.findIndex(o => b.lastUsed!.includes(o)) : 99;
    return ai - bi;
  }).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-fog">Systems</h1>
          <p className="text-xs text-muted mt-0.5">Your essential tools, organized</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="bg-bg-base border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-fog placeholder:text-muted focus:outline-none focus:border-emerald/40 transition-colors w-48"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald/10 border border-emerald/20 text-emerald text-xs font-medium hover:bg-emerald/20 transition-all cursor-pointer">
            <Plus size={14} />
            Add App
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
              activeCategory === cat
                ? 'bg-emerald/15 text-emerald border border-emerald/20'
                : 'text-muted hover:text-fog hover:bg-bg-elevated border border-transparent'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinned section */}
      {pinned.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Pin size={14} className="text-gold" />
            <h2 className="text-xs font-semibold text-fog/80 uppercase tracking-wider">Pinned</h2>
          </div>
          <BentoGrid>
            {pinned.slice(0, 4).map((app, i) => (
              <BentoCard key={app.id} span={i === 0 ? 2 : 1} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}>
                <AppCard app={app} />
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      )}

      {/* Recently used */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-emerald" />
          <h2 className="text-xs font-semibold text-fog/80 uppercase tracking-wider">Recently Used</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recent.slice(0, 4).map((app) => (
            <AppCard key={app.id} app={app} compact />
          ))}
        </div>
      </div>

      {/* All apps grid */}
      <div>
        <h2 className="text-xs font-semibold text-fog/80 uppercase tracking-wider mb-3">All Systems</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((app, i) => (
            <div key={app.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <AppCard app={app} />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted">No apps match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AppCard({ app, compact }: { app: { id: string; name: string; url: string; icon: string; color: string; category?: string; lastUsed?: string; clickCount?: number; status?: string }; compact?: boolean }) {
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 relative',
        'transition-all duration-200 hover:scale-[1.02]',
        'hover:shadow-[0_0_20px_rgba(100,220,180,0.1)]',
        'magic-card-glow'
      )}
    >
      {/* Colored top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: app.color }} />

      <div className="flex items-center justify-between">
        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
          {app.icon}
        </span>
        <div className="flex items-center gap-1.5">
          {app.status && <StatusPill status={app.status as any} className="text-[9px] px-1.5 py-0.5" />}
          {app.clickCount && app.clickCount > 5 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted">
              <MousePointerClick size={10} />
              {app.clickCount}
            </span>
          )}
        </div>
      </div>

      <div>
        <span className={cn('font-medium text-fog/80 group-hover:text-fog transition-colors', compact ? 'text-xs' : 'text-sm')}>
          {app.name}
        </span>
        {!compact && app.category && (
          <Badge variant="muted" className="text-[9px] ml-2">{app.category}</Badge>
        )}
        {!compact && app.lastUsed && (
          <p className="text-[10px] text-muted mt-1">
            <Clock size={9} className="inline mr-1" />
            Used {app.lastUsed}
          </p>
        )}
      </div>
    </a>
  );
}