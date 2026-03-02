import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSave: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentApiKey, onSave }) => {
  const [key, setKey] = useState(currentApiKey);
  
  useEffect(() => {
    setKey(currentApiKey);
  }, [currentApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(key);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-osint-900 border border-osint-700 w-full max-w-md rounded-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-osint-800 bg-osint-800/50">
          <div className="flex items-center gap-2 text-osint-accent">
            <Key className="w-5 h-5" />
            <h2 className="text-lg font-mono font-bold tracking-wider uppercase">Access Configuration</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wide">
              Gemini API Key
            </label>
            <div className="relative group">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-osint-950 border border-osint-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-osint-accent focus:ring-1 focus:ring-osint-accent font-mono text-sm transition-all placeholder-gray-700"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-osint-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-gray-500">
              Your key is stored locally in your browser and used only for direct API requests.
            </p>
          </div>

          <div className="pt-2">
             <button
               type="submit"
               className="w-full bg-osint-accent/10 hover:bg-osint-accent/20 text-osint-accent border border-osint-accent/50 hover:border-osint-accent py-3 rounded-lg font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all group"
             >
               <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
               SAVE CONFIGURATION
             </button>
          </div>
        </form>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-osint-accent to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default SettingsModal;