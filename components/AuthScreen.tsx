import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { Terminal, Lock, Cpu, Shield } from 'lucide-react';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setLoading(true);
    const { error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#1c1c2e 1px, transparent 1px), linear-gradient(90deg, #1c1c2e 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
           <div className="inline-block p-4 rounded-3xl bg-[#0a0a0f] border border-[#1c1c2e] mb-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <Terminal className="w-12 h-12 text-[#00f0ff]" />
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic mb-2">GHOST<span className="text-[#00f0ff]">TRACER</span></h1>
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">Sovereign Node v1.0.4</p>
        </div>

        <div className="bg-[#0a0a0f] border border-[#1c1c2e] p-10 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#00f0ff] uppercase tracking-widest mb-8">
            <Lock className="w-3 h-3" /> Authorization Required
          </div>
          
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="OPERATOR_EMAIL"
              className="w-full bg-black border border-[#1c1c2e] p-5 rounded-2xl text-white font-mono focus:border-[#00f0ff] outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="SECRET_ACCESS_CODE"
              className="w-full bg-black border border-[#1c1c2e] p-5 rounded-2xl text-white font-mono focus:border-[#00f0ff] outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && <p className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{message}</p>}

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button onClick={() => handleAuth('LOGIN')} disabled={loading} className="bg-[#00f0ff] text-black font-black uppercase py-4 rounded-2xl hover:bg-white transition-all text-xs">Initialize Session</button>
            <button onClick={() => handleAuth('SIGNUP')} disabled={loading} className="border border-[#1c1c2e] text-white font-black uppercase py-4 rounded-2xl hover:bg-[#1c1c2e] transition-all text-xs">Create Node</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
