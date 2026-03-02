import React, { useState, useCallback, useEffect } from 'react';
// The Sovereign Path: App.tsx and services/ are both in your root
import { generateOsintReport } from './services/geminiService';
import { ViewState, OsintReport } from './types';
import ReportView from './components/ReportView';

// Icons from Lucide for high-utility navigation
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
  Activity
} from 'lucide-react';

import { supabase } from './src/lib/supabase';
import AuthScreen from './components/AuthScreen';

const SUGGESTIONS = [
  "Nestlé", "BP", "Shein", "Monsanto (Bayer)", "Amazon", "Meta"
];

function App() {
  // --- AUTH & SYSTEM STATE ---
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'home' | 'history' | 'report'>('home');
  const [query, setQuery] = useState('');
  const [nodeStatus, setNodeStatus] = useState<'online' | 'offline'>('online');
  const [searchState, setSearchState] = useState<{
    isLoading: boolean;
    error: string | null;
    data: OsintReport | null;
  }>({
    isLoading: false,
    error: null,
    data: null,
  });

  // Forensic Ledger (Search History)
  const [history, setHistory] = useState<any[]>([]);

  // --- INITIALIZATION & HEARTBEAT ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchHistory();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchHistory();
    });

    const checkNode = () => setNodeStatus(navigator.onLine ? 'online' : 'offline');
    window.addEventListener('online', checkNode);
    window.addEventListener('offline', checkNode);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', checkNode);
      window.removeEventListener('offline', checkNode);
    };
  }, []);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('search_history')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setHistory(data);
  };

  // --- CORE SEARCH LOGIC ---
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setSearchState({ isLoading: true, error: null, data: null });
    setQuery(searchQuery);
    setView('report');

    try {
      // Pass your actual API key or retrieve from env
      const data = await generateOsintReport(searchQuery, "YOUR_API_KEY");
      
      // Save to Sovereign Ledger
      if (session?.user?.id) {
        await supabase.from('search_history').insert({
          user_id: session.user.id,
          query: searchQuery
        });
      }
      
      fetchHistory();
      setSearchState({ isLoading: false, error: null, data });
    } catch (err: any) {
      setSearchState({ isLoading: false, error: err.message, data: null });
    }
  }, [session]);

  const resetView = () => {
    setSearchState({ isLoading: false, error: null, data: null });
    setView('home');
    setQuery('');
  };

  // --- PROTECTED ROUTE CHECK ---
  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans overflow-x-hidden selection:bg-osint-accent selection:text-black">
      
      {/* --- COMMAND NAVIGATION --- */}
      <nav className="h-16 border-b border-osint-800 bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-50 sticky top-0 no-print">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={resetView}>
           <div className="relative">
              <Terminal className="w-6 h-6 text-[#00f0ff] group-hover:scale-110 transition-transform" />
              <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#050508] animate-pulse ${nodeStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
           </div>
           <span className="font-mono font-black text-xl tracking-tighter uppercase italic">
             GHOST<span className="text-[#00f0ff]">TRACER</span>
           </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('history')}
            className={`p-2 rounded-full transition-all ${view === 'history' ? 'text-[#00f0ff] bg-[#1c1c2e]/50' : 'text-gray-500 hover:text-white'}`}
            title="Forensic Ledger"
          >
            <History className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Export Dossier" onClick={() => window.print()}>
            <FileText className="w-5 h-5" />
          </button>

          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </nav>

      {/* --- MAIN OPERATIONAL AREA (Centered & Dropped 15px) --- */}
      <main className="flex-1 flex flex-col items-center relative pt-[15px]">
        
        {/* Sovereign Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 no-print" 
             style={{ 
               backgroundImage: 'linear-gradient(#1c1c2e 1px, transparent 1px), linear-gradient(90deg, #1c1c2e 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* CONTENT WRAPPER - CENTERED */}
        <div className="w-full max-w-7xl px-8 relative z-10 flex flex-col items-center">
          
          {/* 1. HOME VIEW */}
          {view === 'home' && (
            <div className="w-full max-w-4xl text-center py-24 animate-in fade-in zoom-in duration-700">
              <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">
                SEARCH THE <br/>
                <span className="text-[#00f0ff] italic drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">SHADOWS</span>
              </h1>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative mb-12 max-w-2xl mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter entity name (e.g. Nestlé)..."
                    className="w-full pl-14 pr-24 py-6 rounded-full bg-black border-2 border-[#1c1c2e] focus:border-[#00f0ff] focus:outline-none focus:ring-8 focus:ring-[#00f0ff]/5 text-xl transition-all placeholder:text-gray-800"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 w-6 h-6 group-focus-within:text-[#00f0ff] transition-colors" />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00f0ff] text-black px-8 py-3.5 rounded-full font-black uppercase text-xs hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Audit <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap justify-center gap-3">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => handleSearch(s)}
                    className="px-5 py-2.5 bg-[#0a0a0f] border border-[#1c1c2e] rounded-xl text-gray-500 text-sm font-bold hover:border-[#00f0ff] hover:text-white transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. HISTORY VIEW */}
          {view === 'history' && (
            <div className="w-full max-w-5xl py-12 animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-end mb-10 border-b-2 border-osint-800 pb-6">
                <div>
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Forensic <span className="text-[#00f0ff] italic">Ledger</span></h2>
                  <p className="text-[10px] text-gray-600 font-bold tracking-[0.3em] uppercase mt-2 flex items-center gap-2">
                    <Activity size={12} className="text-green-500" /> Node Records Synchronized
                  </p>
                </div>
                <button onClick={resetView} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-8 h-8" /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleSearch(item.query)}
                    className="bg-[#0a0a0f]/50 border border-[#1c1c2e] p-8 rounded-2xl hover:border-[#00f0ff] hover:shadow-[0_0_30px_rgba(0,240,255,0.05)] transition-all cursor-pointer group flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#00f0ff] transition-colors">{item.query}</h3>
                      <p className="text-[10px] text-gray-600 uppercase font-black mt-1">Investigation Logged: {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <ArrowRight className="text-[#1c1c2e] group-hover:text-[#00f0ff] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. REPORT VIEW */}
          {view === 'report' && (
            <div className="w-full flex flex-col items-center">
              {searchState.isLoading ? (
                <div className="py-48 flex flex-col items-center text-center">
                  <div className="relative mb-10">
                    <div className="w-20 h-20 border-4 border-[#1c1c2e] border-t-[#00f0ff] rounded-full animate-spin"></div>
                    <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#00f0ff] animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Analyzing {query}</h2>
                  <p className="text-gray-600 text-[10px] font-bold tracking-[0.5em] uppercase mt-2">Connecting to Sovereign Intelligence Nodes</p>
                </div>
              ) : searchState.error ? (
                <div className="py-32 flex flex-col items-center text-center max-w-xl">
                  <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 text-red-500">Node Failure</h3>
                  <p className="text-gray-400 font-mono mb-10 bg-red-500/5 p-4 border border-red-500/20 rounded-xl">{searchState.error}</p>
                  <button onClick={resetView} className="px-10 py-4 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-red-500 transition-all">Reset Console</button>
                </div>
              ) : searchState.data ? (
                <div className="w-full animate-in fade-in duration-1000">
                  <ReportView report={searchState.data} />
                </div>
              ) : null}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

export default App;