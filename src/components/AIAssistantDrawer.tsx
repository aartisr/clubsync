import React, { useState } from 'react';
import { AIChatMessage, SchoolConfig } from '../types';
import { ExecutiveMarkdown } from './ExecutiveMarkdown';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  Code2, 
  GraduationCap 
} from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose, config }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your **ClubSync AI Architecture Assistant**. I can help you customize Google Workspace sync scripts, answer school IT security questions, or draft proposals for your principal or IT director regarding GitHub Education. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I explain FERPA compliance for this setup to my IT Director?',
    'Write a Google Apps Script trigger function for daily sync.',
    'How do we handle student graduation when accounts are suspended?'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          context: {
            schoolName: config.schoolName,
            domain: config.domain,
            githubOrg: config.githubOrg
          }
        })
      });

      const data = await res.json();
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process your request.',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Assistant error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while connecting to the AI service. Please ensure GEMINI_API_KEY is configured.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 flex justify-end">
      <div className="w-full max-w-md bg-slate-900 text-white h-full shadow-2xl border-l-2 border-slate-700 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/40 text-blue-300 border border-blue-700">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight text-white">AI Architecture Advisor</h3>
              <p className="text-[10px] font-mono uppercase font-bold text-slate-400">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 flex items-center justify-center shrink-0 text-xs font-bold border ${
                msg.role === 'user' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`p-3.5 text-xs max-w-[85%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white border border-blue-500'
                  : 'bg-slate-950 text-slate-200 border border-slate-800'
              }`}>
                <ExecutiveMarkdown 
                  content={msg.content} 
                  theme={msg.role === 'user' ? 'light' : 'dark'} 
                />
                <span className={`text-[9px] font-mono block mt-1.5 text-right ${
                  msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-blue-400 p-2 font-mono">
              <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              <span>Analyzing architecture rules & generating advice...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t-2 border-slate-800 bg-slate-950 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Queries:
          </span>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="text-left px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors border border-slate-800 truncate"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t-2 border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI about Google Workspace sync, GitHub SAML, or FERPA..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white border border-blue-400 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
