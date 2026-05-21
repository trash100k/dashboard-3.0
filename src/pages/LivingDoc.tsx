import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui';
import { Mic, MicOff, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LivingDocPage() {
  const { transcript, setTranscript, isListening, setIsListening } = useStore();
  const [notes, setNotes] = useState(() => {
    try { return localStorage.getItem('dash-notes') || ''; } catch { return ''; }
  });
  const [elapsed, setElapsed] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => { localStorage.setItem('dash-notes', notes); }, 500);
    return () => clearTimeout(timer);
  }, [notes]);

  useEffect(() => {
    if (!isListening) return;
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next > 0 && next % 30 === 0) {
          const ts = `[${formatTime(next)}] --- checkpoint ---\n`;
          setTranscript(transcript + ts);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isListening, transcript, setTranscript]);

  useEffect(() => { if (!isListening) setElapsed(0); }, [isListening]);

  useEffect(() => {
    if (transcriptRef.current) { transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight; }
  }, [transcript]);

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      const startMsg = transcript ? '\n--- Session started ---\n' : '--- Session started ---\n';
      setTranscript(transcript + startMsg);
    } else {
      setIsListening(false);
      setTranscript(transcript + '\n--- Session ended ---\n');
    }
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-fog">Living Doc</h1>
          <p className="text-xs text-muted mt-0.5">Transcription + notes side by side</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">{wordCount} words · {formatTime(elapsed)}</span>
          <Button variant={isListening ? 'danger' : 'emerald'} size="sm" onClick={toggleMic} className={cn(isListening && 'animate-pulse-glow')}>
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            {isListening ? 'Stop' : 'Start'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <Mic size={14} className="text-gold" />
            <span className="text-xs font-semibold text-fog">Transcription</span>
            {isListening && <span className="flex items-center gap-1 text-[10px] text-emerald ml-auto"><span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />Live</span>}
          </div>
          <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
            {transcript ? (
              <pre className="whitespace-pre-wrap text-fog/70">{transcript}</pre>
            ) : (
              <p className="text-muted">Press Start to begin. Transcription will appear here with auto-timestamp annotations every 30 seconds.</p>
            )}
          </div>
        </div>

        <div className="w-px bg-border flex-shrink-0" />

        <div className="flex-1 bg-bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <Clock size={14} className="text-emerald" />
            <span className="text-xs font-semibold text-fog">Notes</span>
            <span className="text-[10px] text-muted ml-auto">Auto-saved</span>
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Jot down thoughts, action items, or summaries here..."
            className="flex-1 bg-transparent p-4 text-sm text-fog/80 placeholder:text-muted resize-none focus:outline-none leading-relaxed" />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
