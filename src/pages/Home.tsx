import { useStore } from '../store';
import { Button, Card } from '../components/ui';
import { Mic, MicOff, Activity, CheckCircle2, Zap, Layers, FileText, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const activityFeed = [
  { id: 1, text: 'CRM Invoice page pushed to review', time: '2 min ago', color: 'text-emerald' },
  { id: 2, text: 'New asset "cutty-logo.png" uploaded', time: '15 min ago', color: 'text-violet' },
  { id: 3, text: 'Newsletter cron executed successfully', time: '1h ago', color: 'text-gold' },
  { id: 4, text: 'Pipeline scoring model updated', time: '3h ago', color: 'text-emerald' },
  { id: 5, text: 'FieldMode backlog triage completed', time: '5h ago', color: 'text-fog' },
];

export default function HomePage() {
  const { transcript, setTranscript, isListening, setIsListening, projects, assets } = useStore();

  const activeCount = projects.filter((p) => p.status === 'in-progress').length;
  const completedCount = projects.filter((p) => p.status === 'done').length;
  const assetCount = assets.length;
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      const msg = (transcript ? '\n' : '') + '[Transcription started — listening...]';
      setTranscript(transcript + msg);
    } else {
      setIsListening(false);
      setTranscript(transcript + '\n[Transcription stopped]');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-gold/80 to-gold/60 bg-clip-text text-transparent">
          Flynn Clan Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">Welcome back. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Zap size={18} />} label="Active Projects" value={activeCount} accent="emerald" />
        <StatCard icon={<CheckCircle2 size={18} />} label="Completed" value={completedCount} accent="gold" />
        <StatCard icon={<Layers size={18} />} label="Total Assets" value={assetCount} accent="violet" />
        <StatCard icon={<FileText size={18} />} label="Transcription" value={wordCount} accent="fog" suffix="words" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic size={16} className="text-gold" />
              <h2 className="text-sm font-semibold text-fog">Live Transcription</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">{wordCount} words · {transcript.length} chars</span>
              <Button variant={isListening ? 'danger' : 'emerald'} size="sm" onClick={toggleMic} className={cn(isListening && 'animate-pulse-glow')}>
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                {isListening ? 'Stop' : 'Start'}
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-[200px] max-h-[300px] bg-bg-base border border-border rounded-lg p-4 overflow-y-auto font-mono text-sm">
            {isListening && (
              <div className="flex items-center gap-2 text-emerald text-xs mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                Listening...
              </div>
            )}
            {transcript ? (
              <pre className="whitespace-pre-wrap text-fog/80 text-xs leading-relaxed font-mono">{transcript}</pre>
            ) : (
              <p className="text-muted text-xs">Press Start to begin transcription. Speech will appear here in real-time.</p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={16} className="text-emerald" />
            <h2 className="text-sm font-semibold text-fog">Recent Activity</h2>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {activityFeed.map((item, i) => (
              <div key={item.id} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', item.color.replace('text-', 'bg-'))} />
                <div className="min-w-0">
                  <p className="text-xs text-fog/80 leading-snug">{item.text}</p>
                  <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
                    <Clock size={9} />
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, suffix }: {
  icon: React.ReactNode; label: string; value: number;
  accent: 'emerald' | 'gold' | 'violet' | 'fog'; suffix?: string;
}) {
  const colorMap = {
    emerald: 'text-emerald bg-emerald/10 border-emerald/20',
    gold: 'text-gold bg-gold/10 border-gold/20',
    violet: 'text-violet bg-violet/10 border-violet/20',
    fog: 'text-fog bg-bg-elevated border-border',
  };
  const iconColor = { emerald: 'text-emerald', gold: 'text-gold', violet: 'text-violet', fog: 'text-fog/60' };
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={cn('p-2 rounded-lg border', colorMap[accent])}>
          <span className={iconColor[accent]}>{icon}</span>
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-fog">
          {value}{suffix && <span className="text-xs text-muted ml-1 font-normal">{suffix}</span>}
        </p>
        <p className="text-[11px] text-muted mt-0.5">{label}</p>
      </div>
    </Card>
  );
}
