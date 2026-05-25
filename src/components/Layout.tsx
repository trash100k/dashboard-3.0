import { useState, useEffect, type ReactNode } from 'react';
import {
  Home,
  FolderTree,
  Grid3x3,
  Image,
  Kanban,
  FileText,
  Settings,
  Brain,
  Factory,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from 'cmdk';
import { Mic } from 'lucide-react';

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
  { id: 'intelsearch', label: 'Intel Search', icon: Brain },
  { id: 'factories', label: 'Factories', icon: Factory },
];

const pageTitles: Record<string, string> = {
  home: 'Dashboard',
  superfolders: 'Super Folders',
  apphub: 'App Hub',
  assets: 'Asset Library',
  projects: 'Projects',
  livingdoc: 'Living Doc',
  settings: 'Settings',
  intelsearch: 'Intel & Search',
  factories: 'Factories',
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [commandIsOpen, setCommandIsOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const handleCloseCommand = () => setCommandIsOpen(false);
  const handleOpenCommand = () => setCommandIsOpen(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base text-fog">
      {/* Left Sidebar — collapsible */}
      <aside
        className={cn(
          'flex-shrink-0 bg-bg-surface border-r border-border flex flex-col items-center py-4 gap-2 transition-all duration-200',
          isSidebarExpanded ? 'w-48' : 'w-16'
        )}
      >
        {/* Logo / brand mark at top */}
        <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center mb-4">
          <span className="text-gold font-bold text-sm">🦉</span>
        </div>

        {/* Nav icons with optional labels */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setIsSidebarExpanded(false); // Close sidebar on navigation (optional)
              }}
              className={cn(
                'flex w-10 h-10 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer group',
                isActive
                  ? 'bg-emerald/15 text-emerald shadow-[0_0_12px_rgba(100,220,180,0.2)]'
                  : 'text-muted hover:text-fog hover:bg-bg-elevated'
              )}
              title={item.label}
            >
              {/* Gold accent line on active */}
              {isActive && (
                <div className=\"absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r\" />
              )}
              <Icon size={20} />
              {isSidebarExpanded && (
                <span className=\"ml-3 text-sm font-medium whitespace-nowrap\">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* Spacer to push toggle button to bottom */}
        <div className=\"mt-auto\" />

        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:text-fog hover:bg-bg-elevated',
            isSidebarExpanded ? 'text-emerald' : 'text-muted'
          )}
          title=\"Toggle sidebar\">
          {isSidebarExpanded ? (
            <FolderTree size={18} className=\"text-emerald\" />
          ) : (
            <FolderTree size={18} />
          )}
        </button>
      </aside>

      {/* Right side: header + main + status bar */}
      <div className=\"flex-1 flex flex-col min-w-0\">
        {/* Top Header — 48px */}
        <header className=\"h-12 flex-shrink-0 bg-bg-surface border-b border-border flex items-center justify-between px-6\">
          <div className=\"flex items-center gap-4\">
            <h1 className=\"text-sm font-semibold text-fog tracking-wide\">
              {pageTitles[currentPage] ?? 'Dashboard'}
            </h1>
            <LiveClock />
          </div>
          <div className=\"flex items-center gap-2\">
            {/* Command palette button */}
            <button
              onClick={handleOpenCommand}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:text-fog hover:bg-bg-elevated',
                'text-muted'
              )}
              title=\"Command palette\">
              <Mic size={18} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className=\"flex-1 overflow-y-auto p-6\">
          {children}
        </main>

        {/* Bottom Status Bar — 28px */}
        <footer className=\"h-7 flex-shrink-0 bg-bg-surface border-t border-border flex items-center justify-between px-4\">
          <span className=\"text-[10px] text-muted font-mono tracking-wider\">
            OWL Dashboard v3.0
          </span>
          <div className=\"flex items-center gap-1.5\">
            <span className=\"w-1.5 h-1.5 rounded-full bg-emerald animate-pulse\" />
            <span className=\"text-[10px] text-muted font-mono\">connected</span>
          </div>
        </footer>
      </div>

      {/* Command Dialog */}
      <CommandDialog
        open={commandIsOpen}
        onClose={handleCloseCommand}
        className=\"w-[24rem] sm:w-[28rem]\">
        <CommandDialogContent className=\"p-4\">
          <CommandGroup>
            <CommandInput placeholder=\"Search commands...\" className=\"mb-2\" />
            <CommandEmpty state=\"empty\" className=\"text-sm\">
              No commands found.
            </CommandEmpty>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onPageChange('home');
                  handleCloseCommand();
                }}
                leading={<Home size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Home
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('superfolders');
                  handleCloseCommand();
                }}
                leading={<FolderTree size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Super Folders
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('apphub');
                  handleCloseCommand();
                }}
                leading={<Grid3x3 size={16} className=\"mr-3 h-4 w-4\" />}
              >
                App Hub
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('assets');
                  handleCloseCommand();
                }}
                leading={<Image size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Asset Library
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('projects');
                  handleCloseCommand();
                }}
                leading={<Kanban size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Projects
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('livingdoc');
                  handleCloseCommand();
                }}
                leading={<FileText size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Living Doc
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('settings');
                  handleCloseCommand();
                }}
                leading={<Settings size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Settings
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('intelsearch');
                  handleCloseCommand();
                }}
                leading={<Brain size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Intel Search
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onPageChange('factories');
                  handleCloseCommand();
                }}
                leading={<Factory size={16} className=\"mr-3 h-4 w-4\" />}
              >
                Factories
              </CommandItem>
            </CommandGroup>
          </CommandGroup>
        </CommandDialogContent>
      </CommandDialog>
    </div>
  );
}