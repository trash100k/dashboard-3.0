import { useState, useCallback } from 'react';
import { useStore, genId } from '../store';
import { Badge } from '../components/ui';
import { cn } from '../lib/utils';
import { Image, Video, Code, File, Upload, Layers } from 'lucide-react';

type FilterType = 'all' | 'image' | 'video' | 'shader';

const typeConfig = {
  image: { icon: Image, color: 'emerald', bg: 'bg-emerald/10', border: 'border-emerald/20', text: 'text-emerald' },
  video: { icon: Video, color: 'violet', bg: 'bg-violet/10', border: 'border-violet/20', text: 'text-violet' },
  shader: { icon: Code, color: 'gold', bg: 'bg-gold/10', border: 'border-gold/20', text: 'text-gold' },
  other: { icon: File, color: 'muted', bg: 'bg-bg-elevated', border: 'border-border', text: 'text-muted' },
};

function coloredBg(type: 'image' | 'video' | 'shader' | 'other') {
  const map = { image: 'from-emerald/20 to-emerald/5', video: 'from-violet/20 to-violet/5', shader: 'from-gold/20 to-gold/5', other: 'from-bg-elevated to-bg-surface' };
  return map[type];
}

export default function AssetLibraryPage() {
  const { assets, setAssets } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDragging, setIsDragging] = useState(false);

  const filtered = filter === 'all' ? assets : assets.filter((a) => a.type === filter);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setAssets([{ id: genId(), name: `uploaded-asset-${Date.now()}`, type: 'image' as const, url: '', tags: ['uploaded'], addedAt: 'Just now' }, ...assets]);
  }, [assets, setAssets]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'image', label: 'Images' }, { key: 'video', label: 'Videos' }, { key: 'shader', label: 'Shaders' },
  ];
  const stats = { all: assets.length, image: assets.filter((a) => a.type === 'image').length, video: assets.filter((a) => a.type === 'video').length, shader: assets.filter((a) => a.type === 'shader').length };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-fog">Asset Library</h1>
          <p className="text-xs text-muted mt-0.5">Manage your images, videos, and shaders</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
              filter === f.key ? 'bg-emerald/15 text-emerald border border-emerald/20' : 'text-muted hover:text-fog hover:bg-bg-elevated border border-transparent'
            )}>
            {f.label}<span className="ml-1.5 text-[10px] opacity-60">{stats[f.key]}</span>
          </button>
        ))}
      </div>

      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
        className={cn('border-2 border-dashed rounded-xl py-8 px-6 flex flex-col items-center justify-center gap-2 transition-all duration-200',
          isDragging ? 'border-emerald bg-emerald/5' : 'border-border hover:border-emerald/30 hover:bg-emerald/[0.02]'
        )}>
        <Upload size={24} className={cn('transition-colors', isDragging ? 'text-emerald' : 'text-muted')} />
        <p className={cn('text-xs', isDragging ? 'text-emerald' : 'text-muted')}>{isDragging ? 'Drop to upload' : 'Drag & drop files here'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((asset, i) => {
          const config = typeConfig[asset.type];
          const Icon = config.icon;
          return (
            <div key={asset.id}
              className={cn('bg-bg-surface border border-border rounded-xl overflow-hidden group hover:border-emerald/20 transition-all duration-200 hover:shadow-[0_0_16px_rgba(100,220,180,0.08)] animate-fade-in')}
              style={{ animationDelay: `${i * 50}ms` }}>
              <div className={cn('h-32 bg-gradient-to-br flex items-center justify-center relative', coloredBg(asset.type))}>
                <Icon size={32} className={cn(config.text, 'opacity-60')} />
                <span className={cn('absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded', config.bg, config.text)}>{asset.type}</span>
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium text-fog truncate">{asset.name}</p>
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((tag) => (<Badge key={tag} variant="muted" className="text-[10px]">{tag}</Badge>))}
                </div>
                <p className="text-[10px] text-muted">{asset.addedAt}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Layers size={32} className="text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">No assets found for this filter.</p>
        </div>
      )}
    </div>
  );
}
