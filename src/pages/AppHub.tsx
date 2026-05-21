import { useStore } from '../store';
import { cn } from '../lib/utils';

export default function AppHubPage() {
  const { apps } = useStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-fog">App Hub</h1>
        <p className="text-xs text-muted mt-0.5">Quick access to your essential tools</p>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {apps.map((app, i) => (
          <a
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group bg-bg-surface border border-border rounded-xl p-5 flex flex-col items-center gap-3 relative',
              'transition-all duration-200 hover:scale-[1.02]',
              'hover:shadow-[0_0_20px_rgba(100,220,180,0.1)]',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Colored left border accent using a top border + overlay trick */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: app.color }}
            />

            {/* Large icon */}
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
              {app.icon}
            </span>

            {/* App name */}
            <span className="text-sm font-medium text-fog/80 group-hover:text-fog transition-colors text-center">
              {app.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
