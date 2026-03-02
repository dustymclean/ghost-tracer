import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Printer } from 'lucide-react';
import { ChatMessage, OsintReport } from '../types';
import { chatWithOsintContext } from '../services/geminiService';

interface ChatInterfaceProps {
  report: OsintReport;
  onClose?: () => void;
  apiKey: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ report, onClose, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `I've analyzed the data for ${report.targetName}. What specific details or connections would you like to explore further?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for API (excluding the latest user message which is passed as current)
      const apiHistory = messages.map(m => ({ role: m.role, content: m.content }));
      
      const responseText = await chatWithOsintContext(apiHistory, userMsg.content, report, apiKey);
      
      const botMsg: ChatMessage = { 
        role: 'model', 
        content: responseText || "I couldn't generate a response based on the current context.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Connection error. Unable to query intelligence database.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePrintChat = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Chat Transcript - ${report.targetName}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          h1 { font-size: 24px; margin: 0 0 5px 0; text-transform: uppercase; }
          .meta { font-size: 12px; color: #666; }
          .message { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed #ddd; }
          .message:last-child { border-bottom: none; }
          .role-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px; text-transform: uppercase; font-weight: bold; }
          .role-user { color: #0000aa; }
          .role-model { color: #aa0000; }
          .content { white-space: pre-wrap; line-height: 1.5; font-size: 13px; }
          .footer { margin-top: 50px; font-size: 10px; text-align: center; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Investigation Chat Log</h1>
          <div class="meta">
            Target: ${report.targetName} | Generated: ${new Date().toLocaleString()}
          </div>
        </div>
        
        ${messages.map(msg => `
          <div class="message">
            <div class="role-header">
              <span class="${msg.role === 'user' ? 'role-user' : 'role-model'}">
                ${msg.role === 'user' ? 'ANALYST (USER)' : 'GHOSTTRACE AI'}
              </span>
              <span style="font-weight: normal; color: #888;">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="content">${msg.content}</div>
          </div>
        `).join('')}

        <div class="footer">
          GhostTrace OSINT &bull; Confidential
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="flex flex-col h-full bg-osint-900 border-l border-osint-700 w-full max-w-md shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-osint-700 bg-osint-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h2 className="text-sm font-mono font-bold text-white tracking-wider">INTEL_CHAT_V2</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrintChat} className="text-gray-400 hover:text-white transition-colors" title="Print Transcript">
            <Printer className="w-4 h-4" />
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-osint-600' : 'bg-osint-accent/20 text-osint-accent'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-osint-700 text-white rounded-tr-none' 
                : 'bg-osint-800 border border-osint-700 text-gray-300 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-osint-accent/20 text-osint-accent flex items-center justify-center">
               <Bot className="w-4 h-4" />
             </div>
             <div className="bg-osint-800 border border-osint-700 p-3 rounded-lg rounded-tl-none flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-osint-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-osint-400 rounded-full animate-bounce delay-75"></span>
               <span className="w-1.5 h-1.5 bg-osint-400 rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-osint-800 border-t border-osint-700">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Interrogate data..."
            className="w-full bg-osint-900 border border-osint-600 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-osint-accent focus:ring-1 focus:ring-osint-accent transition-all font-mono text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-osint-accent hover:bg-osint-accent/10 rounded-md transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;