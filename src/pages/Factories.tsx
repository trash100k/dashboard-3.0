import { useState } from 'react';
import { useStore, genId } from '../store';
import { Button, Card, Badge, ProgressBar } from '../components/ui';
import { Activity, Briefcase, Clock, Factory, MessageSquare, Settings, Target, TrendingUp, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { MagicCard } from '../components/magic-ui/MagicCard';
import { NumberTicker } from '../components/magic-ui/NumberTicker';
import { Marquee } from '../components/magic-ui/Marquee';

const factoryMetrics = [
  { id: '1', label: 'Output Rate', value: 84.2, suffix: 'units/h', icon: Zap, color: 'emerald' },
  { id: '2', label: 'Quality Score', value: 96.8, suffix: '%', icon: Target, color: 'gold' },
  { id: '3', label: 'Efficiency', value: 78.3, suffix: '%', icon: Activity, color: 'violet' },
  { id: '4', label: 'Uptime', value: 99.1, suffix: '%', icon: Settings, color: 'fog' },
];

const productionLines = [
  { id: 'line1', name: 'Assembly Line A', status: 'running', progress: 72, output: '1,240 units' },
  { id: 'line2', name: 'Assembly Line B', status: 'maintenance', progress: 0, output: '0 units' },
  { id: 'line3', name: 'Assembly Line C', status: 'running', progress: 88, output: '2,180 units' },
  { id: 'line4', name: 'Assembly Line D', status: 'idle', progress: 0, output: '0 units' },
];

export default function FactoriesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-fog">Factories</h1>
          <p className="text-xs text-muted mt-0.5">Monitor and control production facilities</p>
        </div>
        <Button variant="outline" size="sm">
          <Activity size={14} /> View All
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {factoryMetrics.map((metric) => (
          <MagicCard key={metric.id} className="flex flex-col items-center p-4">
            <div className="flex items-center gap-2 mb-2">
              {metric.icon} 
              <span className="text-xs font-medium text-fog">{metric.label}</span>
            </div>
            <NumberTicker value={metric.value} suffix={metric.suffix} className="mb-2" />
            <ProgressBar value={metric.value} max={100} color={metric.color as any} className="w-full" />
          </MagicCard>
        ))}
      </div>

      {/* Production Lines */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-fog">Production Lines</h2>
          <div className="flex items-center gap-2">
            <Button variant="emerald" size="sm">
              <Zap size={14} /> Start All
            </Button>
            <Button variant="outline" size="sm">
              <Settings size={14} /> Schedule
            </Button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {productionLines.map((line) => (
            <div key={line.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  {line.status === 'running' && (
                    <Factory size={16} className="text-emerald bg-emerald/10" />
                  )}
                  {line.status === 'maintenance' && (
                    <Settings size={16} className="text-gold bg-gold/10" />
                  )}
                  {line.status === 'idle' && (
                    <Briefcase size={16} className="text-muted bg-bg-elevated" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-fog">{line.name}</h3>
                  <p className="text-xs text-muted">{line.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted">Progress</span>
                  <ProgressBar value={line.progress} color="emerald" className="w-[100px]" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted font-mono">{line.output}</p>
                  <Button variant={line.status === 'running' ? 'danger' : 'emerald'} size="xs" className="ml-2">
                    {line.status === 'running' ? 'Stop' : 'Start'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Factory Activity Marquee */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Factory size={14} className="text-gold" />
          <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Factory Feed</span>
        </div>
        <Marquee speed={25}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-2 bg-bg-elevated rounded-lg px-3 py-1.5 flex-shrink-0">
              <span className="text-xs text-fog">Factory #{Math.ceil(i / 2)} · </span>
              {i % 2 === 1 ? (
                <>
                  <span className="text-emerald">↑ Output +12%</span>
                  <span className="text-[10px] text-muted ml-1">· </span>
                </>
              ) : (
                <>
                  <span className="text-violet">↓ Temp -5°</span>
                  <span className="text-[10px] text-muted ml-1">· </span>
                </>
              )}
              <span className="text-[10px] text-muted">{new Date(Date.now() - i * 60000).toLocaleTimeString()}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}