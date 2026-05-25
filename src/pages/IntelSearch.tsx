import { useState } from 'react';
import { useStore } from '../store';
import { Button, Input } from '../components/ui';
import { Search, FileText, ClipboardList, Brain, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { MagicCard } from '../components/magic-ui/MagicCard';
import { NumberTicker } from '../components/magic-ui/NumberTicker';
import { Marquee } from '../components/magic-ui/Marquee';

export default function IntelSearchPage() {
  const { transcript } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Array<{id: string; text: string; timestamp: string}>>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Simple search in transcript (for demo)
    const lines = transcript.split('\n').filter(line => line.toLowerCase().includes(searchQuery.toLowerCase()));
    const mapped = lines.map((line, i) => ({
      id: `result-${i}`,
      text: line,
      timestamp: new Date().toLocaleTimeString()
    }));
    setResults(mapped);
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const charCount = transcript.length;
  const lineCount = transcript.split('\n').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-fog">Intel & Search</h1>
          <p className="text-xs text-muted mt-0.5">Search through transcripts and notes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MagicCard className="flex flex-col items-center p-4">
          <NumberTicker value={wordCount} suffix="words" className="mb-2" />
          <p className="text-xs text-muted">Words</p>
        </MagicCard>
        <MagicCard className="flex flex-col items-center p-4">
          <NumberTicker value={charCount} suffix="chars" className="mb-2" />
          <p className="text-xs text-muted">Characters</p>
        </MagicCard>
        <MagicCard className="flex flex-col items-center p-4">
          <NumberTicker value={lineCount} suffix="lines" className="mb-2" />
          <p className="text-xs text-muted">Lines</p>
        </MagicCard>
        <MagicCard className="flex flex-col items-center p-4">
          <NumberTicker value={results.length} suffix="results" className="mb-2" />
          <p className="text-xs text-muted">Search Results</p>
        </MagicCard>
        <MagicCard className="flex flex-col items-center p-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-emerald" />
            <span className="text-sm font-medium text-fog">Live Intel</span>
          </div>
          <p className="text-xs text-muted mt-1">Ready for analysis</p>
        </MagicCard>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search transcripts..."
            className="pl-8"
          />
        </div>
        <Button variant="emerald" onClick={handleSearch}>
          <Search size={14} /> Search
        </Button>
        <Button variant="outline" onClick={() => setSearchQuery('')}>
          Clear
        </Button>
      </div>

      {/* Results */}
      <div className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-fog">Search Results</h2>
          {results.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setResults([])}>
              Clear Results
            </Button>
          )}
        </div>
        {results.length === 0 ? (
          <p className="text-center text-muted py-8">Enter a search term to see results here.</p>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="flex items-start gap-3 p-3 bg-bg-base border rounded-lg">
                <div className="flex-shrink-0">
                  <FileText size={14} className="text-emerald/40" />
                </div>
                <div className="flex-1">
                  <p className="text-fog/90 whitespace-pre-wrap">{result.text}</p>
                  <p className="text-[10px] text-muted mt-1">
                    <Clock size={9} className="inline mr-1" /> {result.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Marquee */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={14} className="text-gold" />
          <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Recent Intel Feed</span>
        </div>
        <Marquee speed={20}>
          {/* Simulate some recent intel items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 bg-bg-elevated rounded-lg px-3 py-1.5 flex-shrink-0">
              <span className="text-xs text-fog">Intel update #{i} · </span>
              <span className="text-xs text-emerald">New pattern detected</span>
              <span className="text-[10px] text-muted">· {new Date(Date.now() - i * 300000).toLocaleTimeString()}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}