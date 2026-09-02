import React, { useState } from 'react';
import { AUTOMATION_SCRIPTS } from '../data/automationScriptsData';
import { SchoolConfig } from '../types';
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Code2, 
  Terminal, 
  FileCode, 
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ScriptHubViewProps {
  config: SchoolConfig;
  onOpenAI: () => void;
}

export const ScriptHubView: React.FC<ScriptHubViewProps> = ({ config, onOpenAI }) => {
  const [activeScriptId, setActiveScriptId] = useState<string>(AUTOMATION_SCRIPTS[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [customParams, setCustomParams] = useState<Record<string, string>>({
    SCHOOL_DOMAIN: config.domain,
    GITHUB_ORG: config.githubOrg,
    ADMIN_EMAIL: config.adminEmail
  });

  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>('');
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customizedCode, setCustomizedCode] = useState<string | null>(null);

  const activeScript = AUTOMATION_SCRIPTS.find(s => s.id === activeScriptId) || AUTOMATION_SCRIPTS[0];

  // Substitute variables in script code template
  const getSubstitutedCode = () => {
    if (customizedCode) return customizedCode;
    let code = activeScript.codeTemplate;
    code = code.replaceAll('{{SCHOOL_DOMAIN}}', customParams.SCHOOL_DOMAIN || config.domain);
    code = code.replaceAll('{{GITHUB_ORG}}', customParams.GITHUB_ORG || config.githubOrg);
    code = code.replaceAll('{{ADMIN_EMAIL}}', customParams.ADMIN_EMAIL || config.adminEmail);
    return code;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSubstitutedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getSubstitutedCode();
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeScript.id}.${activeScript.fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAICustomize = async () => {
    if (!aiCustomPrompt.trim()) return;
    setIsCustomizing(true);
    try {
      const res = await fetch('/api/ai/customize-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptId: activeScript.id,
          scriptCode: getSubstitutedCode(),
          customRequirements: aiCustomPrompt,
          schoolDomain: customParams.SCHOOL_DOMAIN || config.domain,
          githubOrg: customParams.GITHUB_ORG || config.githubOrg
        })
      });
      const data = await res.json();
      if (data.customizedCode) {
        setCustomizedCode(data.customizedCode);
      }
    } catch (err) {
      console.error('Failed to customize script:', err);
    } finally {
      setIsCustomizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Geometric Balance Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900 pb-4 mb-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Automation Scripts
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">WORKSPACE & GITHUB API</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            Google Workspace Sync Scripts
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Google Apps Script, Node.js, and GitHub Actions templates with live variable interpolation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .{activeScript.fileExtension}</span>
          </button>
        </div>
      </header>

      {/* Script Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
        {AUTOMATION_SCRIPTS.map(s => {
          const isActive = activeScriptId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveScriptId(s.id);
                setCustomizedCode(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Parameter Customizer Bar */}
      <div className="bg-slate-900 text-white p-4 shadow-sm border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-l-4 border-blue-500 pl-2">
              Live Parameter Interpolation
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Real-time template substitution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeScript.parameters.map(param => (
            <div key={param.key}>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                {param.label} ({`{{${param.key}}}`})
              </label>
              <input
                type="text"
                value={customParams[param.key] || param.defaultValue}
                onChange={(e) => setCustomParams({ ...customParams, [param.key]: e.target.value })}
                placeholder={param.placeholder}
                className="w-full px-3 py-1.5 text-xs border border-slate-700 bg-slate-950 text-blue-300 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Code Viewer & Prerequisites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Code Output Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-950 p-6 border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-300">
                  {activeScript.id}.{activeScript.fileExtension}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800">
                {activeScript.language}
              </span>
            </div>

            <pre className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed">
              <code>{getSubstitutedCode()}</code>
            </pre>
          </div>

          {/* AI Script Customizer Box */}
          <div className="bg-white border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-l-4 border-blue-800 pl-2">
                Tailor Script with Architecture Advisor
              </h4>
            </div>
            <p className="text-xs text-slate-600">
              Need custom school logic? Describe your specific requirements (e.g. "Add auto-removal of inactive members after 90 days").
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="Describe script modifications..."
                className="flex-1 px-3.5 py-2 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <button
                onClick={handleAICustomize}
                disabled={isCustomizing || !aiCustomPrompt.trim()}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isCustomizing ? 'Generating...' : 'Apply Modifications'}
              </button>
            </div>
          </div>
        </div>

        {/* Prerequisites & Instructions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-l-4 border-blue-800 pl-2">
                Deployment Setup
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Use Case:</span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 border border-slate-200">
                  {activeScript.useCase}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Prerequisites:</span>
                <ul className="space-y-2">
                  {activeScript.prerequisites.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
