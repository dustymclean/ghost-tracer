import React from 'react';
import { X, Terminal, Shield, Cpu, Activity, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-osint-900 border border-osint-700 w-full max-w-2xl rounded-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-osint-800 bg-osint-800/50">
          <div className="flex items-center gap-2 text-osint-accent">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-lg font-mono font-bold tracking-wider uppercase">Field Manual // Protocols</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-gray-300 custom-scrollbar">
          
          <section className="space-y-3">
             <div className="flex items-center gap-2 text-white font-mono uppercase tracking-wide border-b border-osint-800 pb-2">
               <Terminal className="w-4 h-4 text-osint-accent" />
               <h3>System Overview</h3>
             </div>
             <p className="text-sm leading-relaxed">
               <strong className="text-white">GHOSTTRACE</strong> is an automated Open Source Intelligence (OSINT) aggregator powered by the Gemini 2.5 Flash model. 
               It leverages Google Search Grounding to scrape, analyze, and synthesize public data into actionable intelligence reports.
             </p>
          </section>

          <section className="space-y-3">
             <div className="flex items-center gap-2 text-white font-mono uppercase tracking-wide border-b border-osint-800 pb-2">
               <Cpu className="w-4 h-4 text-osint-accent" />
               <h3>Configuration & Access</h3>
             </div>
             <ol className="list-decimal list-inside space-y-2 text-sm">
               <li>
                 <span className="text-white font-bold">API Authorization:</span> Before operation, you must provide a valid Google Gemini API Key.
                 Click the <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-osint-800 border border-osint-600 rounded text-[10px] mx-1">SETTINGS</span> icon in the top right.
               </li>
               <li>
                 <span className="text-white font-bold">Key Storage:</span> Your key is stored locally in your browser's secure storage. It is never transmitted to our servers, only directly to Google's API endpoints.
               </li>
               <li>
                 <span className="text-white font-bold">Model:</span> The system defaults to <code>gemini-2.5-flash</code> for optimal speed and reasoning capabilities.
               </li>
             </ol>
          </section>

          <section className="space-y-3">
             <div className="flex items-center gap-2 text-white font-mono uppercase tracking-wide border-b border-osint-800 pb-2">
               <Activity className="w-4 h-4 text-osint-accent" />
               <h3>Operation Protocol</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-osint-800/50 p-3 rounded border border-osint-700">
                   <strong className="block text-white mb-1 font-mono text-xs text-osint-accent">STEP 01 // TARGET</strong>
                   Enter a target name (e.g., "John Doe Acme Corp") or a URL (LinkedIn profile, Company site) into the command console.
                </div>
                <div className="bg-osint-800/50 p-3 rounded border border-osint-700">
                   <strong className="block text-white mb-1 font-mono text-xs text-osint-accent">STEP 02 // EXECUTE</strong>
                   Click <span className="text-white font-bold">INITIALIZE</span>. The system will perform multiple search iterations to construct a profile.
                </div>
                <div className="bg-osint-800/50 p-3 rounded border border-osint-700">
                   <strong className="block text-white mb-1 font-mono text-xs text-osint-accent">STEP 03 // ANALYZE</strong>
                   Review the generated report, network graph, and timeline. Use the Print function for a hard copy.
                </div>
                <div className="bg-osint-800/50 p-3 rounded border border-osint-700">
                   <strong className="block text-white mb-1 font-mono text-xs text-osint-accent">STEP 04 // INTERROGATE</strong>
                   Use the <span className="text-white font-bold">ASK AI</span> chat module to ask specific questions about the gathered data.
                </div>
             </div>
          </section>

           <section className="space-y-3">
             <div className="flex items-center gap-2 text-white font-mono uppercase tracking-wide border-b border-osint-800 pb-2">
               <Shield className="w-4 h-4 text-osint-accent" />
               <h3>Disclaimer</h3>
             </div>
             <p className="text-xs text-gray-500 italic border-l-2 border-osint-600 pl-3">
               This tool is for educational and authorized research purposes only. The intelligence generated is based on publicly available data and probabilistic AI reasoning. Always verify critical information through primary sources.
             </p>
          </section>

        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-osint-accent to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default HelpModal;