import { useStore } from '../store';
import { Badge, ProgressBar } from '../components/ui';
import { cn } from '../lib/utils';
import { Clock, MessageSquare } from 'lucide-react';

const columns: { key: 'backlog' | 'in-progress' | 'review' | 'done'; label: string; bg: string; border: string }[] = [
  { key: 'backlog', label: 'Backlog', bg: 'bg-bg-elevated/50', border: 'border-border' },
  { key: 'in-progress', label: 'In Progress', bg: 'bg-emerald/[0.03]', border: 'border-emerald/10' },
  { key: 'review', label: 'Review', bg: 'bg-violet/[0.03]', border: 'border-violet/10' },
  { key: 'done', label: 'Done', bg: 'bg-gold/[0.03]', border: 'border-gold/10' },
];

const statusColor = {
  backlog: 'muted' as const,
  'in-progress': 'emerald' as const,
  review: 'violet' as const,
  done: 'default' as const,
};

const progressColor = {
  backlog: 'emerald',
  'in-progress': 'emerald',
  review: 'violet',
  done: 'gold',
} as const;

export default function ProjectsPage() {
  const { projects } = useStore();

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-fog">Projects</h1>
        <p className="text-xs text-muted mt-0.5">Kanban board — track progress across all workstreams</p>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colProjects = projects.filter((p) => p.status === col.key);
          return (
            <div
              key={col.key}
              className={cn(
                'rounded-xl border p-3 space-y-3 min-h-[300px]',
                col.bg,
                col.border
              )}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs font-semibold text-fog/80 uppercase tracking-wider">
                  {col.label}
                </h2>
                <Badge variant={statusColor[col.key]} className="text-[10px]">
                  {colProjects.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {colProjects.map((project, i) => (
                  <div
                    key={project.id}
                    className={cn(
                      'bg-bg-surface border border-border rounded-lg p-3 space-y-2',
                      'hover:border-border-active transition-all duration-200',
                      'animate-fade-in'
                    )}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Project name */}
                    <p className="text-sm font-medium text-fog">{project.name}</p>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted">Progress</span>
                        <span className="text-[10px] text-fog/60">{project.progress}%</span>
                      </div>
                      <ProgressBar
                        value={project.progress}
                        color={progressColor[project.status]}
                      />
                    </div>

                    {/* Nudge text */}
                    {project.nudge && (
                      <div className="flex items-start gap-1.5 bg-gold/5 border border-gold/10 rounded-md px-2 py-1.5">
                        <MessageSquare size={11} className="text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-[11px] text-gold/80">{project.nudge}</span>
                      </div>
                    )}

                    {/* Relative time */}
                    <div className="flex items-center gap-1 text-[10px] text-muted">
                      <Clock size={10} />
                      {project.updatedAt}
                    </div>
                  </div>
                ))}

                {colProjects.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-muted">No projects</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
