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
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'design-doc', label: 'Design Document', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'diagrams', label: 'Diagram Studio', icon: <Network className="w-4 h-4" />, badge: '5 Diagrams' },
    { id: 'scripts', label: 'Sync Scripts', icon: <Terminal className="w-4 h-4" />, badge: 'Code.gs' },
    { id: 'simulator', label: 'Onboarding Simulator', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'permission-matrix', label: 'Permission Matrix', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'handover', label: 'Handover Wizard', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'proposal', label: 'School Proposal', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b-2 border-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Title with Geometric Balance styling */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 text-white font-black text-base shadow-sm border border-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tighter text-xl uppercase text-white">
                  ClubSync
                </span>
                <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  Campus-Wide
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Robotics Club & Inter-Club Collaborative Framework
              </p>
            </div>
          </div>

          {/* Quick Domain & Org Badge */}
          <button
            onClick={onOpenConfig}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:text-white hover:border-slate-500 transition-colors group"
            title="Configure target domain and organization"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-blue-400 font-semibold">@{config.domain}</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300">{config.githubOrg}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-45 transition-transform" />
          </button>

          {/* AI Assistant Quick Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAI}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Geometric Tab Navigation */}
        <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-transparent hover:bg-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1 py-0.2 font-mono font-bold uppercase ${
                    isActive ? 'bg-slate-900 text-blue-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
