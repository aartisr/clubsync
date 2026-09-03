import React, { useState } from 'react';
import { NavigationTab, SchoolConfig } from './types';
import { Navbar } from './components/Navbar';
import { DesignDocView } from './components/DesignDocView';
import { DiagramStudioView } from './components/DiagramStudioView';
import { ScriptHubView } from './components/ScriptHubView';
import { OnboardingSimulator } from './components/OnboardingSimulator';
import { PermissionMatrixView } from './components/PermissionMatrixView';
import { HandoverWizardView } from './components/HandoverWizardView';
import { ProposalGeneratorView } from './components/ProposalGeneratorView';
import { ConfigModal } from './components/ConfigModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { Bot, ShieldCheck, Github, GraduationCap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('design-doc');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);

  const [config, setConfig] = useState<SchoolConfig>({
    schoolName: 'PCSS II',
    domain: 'pioneercss.org',
    githubOrg: 'pcss2-robotics',
    adminEmail: 'it@pioneercss.org',
    roboticsLeadEmail: 'robotics@pioneercss.org',
    secondaryClubLeadEmail: 'csclub@pioneercss.org'
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'design-doc' && (
          <DesignDocView
            config={config}
            onNavigateTab={setActiveTab}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === 'diagrams' && (
          <DiagramStudioView
            config={config}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === 'scripts' && (
          <ScriptHubView
            config={config}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === 'simulator' && (
          <OnboardingSimulator
            config={config}
          />
        )}

        {activeTab === 'permission-matrix' && (
          <PermissionMatrixView
            config={config}
          />
        )}

        {activeTab === 'handover' && (
          <HandoverWizardView
            config={config}
          />
        )}

        {activeTab === 'proposal' && (
          <ProposalGeneratorView
            config={config}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}
      </main>

      {/* Geometric Balance Footer */}
      <footer className="mt-auto bg-white border-t-2 border-slate-900 py-6 text-[10px] uppercase font-bold tracking-widest text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-slate-900 text-white px-2 py-0.5 font-black text-[10px] tracking-tight">
              CLUBSYNC
            </span>
            <span>Powered by GitHub Education & Google Workspace Integration</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              SSO Connected (@{config.domain})
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Backup Enabled ({config.githubOrg})
            </span>
            <span className="text-slate-500">
              Version 2.4 | Admin:{' '}
              <a
                id="admin-profile-link"
                href="https://ai-aarti.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 hover:text-blue-600 font-bold underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
              >
                Aarti S Ravikumar
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* Configuration Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSave={setConfig}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        config={config}
      />
    </div>
  );
}
