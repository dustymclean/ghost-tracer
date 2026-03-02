import React from 'react';
import { OsintReport, EntityType } from '../types';
import { ShieldAlert, Fingerprint, Activity, Link as LinkIcon, ExternalLink, Calendar, TrendingUp, TrendingDown, Minus, Printer } from 'lucide-react';
import NetworkGraph from './NetworkGraph';

interface ReportViewProps {
  report: OsintReport;
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  
  const getRiskColor = (factor: string) => {
    if (factor.toLowerCase().includes('critical') || factor.toLowerCase().includes('high')) return 'text-red-500';
    if (factor.toLowerCase().includes('medium')) return 'text-orange-400';
    return 'text-yellow-300';
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>OSINT Report - ${report.targetName}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: #111; padding: 40px; max-width: 900px; margin: 0 auto; line-height: 1.5; background: white; }
            .branding-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; text-transform: uppercase; font-style: italic; letter-spacing: -1px; }
            .logo span { color: #0066cc; }
            h1 { border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 5px; font-size: 28px; letter-spacing: -1px; }
            .header-meta { margin-bottom: 40px; font-size: 13px; font-weight: bold; color: #444; display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            h2 { margin-top: 30px; font-size: 16px; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 15px; letter-spacing: 1px; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .risk-item { color: #b91c1c; font-weight: 500; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
            th { text-align: left; border-bottom: 2px solid #000; padding: 8px 4px; text-transform: uppercase; font-size: 11px; }
            td { text-align: left; padding: 8px 4px; border-bottom: 1px solid #ddd; vertical-align: top; }
            ul { margin: 0; padding-left: 20px; }
            li { margin-bottom: 5px; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10px; text-align: center; color: #666; text-transform: uppercase; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="branding-header">
            <div class="logo">GHOST<span>TRACER</span></div>
            <div style="text-align: right; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666;">
              Verified Forensic Intelligence Dossier
            </div>
          </div>

          <h1>CONFIDENTIAL // INTELLIGENCE REPORT</h1>
          <div class="header-meta">
            <div>
              TARGET: ${report.targetName}<br/>
              TYPE: ${report.entityType.toUpperCase()}<br/>
              CONFIDENCE: ${report.confidenceScore}%
            </div>
            <div style="text-align: right;">
              DATE: ${new Date().toLocaleDateString().toUpperCase()}<br/>
              REF: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>

          <div class="section">
            <h2>01 // Executive Summary</h2>
            <p>${report.summary}</p>
          </div>

          <div class="section">
            <h2>02 // Key Identifiers</h2>
            <table>
              ${report.keyStats.map(stat => `<tr><td width="40%"><strong>${stat.label}</strong></td><td>${stat.value}</td></tr>`).join('')}
            </table>
          </div>

          <div class="section">
             <h2>03 // Risk Assessment</h2>
             <ul>
               ${report.riskFactors.map(risk => `<li class="risk-item">${risk}</li>`).join('')}
             </ul>
          </div>

          <div class="section">
            <h2>04 // Chronological Timeline</h2>
            <table>
              <tr><th width="15%">Date</th><th>Event</th></tr>
              ${report.timeline.map(t => `<tr><td><strong>${t.date}</strong></td><td>${t.event}</td></tr>`).join('')}
            </table>
          </div>

          <div class="section">
            <h2>05 // Network Connections</h2>
            <table>
               <thead><tr><th>Name</th><th>Relation</th><th>Strength</th></tr></thead>
               <tbody>
                 ${report.connections.map(c => `<tr><td>${c.name}</td><td>${c.roleOrRelation}</td><td>${c.strength}/10</td></tr>`).join('')}
               </tbody>
            </table>
          </div>

          <div class="section">
            <h2>06 // Digital Footprint</h2>
            <ul>
              ${report.digitalFootprint.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <h2>07 // Sources</h2>
            <ul>
              ${report.sources.map(s => `<li><a href="${s}">${s}</a></li>`).join('')}
            </ul>
          </div>

          <div class="footer">
             Generated by GhostTrace OSINT Analyzer &bull; Internal Use Only &bull; ${new Date().toISOString()}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-osint-700 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className={`px-2 py-0.5 text-xs font-mono rounded border ${report.entityType === EntityType.COMPANY ? 'border-blue-500 text-blue-400' : 'border-purple-500 text-purple-400'}`}>
               {report.entityType.toUpperCase()}
             </div>
             <div className="px-2 py-0.5 text-xs font-mono rounded border border-osint-600 text-osint-400">
               CONFIDENCE: {report.confidenceScore}%
             </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{report.targetName}</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="p-2 bg-osint-800 hover:bg-osint-700 rounded-full text-osint-400 hover:text-white transition-colors"
            title="Print Branded Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          {report.sources.slice(0, 3).map((source, idx) => (
            <a key={idx} href={source} target="_blank" rel="noopener noreferrer" className="p-2 bg-osint-800 hover:bg-osint-700 rounded-full text-osint-400 hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-osint-800/50 border border-osint-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-osint-accent font-mono text-sm uppercase mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Executive Summary
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{report.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-osint-800/50 border border-osint-700 rounded-xl p-6">
              <h3 className="text-osint-accent font-mono text-sm uppercase mb-4 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" /> Key Identifiers
              </h3>
              <div className="space-y-4">
                {report.keyStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-osint-700/50 pb-2 last:border-0">
                    <span className="text-gray-400 text-sm">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{stat.value}</span>
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
                      {stat.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                      {stat.trend === 'neutral' && <Minus className="w-3 h-3 text-gray-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-osint-800/50 border border-osint-700 rounded-xl p-6 max-h-[300px] overflow-y-auto">
              <h3 className="text-osint-accent font-mono text-sm uppercase mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Chronology
              </h3>
              <div className="relative border-l border-osint-700 ml-2 space-y-6">
                {report.timeline.map((item, idx) => (
                  <div key={idx} className="ml-6 relative">
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-osint-600 border border-osint-500"></div>
                    <time className="block text-xs font-mono text-osint-accent mb-1">{item.date}</time>
                    <p className="text-sm text-gray-300">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
           
           <NetworkGraph centerNode={report.targetName} connections={report.connections} />
        </div>

        <div className="space-y-6">
          <div className="bg-osint-900 border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="w-24 h-24 text-red-500" />
            </div>
            <h3 className="text-red-400 font-mono text-sm uppercase mb-4 flex items-center gap-2 relative z-10">
              <ShieldAlert className="w-4 h-4" /> Risk Assessment
            </h3>
            <ul className="space-y-3 relative z-10">
              {report.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-red-500 font-bold mt-0.5">!</span>
                  <span className={`${getRiskColor(risk)}`}>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-osint-800/50 border border-osint-700 rounded-xl p-6">
            <h3 className="text-osint-accent font-mono text-sm uppercase mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Network Nodes
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.connections.map((conn, idx) => (
                <span key={idx} className="px-3 py-1 bg-osint-700 rounded text-xs text-gray-300 border border-osint-600 cursor-default">
                  {conn.name} <span className="opacity-50">| {conn.roleOrRelation}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-osint-800/50 border border-osint-700 rounded-xl p-6">
             <h3 className="text-osint-accent font-mono text-sm uppercase mb-4">Digital Footprint</h3>
             <ul className="space-y-2">
                {report.digitalFootprint.map((fp, idx) => (
                  <li key={idx} className="text-sm text-gray-400 border-l-2 border-osint-600 pl-3">{fp}</li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;