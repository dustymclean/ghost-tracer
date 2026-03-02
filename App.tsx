import React, { useState, useCallback, useEffect } from 'react';
import { generateOsintReport } from './services/openRouterService';
import { OsintReport } from './types';
import ReportView from './components/ReportView';
import { Terminal, Settings, Info, BookOpen, Key, X, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { supabase } from './src/lib/supabase';
import AuthScreen from './components/AuthScreen';

function App() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'home' | 'report'>('home');
  const [query, setQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('ghost_tracer_key') || '');
  const [searchState, setSearchState] = useState<{ isLoading: boolean; error: string | null; data: OsintReport | null }>({ isLoading: false, error: null, data: null });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setSearchState({ isLoading: true, error: null, data: null });
    setQuery(searchQuery);
    setView('report');

    try {
      const data = await generateOsintReport(searchQuery, userApiKey);
      setSearchState({ isLoading: false, error: null, data });
    } catch (err: any) {
      setSearchState({ isLoading: false, error: err.message, data: null });
    }
  }, [userApiKey]);

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans selection:bg-[#00f0ff] selection:text-black">
      <nav className="h-16 border-b border-[#1c1c2e] bg-[#0a0a0f]/90 flex items-center justify-between px-8 z-50 sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
           <Terminal className="w-6 h-6 text-[#00f0ff]" />
           <span className="font-mono font-black text-xl italic uppercase">GHOST<span className="text-[#00f0ff]">TRACER</span></span>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => setShowManual(true)} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#00f0ff] uppercase tracking-widest"><BookOpen className="w-4 h-4" /> Operations Manual</button>
          <button onClick={() => setShowSettings(true)} className={`p-2 transition-colors ${userApiKey ? 'text-[#00f0ff]' : 'text-gray-500 hover:text-white'}`}><Settings className="w-5 h-5" /></button>
          <button onClick={() => supabase.auth.signOut()} className="text-red-500 text-[10px] font-bold uppercase border border-red-500/30 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white">Log Out</button>
        </div>
      </nav>

      {showManual && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-[#1c1c2e] p-10 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3"><ShieldCheck className="w-7 h-7 text-[#00f0ff]" /> Protocol Manual</h3>
              <button onClick={() => setShowManual(false)}><X className="w-8 h-8 text-gray-500" /></button>
            </div>
            <div className="space-y-6 text-sm text-gray-400">
              <p><strong>01. Logic:</strong> Ghost Tracer uses Claude 3.5 via OpenRouter for forensic auditing.</p>
              <p><strong>02. Sovereignty:</strong> Credits are managed via your OpenRouter account. Ensure you have a positive balance to avoid "Audit Interrupted" errors.</p>
              <p><strong>03. Ethics:</strong> Use for investigative research and accountability.</p>
            </div>
            <button onClick={() => setShowManual(false)} className="w-full mt-10 bg-[#00f0ff] text-black font-black uppercase py-4 rounded-xl">Acknowledge</button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0f] border border-[#1c1c2e] p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase flex items-center gap-2"><Key className="w-5 h-5 text-[#00f0ff]" /> API Configuration</h3>
              <button onClick={() => setShowSettings(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <div className="bg-[#1c1c2e]/30 p-5 rounded-xl mb-6 text-xs text-gray-300">
               <p className="mb-4 text-white font-bold tracking-widest uppercase text-[10px]">OpenRouter Required:</p>
               <p className="mb-4 leading-relaxed">Ensure your OpenRouter account has a credit balance. If you hit a "Credit Limit" error, visit your settings to top up.</p>
               <a href="https://openrouter.ai/settings/credits" target="_blank" className="text-[#00f0ff] font-bold hover:underline flex items-center gap-2 uppercase tracking-tighter">Manage Credits <ExternalLink className="w-3 h-3" /></a>
            </div>
            <input type="password" placeholder="sk-or-v1-..." className="w-full bg-black border border-[#1c1c2e] p-4 rounded-xl mb-6 text-[#00f0ff] font-mono outline-none" value={userApiKey} onChange={(e) => setUserApiKey(e.target.value)} />
            <button onClick={() => { localStorage.setItem('ghost_tracer_key', userApiKey); setShowSettings(false); }} className="w-full bg-[#00f0ff] text-black font-black uppercase py-4 rounded-xl">Initialize Node</button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center pt-[15px]">
        {view === 'home' ? (
          <div className="w-full max-w-3xl text-center py-32 animate-in fade-in duration-1000">
            <h1 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter italic uppercase">SEARCH THE <br/><span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">SHADOWS</span></h1>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative max-w-2xl mx-auto px-4">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter target name..." className="w-full pl-8 pr-24 py-6 rounded-full bg-black border-2 border-[#1c1c2e] focus:border-[#00f0ff] outline-none text-xl shadow-2xl" />
              <button type="submit" className="absolute right-7 top-1/2 -translate-y-1/2 bg-[#00f0ff] text-black px-8 py-3.5 rounded-full font-black uppercase text-xs">Audit</button>
            </form>
          </div>
        ) : (
          <div className="w-full pb-20 px-8">
             {searchState.isLoading ? (
               <div className="py-48 flex flex-col items-center text-center">
                  <div className="w-24 h-24 border-4 border-[#1c1c2e] border-t-[#00f0ff] rounded-full animate-spin mb-8 shadow-[0_0_20px_#00f0ff]"></div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">Auditing {query}...</h2>
               </div>
             ) : searchState.error ? (
               <div className="py-32 flex flex-col items-center text-center max-w-xl mx-auto">
                  <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                  <h3 className="text-3xl font-black text-red-500 uppercase mb-4 tracking-tighter text-center">Audit Interrupted</h3>
                  <p className="text-gray-400 font-mono mb-10 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-xs leading-relaxed">{searchState.error}</p>
                  <button onClick={() => setView('home')} className="px-10 py-4 bg-white text-black font-black uppercase rounded-full hover:bg-red-500 hover:text-white transition-all">Reset Console</button>
               </div>
             ) : searchState.data && <ReportView report={searchState.data} onEntityClick={handleSearch} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
