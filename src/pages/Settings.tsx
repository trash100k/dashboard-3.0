import { useState } from 'react';
import { useStore } from '../store';
import { Button, Card, Separator } from '../components/ui';
import { Download, Trash2, Database, Info, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const { projects, folders, assets } = useStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const data = { version: '3.0', exportedAt: new Date().toISOString(), projects, folders, assets };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owl-dashboard-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem('dash-projects');
    localStorage.removeItem('dash-folders');
    localStorage.removeItem('dash-assets');
    localStorage.removeItem('dash-notes');
    window.location.reload();
  };

  const techStack = [
    { name: 'React 19', desc: 'UI framework' },
    { name: 'TypeScript', desc: 'Type safety' },
    { name: 'Tailwind CSS v4', desc: 'Styling' },
    { name: 'Vite', desc: 'Build tool' },
    { name: 'Lucide React', desc: 'Icons' },
    { name: 'Context API', desc: 'State management' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-fog">Settings</h1>
        <p className="text-xs text-muted mt-0.5">Manage your data and preferences</p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-emerald" />
          <h2 className="text-sm font-semibold text-fog">Data</h2>
        </div>
        <p className="text-xs text-muted">Export all your dashboard data as JSON, or clear everything to start fresh.</p>
        <div className="flex items-center gap-3">
          <Button variant="emerald" size="sm" onClick={handleExport}>
            <Download size={14} />
            {exported ? 'Exported!' : 'Export All Data'}
          </Button>
          {!showConfirmClear ? (
            <Button variant="danger" size="sm" onClick={() => setShowConfirmClear(true)}>
              <Trash2 size={14} />
              Clear All Data
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-danger">Are you sure?</span>
              <Button variant="danger" size="sm" onClick={handleClear}>Yes, clear everything</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowConfirmClear(false)}>Cancel</Button>
            </div>
          )}
        </div>
        <div className="text-[10px] text-muted space-y-0.5">
          <p>{projects.length} projects · {folders.length} folders · {assets.length} assets</p>
        </div>
      </Card>

      <Separator />

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-gold" />
          <h2 className="text-sm font-semibold text-fog">About</h2>
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-gold via-gold/80 to-gold/60 bg-clip-text text-transparent">OWL Dashboard v3.0</h3>
          <p className="text-xs text-muted mt-1">A modern, dark-themed dashboard for managing projects, assets, and workflows.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-fog/60 uppercase tracking-wider mb-2">Tech Stack</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {techStack.map((tech) => (
              <div key={tech.name} className="bg-bg-base border border-border rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-fog">{tech.name}</p>
                <p className="text-[10px] text-muted">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <a href="https://github.com/trash100k/dashboard-3.0" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-emerald hover:text-emerald/80 transition-colors">
          <ExternalLink size={12} />
          View on GitHub
        </a>
      </Card>

      <Separator />

      <div className="text-center py-4">
        <p className="text-[10px] text-muted">Built with ❤️ by the Flynn Clan · OWL Dashboard v3.0</p>
      </div>
    </div>
  );
}
