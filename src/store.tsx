import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ── Types ───────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  progress: number;
  nudge?: string;
  updatedAt: string;
}

export interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  checklist?: { id: string; label: string; done: boolean }[];
  expanded?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'shader' | 'other';
  url: string;
  tags: string[];
  addedAt: string;
}

export interface AppLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

// ── Default Data ────────────────────────────────────────
const defaultProjects: Project[] = [
  { id: '1', name: 'CUTTY-OS CRM', status: 'in-progress', progress: 65, nudge: 'Finish Invoice page', updatedAt: '2h ago' },
  { id: '2', name: 'Meridian Outreach', status: 'in-progress', progress: 40, updatedAt: '5h ago' },
  { id: '3', name: 'Diagnostic Tool', status: 'review', progress: 90, updatedAt: '1d ago' },
  { id: '4', name: 'Newsletter Pipeline', status: 'done', progress: 100, updatedAt: '3d ago' },
  { id: '5', name: 'FieldMode Mobile', status: 'backlog', progress: 10, updatedAt: '1w ago' },
  { id: '6', name: 'GrowthHub Analytics', status: 'backlog', progress: 0, updatedAt: '1w ago' },
];

const defaultFolders: FolderNode[] = [
  {
    id: 'f1', name: 'Ventures', type: 'folder', expanded: true,
    children: [
      {
        id: 'f1-1', name: 'CUTTY-OS', type: 'folder', expanded: false,
        children: [
          { id: 'f1-1-1', name: 'CRM Module', type: 'file', checklist: [
            { id: 'c1', label: 'Lead capture form', done: true },
            { id: 'c2', label: 'Pipeline view', done: true },
            { id: 'c3', label: 'Follow-up automation', done: false },
          ]},
          { id: 'f1-1-2', name: 'Scheduler', type: 'file', checklist: [
            { id: 'c4', label: 'Calendar view', done: true },
            { id: 'c5', label: 'Crew assignment', done: false },
          ]},
          { id: 'f1-1-3', name: 'Invoices', type: 'file', checklist: [
            { id: 'c6', label: 'PDF generation', done: false },
            { id: 'c7', label: 'Payment tracking', done: false },
          ]},
        ],
      },
      {
        id: 'f1-2', name: 'Meridian Sweep', type: 'folder', expanded: false,
        children: [
          { id: 'f1-2-1', name: 'Outreach Engine', type: 'file', checklist: [
            { id: 'c8', label: 'Lead scoring', done: true },
            { id: 'c9', label: 'Email templates', done: true },
            { id: 'c10', label: 'Follow-up sequences', done: false },
          ]},
          { id: 'f1-2-2', name: 'Newsletter', type: 'file', checklist: [
            { id: 'c11', label: 'Tue 9am cron', done: true },
            { id: 'c12', label: 'Content research flywheel', done: true },
          ]},
        ],
      },
    ],
  },
  {
    id: 'f2', name: 'Assets', type: 'folder', expanded: false,
    children: [
      { id: 'f2-1', name: 'Brand Kit', type: 'folder', children: [
        { id: 'f2-1-1', name: 'Logo files', type: 'file' },
        { id: 'f2-1-2', name: 'Color palette', type: 'file' },
      ]},
      { id: 'f2-2', name: 'Templates', type: 'folder', children: [
        { id: 'f2-2-1', name: 'Email templates', type: 'file' },
        { id: 'f2-2-2', name: 'Proposal deck', type: 'file' },
      ]},
    ],
  },
];

const defaultAssets: Asset[] = [
  { id: 'a1', name: 'cutty-logo.png', type: 'image', url: '', tags: ['branding', 'logo'], addedAt: '2d ago' },
  { id: 'a2', name: 'hero-bg.jpg', type: 'image', url: '', tags: ['web', 'hero'], addedAt: '3d ago' },
  { id: 'a3', name: 'demo-walkthrough.mp4', type: 'video', url: '', tags: ['demo', 'product'], addedAt: '5d ago' },
  { id: 'a4', name: 'water-effect.frag', type: 'shader', url: '', tags: ['webgl', 'effect'], addedAt: '1w ago' },
];

const defaultApps: AppLink[] = [
  { id: 'app1', name: 'Google AI Studio', url: 'https://aistudio.google.com', icon: '🧠', color: '#8b5cf6' },
  { id: 'app2', name: 'Lovable', url: 'https://lovable.dev', icon: '💜', color: '#ec4899' },
  { id: 'app3', name: 'GitHub', url: 'https://github.com', icon: '🐙', color: '#64dcb4' },
  { id: 'app4', name: 'Supabase', url: 'https://supabase.com', icon: '⚡', color: '#3ecf8e' },
  { id: 'app5', name: 'Render', url: 'https://render.com', icon: '🚀', color: '#f0e' },
  { id: 'app6', name: 'Vercel', url: 'https://vercel.com', icon: '▲', color: '#fff' },
  { id: 'app7', name: 'Figma', url: 'https://figma.com', icon: '🎨', color: '#a259ff' },
  { id: 'app8', name: 'Notion', url: 'https://notion.so', icon: '📝', color: '#fff' },
];

// ── Context ─────────────────────────────────────────────
interface StoreContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  folders: FolderNode[];
  setFolders: React.Dispatch<React.SetStateAction<FolderNode[]>>;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  apps: AppLink[];
  transcript: string;
  setTranscript: (t: string) => void;
  isListening: boolean;
  setIsListening: (l: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    try { const s = localStorage.getItem('dash-projects'); if (s) return JSON.parse(s); } catch {}
    return defaultProjects;
  });
  const [folders, setFolders] = useState<FolderNode[]>(() => {
    try { const s = localStorage.getItem('dash-folders'); if (s) return JSON.parse(s); } catch {}
    return defaultFolders;
  });
  const [assets, setAssets] = useState<Asset[]>(() => {
    try { const s = localStorage.getItem('dash-assets'); if (s) return JSON.parse(s); } catch {}
    return defaultAssets;
  });
  const [apps] = useState<AppLink[]>(defaultApps);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => { localStorage.setItem('dash-projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('dash-folders', JSON.stringify(folders)); }, [folders]);
  useEffect(() => { localStorage.setItem('dash-assets', JSON.stringify(assets)); }, [assets]);

  return (
    <StoreContext.Provider value={{
      projects, setProjects, folders, setFolders, assets, setAssets, apps,
      transcript, setTranscript, isListening, setIsListening,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// ── Helpers ─────────────────────────────────────────────
export function genId() {
  return Math.random().toString(36).slice(2, 10);
}
