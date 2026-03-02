import React from 'react';
import { OsintReport, EntityType } from '../types';
import { ShieldAlert, Fingerprint, Activity, Link as LinkIcon, Printer } from 'lucide-react';

interface ReportViewProps {
  report: OsintReport;
  onEntityClick?: (name: string) => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onEntityClick }) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic">{report.targetName}</h1>
          <span className="text-[10px] text-[#00f0ff] font-mono tracking-widest uppercase">Confidence: {report.confidenceScore}%</span>
        </div>
        <button onClick={() => window.print()} className="p-3 bg-gray-900 rounded-full text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all">
          <Printer className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl">
            <h3 className="text-[#00f0ff] font-mono text-xs mb-4 uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4" /> Summary</h3>
            <p className="text-gray-300 italic">"{report.summary}"</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <h3 className="text-[#00f0ff] font-mono text-xs mb-4 uppercase">Nexus Nodes (Click to Audit)</h3>
            <div className="flex flex-wrap gap-2">
              {report.connections.map((conn, idx) => (
                <button 
                  key={idx} 
                  onClick={() => onEntityClick?.(conn.name)}
                  className="px-4 py-2 bg-black border border-gray-800 rounded-lg text-sm text-gray-400 hover:border-[#00f0ff] hover:text-[#00f0ff] transition-all"
                >
                  {conn.name} <span className="opacity-30">| {conn.roleOrRelation}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-black border border-red-900/30 p-6 rounded-2xl">
          <h3 className="text-red-500 font-mono text-xs mb-6 uppercase flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Risk Factors</h3>
          <ul className="space-y-4">
            {report.riskFactors.map((risk, idx) => (
              <li key={idx} className="text-sm font-bold text-red-400">!! {risk}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
