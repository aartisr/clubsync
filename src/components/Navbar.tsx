import React from 'react';
import { NavigationTab, SchoolConfig } from '../types';
import { 
  BookOpen, 
  Network, 
  Terminal, 
  PlayCircle, 
  ShieldCheck, 
  GraduationCap, 
  FileText, 
  Settings, 
  Sparkles,
  Bot
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  config: SchoolConfig;
  onOpenConfig: () => void;
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenConfig,
  onOpenAI
}) => {
  const tabs: { id: NavigationTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'design-doc', label: 'Design document', shortLabel: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'diagrams', label: 'Diagram studio', shortLabel: 'Diagrams', icon: <Network className="w-4 h-4" /> },
    { id: 'scripts', label: 'Sync scripts', shortLabel: 'Scripts', icon: <Terminal className="w-4 h-4" /> },
    { id: 'simulator', label: 'Onboarding simulator', shortLabel: 'Simulate', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'permission-matrix', label: 'Permission matrix', shortLabel: 'Access', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'handover', label: 'Handover wizard', shortLabel: 'Handover', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'proposal', label: 'School proposal', shortLabel: 'Proposal', icon: <FileText className="w-4 h-4" /> },
    { id: 'it-guide', label: 'IT implementation guide', shortLabel: 'IT Setup', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-3 gap-3">
          
          {/* Logo & Brand Title with Geometric Balance styling */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-lg sm:text-xl text-white">
                  ClubSync
                </span>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-blue-300">Workspace</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Governance made clear for every club
              </p>
            </div>
          </div>

          {/* Quick Domain & Org Badge */}
          <button
            onClick={onOpenConfig}
            className="hidden md:flex min-h-10 items-center gap-2 rounded-md px-3 bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:text-white hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-colors group"
            title="Configure target domain and organization"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-blue-400 font-semibold">@{config.domain}</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300">{config.githubOrg}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-45 transition-transform" />
          </button>

          {/* AI Assistant Quick Trigger Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenConfig}
              aria-label="Open school settings"
              className="md:hidden inline-flex items-center justify-center min-h-10 min-w-10 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAI}
              className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 sm:px-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <label htmlFor="workspace-navigation" className="sr-only">Choose workspace</label>
          <select
            id="workspace-navigation"
            value={activeTab}
            onChange={(event) => setActiveTab(event.target.value as NavigationTab)}
            className="w-full min-h-11 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.shortLabel}</option>)}
          </select>
        </div>

        <nav aria-label="Workspace" className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                title={tab.label}
                className={`flex min-h-10 items-center gap-2 rounded-md px-3 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
