import React from 'react';
import { OsintReport, EntityType } from '../types';
import { ShieldAlert, Fingerprint, Activity, Link as LinkIcon, ExternalLink, Calendar, TrendingUp, TrendingDown, Minus, Printer } from 'lucide-react';

interface ReportViewProps {
  report: OsintReport;
  onEntityClick?: (name: string) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onEntityClick }) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1c1c2e] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-2 py-0.5 text-xs font-mono rounded border border-blue-500 text-blue-400">
               {report.entityType.toUpperCase()}
             </div>
             <div className="px-2 py-0.5 text-xs font-mono rounded border border-[#1c1c2e] text-gray-500">
               CONFIDENCE: {report.confidenceScore}%
             </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{report.targetName}</h1>
        </div>
        <button onClick={() => window.print()} className="p-3 bg-[#0a0a0f] border border-[#1c1c2e] rounded-full text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all">
          <Printer className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0a0f] border border-[#1c1c2e] p-8 rounded-2xl">
            <h3 className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Intelligence Summary</h3>
            <p className="text-gray-300 leading-relaxed text-lg italic font-light">"{report.summary}"</p>
          </div>
          
          <div className="bg-[#0a0a0f] border border-[#1c1c2e] p-6 rounded-2xl">
            <h3 className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest mb-4">Nexus Nodes (Click to Audit)</h3>
            <div className="flex flex-wrap gap-2">
              {report.connections.map((conn, idx) => (
                <button 
                  key={idx} 
                  onClick={() => onEntityClick?.(conn.name)}
                  className="px-4 py-2 bg-black border border-[#1c1c2e] rounded-lg text-xs font-bold text-gray-400 hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all"
                >
                  {conn.name} <span className="opacity-30">| {conn.roleOrRelation}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-black border border-red-900/30 p-6 rounded-2xl">
          <h3 className="text-red-500 font-mono text-xs uppercase mb-6 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Risk Assessment</h3>
          <ul className="space-y-4">
            {report.riskFactors.map((risk, idx) => (
              <li key={idx} className="text-sm font-bold text-red-400 flex gap-2">
                <span className="text-red-600">!!</span> {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
