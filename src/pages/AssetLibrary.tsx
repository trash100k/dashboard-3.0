import { useState } from 'react';
import { useStore, genId } from '../store';
import { Badge } from '../components/ui';
import { MagicCard } from '../components/magic-ui/MagicCard';
import { Marquee } from '../components/magic-ui/Marquee';
import { cn } from '../lib/utils';
import { Image, Video, Code, File, Upload, Layers, Search, X, CheckSquare, Square } from 'lucide-react';

type FilterType = 'all' | 'image' | 'video' | 'shader' | 'other';
type SortType = 'date' | 'name' | 'type';

const typeConfig = {
  image: { icon: Image, color: 'emerald', bg: 'bg-emerald/10', border: 'border-emerald/20', text: 'text-emerald' },
  video: { icon: Video, color: 'violet', bg: 'bg-violet/10', border: 'border-violet/20', text: 'text-violet' },
  shader: { icon: Code, color: 'gold', bg: 'bg-gold/10', border: 'border-gold/20', text: 'text-gold' },
  other: { icon: File, color: 'muted', bg: 'bg-bg-elevated', border: 'border-border', text: 'text-muted' },
};

const allTypes: FilterType[] = ['all', 'image', 'video', 'shader', 'other'];

function coloredBg(type: FilterType) {
  const map = { all: '', image: 'from-emerald/20 to-emerald/5', video: 'from-violet/20 to-violet/5', shader: 'from-gold/20 to-gold/5', other: 'from-bg-elevated to-bg-surface' };
  return map[type];
}

