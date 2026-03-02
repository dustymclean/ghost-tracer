import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (query: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onAnalyze(query);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-white">
            <span className="text-osint-accent">GHOST</span>TRACE
          </h1>
          <p className="text-osint-400 text-lg">
            Deep intelligence gathering & connection analysis.
            <br />
            Enter a name, company, or LinkedIn URL to begin trace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`w-5 h-5 transition-colors ${isLoading ? 'text-osint-accent' : 'text-gray-500 group-hover:text-gray-300'}`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="block w-full pl-12 pr-4 py-4 bg-osint-800 border border-osint-600 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-osint-accent focus:border-transparent transition-all shadow-lg text-lg font-mono disabled:opacity-50"
            placeholder="e.g. 'Jane Doe Acme Corp' or 'linkedin.com/in/...'"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 bg-osint-accent/10 hover:bg-osint-accent/20 text-osint-accent rounded-lg text-sm font-medium transition-colors disabled:opacity-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'INITIALIZE'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="space-y-2 font-mono text-xs text-osint-accent animate-pulse text-left w-full max-w-2xl mx-auto pl-2">
            <div>&gt; INITIALIZING PROTOCOLS...</div>
            <div>&gt; SEARCHING PUBLIC INDICES...</div>
            <div>&gt; ANALYZING DIGITAL FOOTPRINT...</div>
            <div>&gt; GENERATING RISK PROFILE...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;