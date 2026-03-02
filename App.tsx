import React, { useState, useCallback, useEffect } from 'react';
import { generateOsintReport } from './services/geminiService';
import { OsintReport, ViewState } from './types';
import ReportView from './components/ReportView';
import { Terminal, Settings, LogOut, Info, BookOpen, Key, X, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { supabase } from './src/lib/supabase';
import AuthScreen from './components/AuthScreen';

function App() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'home' | 'report'>('home');
  const [query, setQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('ghost_tracer_key') || '');
  
  const [searchState, setSearchState] = useState<{
    isLoading: boolean;
    error: string | null;
    data: OsintReport | null;
  }>({ isLoading: false, error: null, data: null });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const activeKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!activeKey) {
      setSearchState({ isLoading: false, error: "Credentials Required: Provide an API key in Settings.", data: null });
      setView('report');
      return;
    }

    setSearchState({ isLoading: true, error: null, data: null });
    setQuery(searchQuery);
    setView('report');

    try {
      const data = await generateOsintReport(searchQuery, activeKey);
      setSearchState({ isLoading: false, error: null, data });
    } catch (err: any) {
      setSearchState({ isLoading: false, error: err.message, data: null });
    }
  }, [userApiKey]);

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#00f0ff] selection:text-black">
      
      {/* Navigation */}
      <nav className="h-16 border-b border-[#1c1c2e] bg-[#0a0a0f]/90 backdrop-blur-md flex items-center justify-between px-8 z-50 sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
           <Terminal className="w-6 h-6 text-[#00f0ff]" />
           <span className="font-mono font-black text-xl tracking-tighter uppercase italic text-white">GHOST<span className="text-[#00f0ff]">TRACER</span></span>
        </div>
        
        <div className="flex items-center gap-8">
          <button onClick={() => setShowManual(true)} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#00f0ff] transition-colors uppercase tracking-widest">
            <BookOpen className="w-4 h-4" /> Operations Manual
          </button>
          <button onClick={() => setShowSettings(true)} className={`p-2 transition-colors ${userApiKey ? 'text-[#00f0ff]' : 'text-gray-500 hover:text-white'}`}><Settings className="w-5 h-5" /></button>
          <button onClick={() => supabase.auth.signOut()} className="text-red-500 text-[10px] font-bold uppercase border border-red-500/30 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Log Out</button>
        </div>
      </nav>

      {/* Manual Modal */}
      {showManual && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-[#1c1c2e] p-10 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-[#00f0ff]" /> Intelligence Protocol
              </h3>
              <button onClick={() => setShowManual(false)}><X className="w-8 h-8 text-gray-500 hover:text-white" /></button>
            </div>
            <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
              <p><strong className="text-white uppercase tracking-widest">01. The Mission:</strong> Ghost Tracer is an OSINT device designed for corporate transparency. Use it to map digital footprints and hold entities accountable.</p>
              <p><strong className="text-white uppercase tracking-widest">02. Nexus Protocol:</strong> Every report features interconnected nodes. Clicking a name in the "Network Nodes" section will instantly re-initiate an audit on that target.</p>
              <p><strong className="text-white uppercase tracking-widest">03. Ethics:</strong> This node is for forensic auditing and investigative research. Use ethically and responsibly.</p>
            </div>
            <button onClick={() => setShowManual(false)} className="w-full mt-10 bg-[#00f0ff] text-black font-black uppercase py-4 rounded-xl">Acknowledge Protocol</button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0f] border border-[#1c1c2e] p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2"><Key className="w-5 h-5 text-[#00f0ff]" /> Credentials</h3>
              <button onClick={() => setShowSettings(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <div className="bg-[#1c1c2e]/30 p-5 rounded-xl mb-6 text-xs text-gray-300">
               <p className="mb-4">Obtain your API Key from Google AI Studio. Free versions are supported.</p>
               <a href="https://aistudio.google.com/" target="_blank" className="text-[#00f0ff] font-bold hover:underline flex items-center gap-2">Gemini AI Studio <ExternalLink className="w-3 h-3" /></a>
            </div>
            <input 
              type="password" 
              placeholder="PASTE_API_KEY_HERE"
              className="w-full bg-black border border-[#1c1c2e] p-4 rounded-xl mb-6 text-[#00f0ff] font-mono outline-none"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
            />
            <button 
              onClick={() => { localStorage.setItem('ghost_tracer_key', userApiKey); setShowSettings(false); }}
              className="w-full bg-[#00f0ff] text-black font-black uppercase py-4 rounded-xl"
            >Initialize Node</button>
          </div>
        </div>
      )}

      {/* Main Area */}
      <main className="flex-1 flex flex-col items-center relative pt-[15px]">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1c1c2e 1px, transparent 1px), linear-gradient(90deg, #1c1c2e 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="w-full max-w-7xl px-8 relative z-10 flex flex-col items-center">
          {view === 'home' ? (
            <div className="w-full max-w-3xl text-center py-32">
              <h1 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-none italic uppercase">SEARCH THE <br/><span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">SHADOWS</span></h1>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter target entity..."
                  className="w-full pl-8 pr-24 py-6 rounded-full bg-black border-2 border-[#1c1c2e] focus:border-[#00f0ff] outline-none text-xl transition-all shadow-2xl"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00f0ff] text-black px-8 py-3.5 rounded-full font-black uppercase text-xs">Audit</button>
              </form>
            </div>
          ) : (
            <div className="w-full pb-20">
               {searchState.isLoading ? (
                 <div className="py-48 flex flex-col items-center text-center">
                    <div className="w-24 h-24 border-4 border-[#1c1c2e] border-t-[#00f0ff] rounded-full animate-spin mb-8 shadow-[0_0_20px_#00f0ff]"></div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Auditing {query}...</h2>
                 </div>
               ) : searchState.error ? (
                 <div className="py-32 flex flex-col items-center text-center max-w-xl mx-auto">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                    <h3 className="text-3xl font-black text-red-500 uppercase mb-4 tracking-tighter">Node Failure</h3>
                    <p className="text-gray-400 font-mono mb-10 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-sm">{searchState.error}</p>
                    <button onClick={() => setView('home')} className="px-10 py-4 bg-white text-black font-black uppercase rounded-full">Reset</button>
                 </div>
               ) : searchState.data && <ReportView report={searchState.data} onEntityClick={handleSearch} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
