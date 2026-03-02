import React, { useState, useCallback, useEffect } from 'react';
import { generateOsintReport } from './services/geminiService';
import { OsintReport } from './types';
import ReportView from './components/ReportView';

import { 
  History, 
  Settings, 
  LogOut, 
  X, 
  Search, 
  ArrowRight, 
  Terminal,
  AlertTriangle,
  FileText,
  Activity,
  Key,
  Info,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Cpu
} from 'lucide-react';

import { supabase } from './src/lib/supabase';
import AuthScreen from './components/AuthScreen';

function App() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'home' | 'history' | 'report'>('home');
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

  const saveKey = (key: string) => {
    localStorage.setItem('ghost_tracer_key', key);
    setUserApiKey(key);
    setShowSettings(false);
  };

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const activeKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!activeKey) {
      setSearchState({ isLoading: false, error: "Credentials Required: Please provide an API key in Settings.", data: null });
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
      
      {/* --- COMMAND NAVIGATION --- */}
      <nav className="h-16 border-b border-[#1c1c2e] bg-[#0a0a0f]/90 backdrop-blur-md flex items-center justify-between px-8 z-50 sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
           <Terminal className="w-6 h-6 text-[#00f0ff]" />
           <span className="font-mono font-black text-xl tracking-tighter uppercase italic">GHOST<span className="text-[#00f0ff]">TRACER</span></span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => setShowManual(true)} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#00f0ff] transition-colors uppercase tracking-widest">
            <BookOpen className="w-4 h-4" /> <span className="hidden md:inline">Operations Manual</span>
          </button>
          
          <div className="h-4 w-[1px] bg-[#1c1c2e] hidden md:block" />

          <button onClick={() => setView('history')} className="p-2 text-gray-500 hover:text-white"><History className="w-5 h-5" /></button>
          <button onClick={() => setShowSettings(true)} className={`p-2 transition-colors ${userApiKey ? 'text-[#00f0ff]' : 'text-gray-500 hover:text-white'}`}><Settings className="w-5 h-5" /></button>
          <button onClick={() => supabase.auth.signOut()} className="text-red-500 text-[10px] font-bold uppercase border border-red-500/30 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all">Log Out</button>
        </div>
      </nav>

      {/* --- OPERATIONS MANUAL MODAL --- */}
      {showManual && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-[#0a0a0f] border border-[#1c1c2e] p-10 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#0a0a0f] py-2 z-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-[#00f0ff]" /> Intelligence Protocol Manual
              </h3>
              <button onClick={() => setShowManual(false)}><X className="w-8 h-8 text-gray-500 hover:text-white" /></button>
            </div>

            <div className="prose prose-invert max-w-none font-sans space-y-8 text-gray-400">
              <section>
                <h4 className="text-[#00f0ff] font-black uppercase text-sm tracking-widest mb-2">01. Purpose</h4>
                <p>Ghost Tracer is a specialized **OSINT (Open Source Intelligence) Device** designed for corporate transparency. It leverages advanced LLM architecture to synthesize public records, news reports, and digital footprints into actionable dossiers.</p>
              </section>

              <section>
                <h4 className="text-[#00f0ff] font-black uppercase text-sm tracking-widest mb-2">02. Ethics & Use</h4>
                <p>This node is intended for **investigative journalism, due diligence, and ethical auditing**. Use this data to hold entities accountable, not for harassment or illicit activity. Information Symmetry is the goal.</p>
              </section>

              <section className="bg-[#1c1c2e]/30 p-6 rounded-2xl border border-[#1c1c2e]">
                <h4 className="text-white font-black uppercase text-sm tracking-widest mb-4">03. The Nexus Protocol</h4>
                <p className="text-sm italic">"Intelligence is not a destination; it is a web."</p>
                <p className="text-sm mt-2">Inside any report, you will see underlined entities. Clicking these will **re-initiate the audit** for that specific sub-entity. This allows you to trace parent companies, subsidiaries, and key individuals down the rabbit hole infinitely.</p>
              </section>

              <section>
                <h4 className="text-[#00f0ff] font-black uppercase text-sm tracking-widest mb-2">04. Data Privacy</h4>
                <p>Ghost Tracer stores your **Search History** and **Identity** in your private Sovereign Ledger (Supabase). Your **API Keys** never leave your local machine; they are stored in your browser's local cache for maximum security.</p>
              </section>
            </div>
            
            <button 
              onClick={() => setShowManual(false)}
              className="w-full mt-10 bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-[#00f0ff] transition-all"
            >Acknowledge Protocol</button>
          </div>
        </div>
      )}

      {/* --- SETTINGS MODAL --- */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0a0a0f] border border-[#1c1c2e] p-8 rounded-2xl shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                <Key className="w-5 h-5 text-[#00f0ff]" /> Node Credentials
              </h3>
              <button onClick={() => setShowSettings(false)}><X className="w-6 h-6 text-gray-500 hover:text-white" /></button>
            </div>

            <div className="bg-[#1c1c2e]/30 border border-[#00f0ff]/20 p-5 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-gray-300">
                  <p className="font-bold text-white mb-2 uppercase tracking-tighter">API Requirements:</p>
                  <p className="mb-4">Dusty makes no profit on API keys. They are required to power the AI. Obtain your free/paid key at:</p>
                  <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#00f0ff] font-bold hover:underline mb-4">Google AI Studio <ExternalLink className="w-3 h-3" /></a>
                  <p className="text-[10px] text-gray-500 italic">Free Tier: 15 RPM / Paid Tier: Higher Privacy & Limits.</p>
                </div>
              </div>
            </div>

            <input 
              type="password" 
              placeholder="PASTE_YOUR_API_KEY_HERE"
              className="w-full bg-black border border-[#1c1c2e] p-4 rounded-xl mb-6 text-[#00f0ff] font-mono focus:border-[#00f0ff] outline-none placeholder:text-gray-800"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
            />
            
            <button onClick={() => saveKey(userApiKey)} className="w-full bg-[#00f0ff] text-black font-black uppercase py-4 rounded-xl hover:bg-white transition-all">Initialize Node</button>
          </div>
        </div>
      )}

      {/* --- MAIN OPERATIONAL AREA --- */}
      <main className="flex-1 flex flex-col items-center relative pt-[15px]">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1c1c2e 1px, transparent 1px), linear-gradient(90deg, #1c1c2e 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="w-full max-w-7xl px-8 relative z-10 flex flex-col items-center">
          {view === 'home' && (
            <div className="w-full max-w-4xl text-center py-24 animate-in fade-in zoom-in duration-1000">
              <div className="mb-6 flex justify-center">
                <div className="px-4 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex items-center gap-2">
                   <Cpu className="w-3 h-3 text-[#00f0ff] animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">Node Status: Active</span>
                </div>
              </div>
              <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">SEARCH THE <br/><span className="text-[#00f0ff] italic drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">SHADOWS</span></h1>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative mb-12 max-w-2xl mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter entity name (e.g. Nestlé)..."
                    className="w-full pl-8 pr-24 py-6 rounded-full bg-black border-2 border-[#1c1c2e] focus:border-[#00f0ff] outline-none text-xl transition-all shadow-2xl"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00f0ff] text-black px-8 py-3.5 rounded-full font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all">Audit</button>
                </div>
              </form>
            </div>
          )}

          {view === 'report' && (
            <div className="w-full pb-20">
               {searchState.isLoading ? (
                 <div className="py-48 flex flex-col items-center text-center">
                    <div className="w-24 h-24 border-4 border-[#1c1c2e] border-t-[#00f0ff] rounded-full animate-spin mb-8 shadow-[0_0_20px_#00f0ff]"></div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Auditing {query}...</h2>
                    <p className="text-gray-600 font-mono text-xs uppercase mt-4 tracking-[0.5em]">Fetching Forensic Data</p>
                 </div>
               ) : searchState.error ? (
                 <div className="py-32 flex flex-col items-center text-center max-w-xl mx-auto">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                    <h3 className="text-3xl font-black text-red-500 uppercase mb-4 tracking-tighter">Node Failure</h3>
                    <p className="text-gray-400 font-mono mb-10 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-sm">{searchState.error}</p>
                    <button onClick={() => setView('home')} className="px-10 py-4 bg-white text-black font-black uppercase rounded-full hover:bg-red-500 hover:text-white transition-all">Reset Console</button>
                 </div>
               ) : searchState.data ? (
                 <ReportView report={searchState.data} onEntityClick={handleSearch} />
               ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
