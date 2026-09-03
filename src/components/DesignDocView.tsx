import React, { useState } from 'react';
import { DESIGN_DOC_SECTIONS } from '../data/designDocData';
import { SchoolConfig, NavigationTab } from '../types';
import { ExecutiveMarkdown } from './ExecutiveMarkdown';
import { ExecutiveProblemMatrix } from './ExecutiveProblemMatrix';
import { 
  Search, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Bookmark, 
  ArrowRight,
  ShieldCheck,
  Layers,
  Key,
  Cpu,
  Lock,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Mail,
  Zap,
  DollarSign,
  Clock,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Send,
  Briefcase
} from 'lucide-react';

interface DesignDocViewProps {
  config: SchoolConfig;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenAI: () => void;
}

export const DesignDocView: React.FC<DesignDocViewProps> = ({
  config,
  onNavigateTab,
  onOpenAI
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(DESIGN_DOC_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isPlainEnglishMode, setIsPlainEnglishMode] = useState<boolean>(true);
  const [testEmailInput, setTestEmailInput] = useState<string>(`robotics-leads@${config.domain}`);
  const [testResult, setTestResult] = useState<any>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-blue-700" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-700" />;
      case 'Key': return <Key className="w-5 h-5 text-amber-700" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-700" />;
      case 'Lock': return <Lock className="w-5 h-5 text-purple-700" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-rose-700" />;
      default: return <Bookmark className="w-5 h-5 text-blue-700" />;
    }
  };

  // Plain-English translations to eliminate cognitive overload for any stakeholder
  const plainEnglishSummaries: Record<string, { summary: string; benefit: string; quote: string }> = {
    'executive-summary': {
      summary: "Instead of students creating random personal GitHub accounts and losing club code when they graduate, PCSS II sets up a free, official school hub where students log in using their normal school email.",
      benefit: "Saves 100% of club code, protects school intellectual property, and costs $0.00 forever.",
      quote: "Zero passwords lost. Zero orphaned projects when seniors graduate."
    },
    'github-org-structure': {
      summary: "Think of this like folders in Google Drive: Robotics has its private locker, CS has its private locker, but both clubs share a joint collaborative table to work together on robot camera and AI code.",
      benefit: "Clean boundaries: no one can accidentally break or delete another club's work.",
      quote: "Granular teams mirror real software engineering organizations."
    },
    'workspace-sso-auth': {
      summary: "Students sign in by clicking 'Log in with Google' using their official @pioneercss.org account. No new passwords to remember. If a student leaves PCSS II, their code access disappears automatically.",
      benefit: "100% FERPA compliant: zero private student data stored in GitHub.",
      quote: "One click for students, zero account management tickets for school IT."
    },
    'automated-onboarding': {
      summary: "When a faculty sponsor adds a student to the robotics email list, our background script automatically sends them an invite to the club's GitHub team within seconds.",
      benefit: "Teachers don't have to manually manage student permissions every semester.",
      quote: "From email sign-up to writing robot code in under 60 seconds."
    },
    'granular-permissions': {
      summary: "General club members can view and write code, but cannot delete code branches or change club security settings. Only appointed student leads and the faculty mentor have admin rights.",
      benefit: "Accident-proof: no single student can accidentally erase a whole competition repository.",
      quote: "Safety railings everywhere so students learn without fear of breaking things."
    },
    'cross-club-synergy': {
      summary: "Robotics and CS students share computer vision algorithms and competition website templates in shared folders without exposing their private club files to each other.",
      benefit: "Multiplies STEM learning across PCSS II clubs instead of working in isolated silos.",
      quote: "Cross-disciplinary innovation without compromising security."
    },
    'handover-protocol': {
      summary: "A step-by-step checklist and script run each spring: graduating seniors promote junior captains to admin, while the faculty advisor remains the permanent backup owner.",
      benefit: "Institutional continuity: next year's team never starts from scratch.",
      quote: "Year-over-year preservation of club trophies, code, and CAD models."
    }
  };

  // Recommended emails ending in pioneercss.org
  const pioneercssEmailDirectory = [
    { email: `robotics@${config.domain}`, category: 'Robotics', role: 'All Robotics Club Roster', team: 'robotics-members', access: 'Read & Clone' },
    { email: `robotics-leads@${config.domain}`, category: 'Robotics', role: 'Student Team Captains & Officers', team: 'robotics-leads', access: 'Admin (Club Repos)' },
    { email: `robotics-software@${config.domain}`, category: 'Robotics', role: 'Autonomous Navigation & ROS 2 Devs', team: 'robotics-software', access: 'Write (Firmware & Vision)' },
    { email: `robotics-hardware@${config.domain}`, category: 'Robotics', role: 'Mechanical Build & Onshape CAD Team', team: 'robotics-hardware', access: 'Write (CAD & Hardware)' },
    { email: `csclub@${config.domain}`, category: 'CS & STEM', role: 'Computer Science Club Members', team: 'cs-developers', access: 'Write (CS Repos)' },
    { email: `cross-club-stem@${config.domain}`, category: 'Cross-Club', role: 'Joint Robotics + CS AI Vision Taskforce', team: 'cross-club-ai', access: 'Write (Shared Repos)' },
    { email: `it@${config.domain}`, category: 'Administration', role: 'PCSS II IT Director & Systems Admin', team: 'school-it-admins', access: 'Organization Owner' },
    { email: `robotics.advisor@${config.domain}`, category: 'Faculty', role: 'Robotics Faculty Sponsor / Teacher', team: 'faculty-sponsors', access: 'Permanent Co-Owner' }
  ];

  const handleTestEmail = (emailToTest?: string) => {
    const target = (emailToTest || testEmailInput).trim().toLowerCase();
    const isPcss = target.endsWith(`@${config.domain}`);
    const match = pioneercssEmailDirectory.find(e => e.email.toLowerCase() === target);

    if (!isPcss) {
      setTestResult({
        valid: false,
        email: target,
        message: `Rejected: Email must end with official school domain @${config.domain} to satisfy PCSS II SSO policy.`
      });
      return;
    }

    if (match) {
      setTestResult({
        valid: true,
        email: match.email,
        category: match.category,
        role: match.role,
        team: match.team,
        access: match.access,
        message: `Recognized PCSS II Group: Automatically assigned to GitHub Team '${match.team}' with ${match.access} privileges.`
      });
    } else {
      // Individual student email format
      setTestResult({
        valid: true,
        email: target,
        category: 'Student Individual',
        role: 'Verified PCSS II Student Member',
        team: 'robotics-members (Default)',
        access: 'Read / Clone & Branch Create',
        message: `Valid PCSS II Student Identity: Authenticated via Google SAML. Granted standard member access.`
      });
    }
  };

  const filteredSections = DESIGN_DOC_SECTIONS.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show one decision at a time by default. Searching deliberately expands the
  // reading surface to the matching sections so people can compare results.
  const visibleSections = searchQuery.trim()
    ? filteredSections
    : filteredSections.filter((sec) => sec.id === activeSectionId);

  const handleCopyLink = (secId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}#${secId}`);
    setCopiedSection(secId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Geometric Balance Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900 pb-4 mb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              Institutional Design Document
            </span>
            <span className="bg-slate-800 text-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
              {config.schoolName} • @{config.domain}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
            Campus GitHub Architecture
          </h1>
          <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1">
            Official Multi-Club Engineering & Google Workspace Governance Framework for {config.schoolName}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Mode Switcher: Zero Cognitive Overload Toggle */}
          <div className="grid grid-cols-2 bg-white border border-slate-300 p-1 shadow-xs">
            <button
              onClick={() => setIsPlainEnglishMode(true)}
              aria-pressed={isPlainEnglishMode}
              className={`min-h-10 justify-center px-3 py-1.5 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isPlainEnglishMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Plain English</span>
            </button>
            <button
              onClick={() => setIsPlainEnglishMode(false)}
              aria-pressed={!isPlainEnglishMode}
              className={`min-h-10 justify-center px-3 py-1.5 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                !isPlainEnglishMode
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="flex min-h-10 items-center justify-center gap-1.5 px-3 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onOpenAI}
              className="flex min-h-10 items-center justify-center gap-1.5 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* PCSS II Executive Fast-Facts Strip (Zero Cognitive Overload) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white border-2 border-slate-900 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
              Direct Cost to {config.schoolName}
            </span>
            <span className="text-xl font-black text-slate-900 block tracking-tight">
              $0.00 / 100% Free
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Full GitHub Education Campus benefits grant-funded for accredited schools.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-slate-900 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-blue-100 text-blue-800 border border-blue-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
              IT Setup Overhead
            </span>
            <span className="text-xl font-black text-slate-900 block tracking-tight">
              ~15 Minutes
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              One-time Google Workspace SAML SSO app link. Zero ongoing tickets.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-slate-900 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-purple-100 text-purple-800 border border-purple-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
              FERPA & Data Privacy
            </span>
            <span className="text-xl font-black text-slate-900 block tracking-tight">
              100% Compliant
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Zero student PII stored. Accounts bound directly to @{config.domain}.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-slate-900 shadow-xs flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
              Graduation Continuity
            </span>
            <span className="text-xl font-black text-slate-900 block tracking-tight">
              0 Code Abandoned
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Automated handoff scripts ensure repositories survive student graduation.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive PCSS II (@pioneercss.org) Email & Group Directory Blueprint */}
      <section className="bg-white border-2 border-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-900 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-700" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                {config.schoolName} (@{config.domain}) Identity & Email Directory Blueprint
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Official recommended Google Groups and aliases ending in @{config.domain} mapped directly to GitHub Teams.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2.5 py-1 border border-blue-300 shrink-0">
            8 Recommended Aliases
          </span>
        </div>

        {/* Directory Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-mono uppercase text-[10px] tracking-wider">
                <th className="p-2.5 border border-slate-800">Category</th>
                <th className="p-2.5 border border-slate-800">Group Email (@{config.domain})</th>
                <th className="p-2.5 border border-slate-800">Target Role in Club</th>
                <th className="p-2.5 border border-slate-800">GitHub Team Slug</th>
                <th className="p-2.5 border border-slate-800">Default Access</th>
                <th className="p-2.5 border border-slate-800 text-right">Quick Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pioneercssEmailDirectory.map((entry, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-2.5 border border-slate-200 font-bold text-slate-800">
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-[10px]">
                      {entry.category}
                    </span>
                  </td>
                  <td className="p-2.5 border border-slate-200 font-mono font-bold text-blue-800">
                    {entry.email}
                  </td>
                  <td className="p-2.5 border border-slate-200 text-slate-700">
                    {entry.role}
                  </td>
                  <td className="p-2.5 border border-slate-200 font-mono text-slate-600">
                    {entry.team}
                  </td>
                  <td className="p-2.5 border border-slate-200 font-bold text-slate-800">
                    <span className={`px-1.5 py-0.5 text-[10px] ${
                      entry.access.includes('Admin') || entry.access.includes('Owner')
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : entry.access.includes('Write')
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}>
                      {entry.access}
                    </span>
                  </td>
                  <td className="p-2.5 border border-slate-200 text-right">
                    <button
                      onClick={() => {
                        setTestEmailInput(entry.email);
                        handleTestEmail(entry.email);
                      }}
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-blue-600 hover:text-white border border-slate-300 transition-colors"
                    >
                      Simulate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Email Test Simulator (Zero Cognitive Overload) */}
        <div className="p-4 bg-slate-50 border border-slate-300 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Interactive @{config.domain} Identity & Permission Validator
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Try typing any student or group address to verify instant access mapping
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testEmailInput}
              onChange={(e) => setTestEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestEmail()}
              placeholder={`e.g. alex.chen@${config.domain} or robotics-software@${config.domain}`}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 bg-white font-mono focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={() => handleTestEmail()}
              className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Validate Email</span>
            </button>
          </div>

          {testResult && (
            <div className={`p-3 border text-xs leading-relaxed flex items-start gap-2.5 transition-all ${
              testResult.valid 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {testResult.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">{testResult.email}</span>
                  {testResult.valid && (
                    <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase font-mono">
                      VERIFIED @{config.domain}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium">{testResult.message}</p>
                {testResult.valid && testResult.team && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-slate-700">
                    <span className="bg-white px-2 py-0.5 border border-slate-300">Team: <strong>{testResult.team}</strong></span>
                    <span className="bg-white px-2 py-0.5 border border-slate-300">Access: <strong>{testResult.access}</strong></span>
                    <span className="bg-white px-2 py-0.5 border border-slate-300">FERPA Guard: <strong>Active</strong></span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Layout: Sticky Sidebar Table of Contents + Content Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sticky Table of Contents Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-24 bg-white border border-slate-300 p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-l-4 border-blue-800 pl-2">
                Architecture Sections
              </h3>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {filteredSections.length} SECTIONS
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter design topics..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <nav className="space-y-1 max-h-[55vh] overflow-y-auto no-scrollbar">
              {filteredSections.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-current={isActive ? 'location' : undefined}
                    className={`w-full min-h-10 text-left px-3 py-2 text-xs transition-all flex items-start gap-2 border-l-2 ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 font-bold border-blue-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400 mt-0.5">{sec.number}</span>
                    <span className="line-clamp-1">{sec.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                onClick={() => onNavigateTab('diagrams')}
                className="w-full flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-800 transition-colors group"
              >
                <span>Interactive Visual Diagrams</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigateTab('scripts')}
                className="w-full flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-800 transition-colors group"
              >
                <span>Google Workspace Sync Code</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigateTab('handover')}
                className="w-full flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-800 transition-colors group"
              >
                <span>Graduation Handover Wizard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="lg:col-span-3 space-y-8">
          {visibleSections.map((sec) => (
            <article
              key={sec.id}
              id={sec.id}
              className={`bg-white border-2 p-6 sm:p-8 shadow-sm transition-all ${
                activeSectionId === sec.id
                  ? 'border-blue-800 ring-1 ring-blue-800'
                  : 'border-slate-300'
              }`}
            >
              {/* Section Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-100 border border-slate-300 text-slate-800">
                    {getIcon(sec.icon)}
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-l-4 border-blue-800 pl-2 mb-1">
                      Section {sec.number}
                    </h2>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {sec.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(sec.id)}
                    className="p-2 border border-slate-300 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Copy section link"
                  >
                    {copiedSection === sec.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Zero Cognitive Overload: Plain-English Card (Highlighted when active) */}
              {isPlainEnglishMode && plainEnglishSummaries[sec.id] && (
                <div className="my-6 p-4 bg-blue-50 border-2 border-blue-600 text-slate-900 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      In Simple Words (Zero Jargon)
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-blue-200 text-blue-900 px-2 py-0.2">
                      EXECUTIVE TAKEAWAY
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800">
                    {plainEnglishSummaries[sec.id].summary}
                  </p>
                  <div className="pt-2 border-t border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-blue-950 font-bold gap-2">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Benefit: {plainEnglishSummaries[sec.id].benefit}
                    </span>
                    <span className="font-mono text-[11px] text-blue-800 italic">
                      "{plainEnglishSummaries[sec.id].quote}"
                    </span>
                  </div>
                </div>
              )}

              {/* Architecture Overview Card */}
              <div className="my-6 p-4 bg-slate-50 border border-slate-300 text-xs leading-relaxed text-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                  Architecture Overview
                </p>
                {sec.summary}
              </div>

              {/* Key Directives Grid */}
              <div className="my-6 space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Key Architectural Directives for {config.schoolName}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sec.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 text-xs text-slate-800">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Problem & Risk Matrix for Section 1.0 (Zero Cognitive Overload for Leadership) */}
              {sec.id === 'executive-summary' && (
                <ExecutiveProblemMatrix config={config} />
              )}

              {/* High-Fidelity Executive Markdown Rendering (Zero Raw Markdown Symbols) */}
              <div className="my-6">
                <ExecutiveMarkdown 
                  content={sec.contentMarkdown
                    .replace(/@school\.edu/g, `@${config.domain}`)
                    .replace(/@school-clubs-org/g, `@${config.githubOrg}`)
                    .replace(/school\.edu/g, config.domain)
                  } 
                />
              </div>

              {/* Quick Reference Action Buttons */}
              <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-4">
                {sec.diagramRef && (
                  <button
                    onClick={() => onNavigateTab('diagrams')}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Interactive Architecture Diagram</span>
                  </button>
                )}

                {sec.scriptsRef && sec.scriptsRef.length > 0 && (
                  <button
                    onClick={() => onNavigateTab('scripts')}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Sync Script Code</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