export default function AssetLibraryPage() {
  const { assets, setAssets } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewAsset, setPreviewAsset] = useState<typeof assets[0] | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setAssets([{ id: genId(), name: `uploaded-asset-${Date.now()}`, type: 'image' as const, url: '', tags: ['uploaded'], addedAt: 'Just now', createdAt: new Date().toISOString().slice(0, 10) }, ...assets]);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  // Filter, search, sort
  let filtered = assets.filter(a => {
    if (filter !== 'all' && a.type !== filter) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'type') return a.type.localeCompare(b.type);
    return a.addedAt.localeCompare(b.addedAt);
  });

  const stats = { all: assets.length, image: assets.filter((a) => a.type === 'image').length, video: assets.filter((a) => a.type === 'video').length, shader: assets.filter((a) => a.type === 'shader').length, other: assets.filter((a) => a.type === 'other').length };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-fog">Asset Library</h1>
          <p className="text-xs text-muted mt-0.5">Manage your images, videos, and shaders</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <div className="flex items-center gap-2 bg-emerald/10 border border-emerald/20 rounded-lg px-3 py-1.5">
              <span className="text-xs text-emerald">{selected.size} selected</span>
              <button onClick={() => setSelected(new Set())} className="text-xs text-danger hover:text-danger/80 cursor-pointer">Clear</button>
            </div>
          )}
        </div>
      </div>

      {/* Filters + Search + Sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {allTypes.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
                filter === f ? 'bg-emerald/15 text-emerald border border-emerald/20' : 'text-muted hover:text-fog hover:bg-bg-elevated border border-transparent'
              )}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 text-[10px] opacity-60">{stats[f]}</span>
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="bg-bg-base border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-fog placeholder:text-muted focus:outline-none focus:border-emerald/40 transition-colors w-40"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="bg-bg-base border border-border rounded-lg px-3 py-1.5 text-xs text-fog focus:outline-none focus:border-emerald/40"
        >
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="type">Sort: Type</option>
        </select>
      </div>

      {/* Asset Timeline Marquee */}
      <MagicCard variant="gold" className="py-3 px-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers size={14} className="text-gold" />
          <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Recent Uploads</span>
        </div>
        <Marquee speed={35}>
          {assets.slice(0, 8).map((a) => (
            <div key={a.id} className="flex items-center gap-2 bg-bg-elevated rounded-lg px-3 py-1.5 flex-shrink-0">
              <span className={cn('text-xs', typeConfig[a.type].text)}>{a.name}</span>
              <span className="text-[10px] text-muted">{a.addedAt}</span>
            </div>
          ))}
        </Marquee>
      </MagicCard>

      {/* Upload zone */}
      <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
        className={cn('border-2 border-dashed rounded-xl py-6 px-6 flex flex-col items-center justify-center gap-2 transition-all duration-200',
          isDragging ? 'border-emerald bg-emerald/5' : 'border-border hover:border-emerald/30 hover:bg-emerald/[0.02]'
        )}>
        <Upload size={24} className={cn('transition-colors', isDragging ? 'text-emerald' : 'text-muted')} />
        <p className={cn('text-xs', isDragging ? 'text-emerald' : 'text-muted')}>{isDragging ? 'Drop to upload' : 'Drag & drop files here'}</p>
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filtered.map((asset, i) => {
          const config = typeConfig[asset.type];
          const Icon = config.icon;
          const isSelected = selected.has(asset.id);
          return (
            <div key={asset.id}
              className={cn(
                'bg-bg-surface border rounded-xl overflow-hidden group transition-all duration-200 break-inside-avoid',
                isSelected ? 'border-emerald/40' : 'border-border',
                'hover:border-emerald/20 hover:shadow-[0_0_16px_rgba(100,220,180,0.08)]',
                'animate-fade-in relative'
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Checkbox overlay */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(asset.id); }}
                  className="text-muted hover:text-emerald cursor-pointer"
                >
                  {isSelected ? <CheckSquare size={16} className="text-emerald" /> : <Square size={16} />}
                </button>
              </div>

              {/* Preview area */}
              <div
                className={cn('h-28 sm:h-32 bg-gradient-to-br flex items-center justify-center relative cursor-pointer', coloredBg(asset.type))}
                onClick={() => setPreviewAsset(asset)}
              >
                <Icon size={28} className={cn(config.text, 'opacity-60')} />
                <span className={cn('absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded', config.bg, config.text)}>{asset.type}</span>
              </div>

              <div className="p-3 space-y-2">
                <p className="text-sm font-medium text-fog truncate">{asset.name}</p>
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((tag) => (
                    <button key={tag} onClick={() => setFilter(tag === 'branding' || tag === 'logo' || tag === 'web' || tag === 'hero' || tag === 'demo' || tag === 'product' || tag === 'webgl' || tag === 'effect' || tag === 'email' || tag === 'template' || tag === 'invoice' || tag === 'pdf' ? 'all' : 'other')}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated text-muted hover:text-emerald transition-colors cursor-pointer">
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted">{asset.addedAt}</p>
                  {asset.size && <p className="text-[10px] text-muted">{asset.size}</p>}
                </div>
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

      {/* Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setPreviewAsset(null)}>
          <div className="bg-bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-fog">{previewAsset.name}</h2>
              <button onClick={() => setPreviewAsset(null)}
                className="text-muted hover:text-fog cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="flex">
              <div className="flex-1 p-6 bg-bg-base flex items-center justify-center min-h-[200px]">
                <div className={cn('p-8 rounded-xl bg-gradient-to-br', coloredBg(previewAsset.type))}>
                  {(() => {
                    const Icon = typeConfig[previewAsset.type].icon;
                    return <Icon size={48} className={cn(typeConfig[previewAsset.type].text, 'opacity-60')} />;
                  })()}
                </div>
              </div>
              <div className="w-56 p-4 border-l border-border space-y-3">
                <div>
                  <span className="text-[10px] text-muted uppercase">Type</span>
                  <p className="text-xs text-fog">{previewAsset.type}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase">Added</span>
                  <p className="text-xs text-fog">{previewAsset.addedAt}</p>
                </div>
                {previewAsset.size && (
                  <div>
                    <span className="text-[10px] text-muted uppercase">Size</span>
                    <p className="text-xs text-fog">{previewAsset.size}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-muted uppercase">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewAsset.tags.map((tag) => (
                      <Badge key={tag} variant="muted" className="text-[9px]">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}