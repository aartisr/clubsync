import React, { useState, useEffect } from 'react';
import { NavigationTab, SchoolConfig } from '../types';
import {
  GitBranch,
  Shield,
  Activity,
  Globe,
  BookOpen,
  Network,
  Terminal,
  PlayCircle,
  ShieldCheck,
  GraduationCap,
  FileText,
  Settings,
  Sparkles,
  Bot,
  ChevronDown,
  Search,
  Github,
  Command,
  Layers,
  Sliders,
  X,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  config: SchoolConfig;
  onOpenConfig: () => void;
  onOpenAI: () => void;
  onOpenGitHubModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenConfig,
  onOpenAI,
  onOpenGitHubModal,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuCategories = [
    {
      id: 'repos-access',
      title: 'Repos & Access',
      badge: 'Core',
      items: [
        {
          id: 'repositories' as NavigationTab,
          label: 'Team Repositories',
          desc: 'Self-service repo creation & branch rules',
          icon: <GitBranch className="w-4 h-4 text-indigo-400" />,
        },
        {
          id: 'oversight' as NavigationTab,
          label: 'Master Oversight',
          desc: 'Faculty advisor override & security audit',
          icon: <Shield className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'contributions' as NavigationTab,
          label: 'Contribution Analytics',
          desc: 'Commit heatmaps, PR velocity & LOC stats',
          icon: <Activity className="w-4 h-4 text-blue-400" />,
        },
        {
          id: 'vercel-deploy' as NavigationTab,
          label: 'Vercel Staging',
          desc: 'Live staging verification & API testing',
          icon: <Globe className="w-4 h-4 text-purple-400" />,
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture & Specs',
      badge: 'Docs',
      items: [
        {
          id: 'design-doc' as NavigationTab,
          label: 'RFC Design Document',
          desc: 'SAML SSO & Google Workspace specification',
          icon: <BookOpen className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'diagrams' as NavigationTab,
          label: 'Diagram Studio',
          desc: 'Interactive dataflow & sync topology',
          icon: <Network className="w-4 h-4 text-cyan-400" />,
        },
        {
          id: 'scripts' as NavigationTab,
          label: 'Sync Scripts Hub',
          desc: 'GAM & GitHub CLI automation scripts',
          icon: <Terminal className="w-4 h-4 text-rose-400" />,
        },
        {
          id: 'simulator' as NavigationTab,
          label: 'Onboarding Simulator',
          desc: 'Simulate student group provisioning',
          icon: <PlayCircle className="w-4 h-4 text-emerald-400" />,
        },
      ],
    },
    {
      id: 'governance',
      title: 'Governance & Handover',
      badge: 'Policy',
      items: [
        {
          id: 'permission-matrix' as NavigationTab,
          label: 'Permission Matrix',
          desc: 'Role mapping & RBAC policy breakdown',
          icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
        },
        {
          id: 'handover' as NavigationTab,
          label: 'Handover Wizard',
          desc: 'Graduation leadership transition guide',
          icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'proposal' as NavigationTab,
          label: 'School Proposal',
          desc: 'Principal & IT admin executive summary',
          icon: <FileText className="w-4 h-4 text-blue-400" />,
        },
      ],
    },
  ];

  const allItems = menuCategories.flatMap((cat) => cat.items);

  const filteredCommandItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand / Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black tracking-tight text-lg text-white">ClubSync</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Enterprise
                  </span>
                </div>
              </div>
            </div>

            {/* Categorized Mega-Menu Header Items (NO horizontal scroll) */}
            <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
              {menuCategories.map((category) => {
                const isCatActive = category.items.some((item) => item.id === activeTab);
                const isOpen = openDropdown === category.id;

                return (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(category.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : category.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isCatActive
                          ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{category.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-400' : ''
                        }`}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full pt-2 w-72 z-50"
                        >
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl space-y-1">
                            {category.items.map((item) => {
                              const isSelected = activeTab === item.id;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setActiveTab(item.id);
                                    setOpenDropdown(null);
                                  }}
                                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                                    isSelected
                                      ? 'bg-blue-600 text-white shadow-md'
                                      : 'hover:bg-slate-800 text-slate-200'
                                  }`}
                                >
                                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 shrink-0 mt-0.5">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-xs">{item.label}</h4>
                                    <p className={`text-[11px] leading-tight mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                      {item.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Right Side: GitHub Live Org Connection Badge & Actions */}
            <div className="flex items-center gap-2">
              {/* Live GitHub Org Badge */}
              <button
                onClick={onOpenGitHubModal}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all group"
                title="Connect or Sync Real GitHub Organization"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Github className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                <span className="font-mono text-emerald-400 font-bold">@{config.githubOrg}</span>
              </button>

              {/* Command Palette Trigger */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-xl text-xs font-medium transition-all"
                title="Search views and actions (Cmd + K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400 font-bold">
                  ⌘K
                </kbd>
              </button>

              {/* Ask AI Trigger */}
              <button
                onClick={onOpenAI}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          {/* Mobile Category Dropdown Selector (Zero Horizontal Scroll) */}
          <div className="lg:hidden pb-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as NavigationTab)}
              className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {menuCategories.map((cat) => (
                <optgroup key={cat.id} label={cat.title}>
                  {cat.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Command Palette Modal (Cmd + K) */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col text-white"
            >
              <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Search workspace views, repositories, rules, or scripts..."
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500 font-medium"
                />
                <button
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto divide-y divide-slate-800/40 text-xs">
                {filteredCommandItems.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">No matching workspace views found.</div>
                ) : (
                  filteredCommandItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200 group-hover:text-white">{item.label}</h4>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-1 bg-slate-800 text-slate-400 rounded group-hover:text-blue-400">
                        Navigate →
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
